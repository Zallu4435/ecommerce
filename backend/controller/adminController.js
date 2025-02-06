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
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      user,
      addresses,
      orders,
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
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(limitNumber);

    const totalUsers = await User.countDocuments({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      users,
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
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
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
        $match: {
          $or: [{ "userDetails.email": { $regex: query, $options: "i" } }],
        },
      },
      {
        $group: {
          _id: "$UserId",
          username: { $first: "$userDetails.username" },
          email: { $first: "$userDetails.email" },
          ordersCount: { $sum: 1 },
          totalAmount: { $sum: "$TotalAmount" },
          lastOrderDate: { $max: "$createdAt" },
          lastOrderStatus: { $first: "$Status" },
        },
      },
    ]);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching users with orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.searchCategories = async (req, res) => {
  const query = req.query.query;
  try {
    const categories = await Category.find({
      $or: [
        { categoryName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
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
    const orderId = req.query.query;

    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const productIds = order?.items?.map((elem) =>
      new mongoose.Types.ObjectId(elem.ProductId)
    );

    const products = await Product.find(
      { _id: { $in: productIds } },
      { _id: 1, image: 1, productName: 1, originalPrice: 1, offerPrice: 1 } 
    );

    const formattedOrderData = order.items.map((item) => {
      const matchingProduct = products.find(
        (product) => product._id.toString() === item.ProductId.toString()
      );

      return {
        _id: order._id, 
        UserId: order.UserId,
        TotalAmount: order.TotalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        Status: item.Status,
        ProductId: item.ProductId,
        Price: matchingProduct?.originalPrice || null,
        Quantity: item.Quantity,
        ProductName: matchingProduct?.productName || null,
        ProductImage: matchingProduct?.image || null,
        offerPrice: matchingProduct?.offerPrice || null,
        itemsIds: item._id, 
      };
    });

    res.status(200).json({ orders: formattedOrderData });
  } catch (error) {
    console.error("Error in searchIndividualOrders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
