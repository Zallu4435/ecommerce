const User = require("../model/User");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const { sendAdminToken } = require("../utils/jwtToken");
const Address = require("../model/Address");
const Orders = require("../model/Orders");
const Product = require("../model/Products");
const Category = require("../model/Categories");
const Coupon = require("../model/Coupon");
const mongoose = require("mongoose");

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not an admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendAdminToken(user, 201, res);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.logoutAdmin = async (req, res, next) => {
  res.cookie("adminRefreshToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({
    success: true,
    message: "Logout successful",
  });
};

exports.banUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: "user blocked ",
    });
  } catch (error) {
    return next(error);
  }
};

exports.adminRefreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.admin);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        requireLogin: true,
      });
    }

    sendAdminToken(user, 200, res);
  } catch (error) {
    next(new ErrorHandler("Token refresh failed", 500));
  }
};

exports.getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const addresses = await Address.find({ userId: id });

    const orders = await Orders.find({ UserId: id })
      .populate({
        path: 'items.ProductId',
        select: 'productName image offerPrice'
      })
      .sort({ createdAt: -1 })
      .limit(5);

    // Transform orders to include product details in items
    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.map(item => ({
        ...item,
        ProductName: item.ProductId?.productName || 'Unknown Product',
        ProductImage: item.ProductId?.image || '',
        offerPrice: item.ProductId?.offerPrice || item.Price
      }));
      return orderObj;
    });

    res.status(200).json({
      user,
      addresses,
      orders: transformedOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.adminDashboard = async (req, res) => {
  try {
    const { type, year, month, week } = req.query;
    let startDate, endDate;

    const numericYear = parseInt(year);
    const numericMonth = parseInt(month);
    const numericWeek = parseInt(week);

    const getWeekDates = (year, month, weekNum) => {
      const firstDayOfMonth = new Date(year, month - 1, 1);

      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(1 + (weekNum - 1) * 7);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const lastDayOfMonth = new Date(year, month, 0);
      if (endDate > lastDayOfMonth) {
        endDate.setTime(lastDayOfMonth.getTime());
      }

      endDate.setHours(23, 59, 59, 999);

      return { startDate, endDate };
    };

    if (type === "yearly") {
      startDate = new Date(numericYear, 0, 1);
      endDate = new Date(numericYear, 11, 31, 23, 59, 59, 999);
    } else if (type === "monthly") {
      startDate = new Date(numericYear, numericMonth - 1, 1);
      endDate = new Date(numericYear, numericMonth, 0, 23, 59, 59, 999);
    } else if (type === "weekly") {
      const weekDates = getWeekDates(numericYear, numericMonth, numericWeek);
      startDate = weekDates.startDate;
      endDate = weekDates.endDate;
    }

    const orders = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          dailyRevenue: { $sum: "$items.Price" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const getDatesInRange = (start, end) => {
      const dates = [];
      const current = new Date(start);

      while (current <= end) {
        dates.push(new Date(current).toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }

      return dates;
    };

    const allDates = getDatesInRange(startDate, endDate);
    const dailyData = allDates.map((date) => {
      const dayData = orders.find((order) => order._id === date);
      return {
        date,
        revenue: dayData ? dayData.dailyRevenue : 0,
        orders: dayData ? dayData.orderCount : 0,
      };
    });

    const totalRevenue = orders.reduce((sum, day) => sum + day.dailyRevenue, 0);
    const totalOrders = orders.reduce((sum, day) => sum + day.orderCount, 0);
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
      dailyData,
      dateRange: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  if (!search || typeof search !== "string") {
    return res
      .status(400)
      .json({ message: "Search query is required and must be a string" });
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  try {
    const users = await User.find({
      $and: [
        { role: { $ne: "admin" } },
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ],
    })
      .skip(skip)
      .limit(limitNumber);

    const totalUsers = await User.countDocuments({
      $and: [
        { role: { $ne: "admin" } },
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ],
    });

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.username,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json({
      success: true,
      users: formattedUsers,
      totalUsers,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  if (!search || typeof search !== "string") {
    return res
      .status(400)
      .json({ message: "Search search is required and must be a string" });
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  try {
    const products = await Product.find({
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments({
      $or: [
        { productName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      products: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        originalPrice: product.originalPrice,
        offerPrice: product.offerPrice,
        image: product.image,
      })),
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

exports.searchOrders = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ message: "Search query is required and must be a string" });
    }

    // Check if query is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(query) && query.length === 24;

    const orders = await Orders.aggregate([
      // First match by order ID if it's a valid ObjectId
      ...(isValidObjectId ? [{
        $match: {
          _id: new mongoose.Types.ObjectId(query)
        }
      }] : []),
      {
        $lookup: {
          from: "users",
          localField: "UserId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.ProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      // Match by username, email, or product name if not searching by order ID
      ...(!isValidObjectId ? [{
        $match: {
          $or: [
            { "userDetails.username": { $regex: query, $options: "i" } },
            { "userDetails.email": { $regex: query, $options: "i" } },
            { "productDetails.productName": { $regex: query, $options: "i" } },
          ],
        },
      }] : []),
      {
        $project: {
          _id: 1,
          orderId: {
            $concat: [
              "ORD-",
              { $toUpper: { $substr: [{ $toString: "$_id" }, 0, 8] } }
            ]
          },
          userName: "$userDetails.username",
          userEmail: "$userDetails.email",
          totalAmount: "$TotalAmount",
          orderStatus: "$orderStatus",
          orderDate: "$createdAt",
          itemCount: { $size: "$items" },
          productImages: {
            $map: {
              input: { $slice: ["$items", 3] },
              as: "item",
              in: {
                $let: {
                  vars: {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$productDetails",
                            cond: { $eq: ["$$this._id", "$$item.ProductId"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$product.image",
                },
              },
            },
          },
        },
      },
      { $sort: { orderDate: -1 } },
    ]);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in searchOrders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchCategories = async (req, res) => {
  const query = req.query.query;
  try {
    const categories = await Category.find({
      $or: [
        { categoryName: { $regex: query, $options: "i" } },
        { categoryDescription: { $regex: query, $options: "i" } },
        { offerName: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.searchCoupons = async (req, res) => {
  const query = req.query.query;
  try {
    const coupons = await Coupon.find({
      $or: [
        { couponCode: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coupons", error });
  }
};

exports.searchIndividualOrders = async (req, res) => {
  try {
    const query = req.query.query;
    const email = req.query.email;

    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ message: "Search query is required and must be a string" });
    }

    // Optional: limit search to a specific user's orders if email provided
    let userIdFilter = null;
    if (email && typeof email === "string") {
      const user = await User.findOne({ email });
      if (user) {
        userIdFilter = user._id;
      } else {
        // If email provided but user not found, return empty results
        return res.status(200).json({ orders: [] });
      }
    }

    const pipeline = [];
    if (userIdFilter) {
      pipeline.push({ $match: { UserId: userIdFilter } });
    }
    pipeline.push(
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.ProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $match: {
          $or: [
            { "productDetails.productName": { $regex: query, $options: "i" } },
            { "productDetails.category": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          UserId: 1,
          TotalAmount: 1,
          createdAt: 1,
          updatedAt: 1,
          Status: "$items.Status",
          ProductId: "$items.ProductId",
          Price: "$items.Price",
          Quantity: "$items.Quantity",
          ProductName: "$productDetails.productName",
          ProductImage: "$productDetails.image",
          offerPrice: "$productDetails.offerPrice",
          itemsIds: "$items._id",
        },
      },
      { $sort: { updatedAt: -1 } }
    );

    const matchedItems = await Orders.aggregate(pipeline);
    return res.status(200).json({ orders: matchedItems });
  } catch (error) {
    console.error("Error in searchIndividualOrders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Add this to adminController.js after searchIndividualOrders

exports.searchAllOrders = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query || typeof query !== "string") {
      return res
        .status(400)
        .json({ message: "Search query is required and must be a string" });
    }

    const orders = await Orders.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "UserId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "items.ProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $match: {
          $or: [
            { _id: { $regex: query, $options: "i" } }, // Order ID
            { "userDetails.username": { $regex: query, $options: "i" } }, // Username
            { "userDetails.email": { $regex: query, $options: "i" } }, // Email
            { "productDetails.productName": { $regex: query, $options: "i" } }, // Product name
          ],
        },
      },
      {
        $project: {
          _id: 1,
          orderId: { $toString: "$_id" },
          userName: "$userDetails.username",
          userEmail: "$userDetails.email",
          totalAmount: "$TotalAmount",
          orderStatus: "$orderStatus",
          orderDate: "$createdAt",
          itemCount: { $size: "$items" },
          productImages: {
            $map: {
              input: { $slice: ["$items", 3] },
              as: "item",
              in: {
                $let: {
                  vars: {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$productDetails",
                            cond: { $eq: ["$$this._id", "$$item.ProductId"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: "$$product.image",
                },
              },
            },
          },
        },
      },
      { $sort: { orderDate: -1 } },
    ]);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in searchAllOrders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
