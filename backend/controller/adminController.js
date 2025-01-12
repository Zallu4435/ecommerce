const User = require("../model/User");
const ErrorHandler = require("../utils/ErrorHandler");
const bcrypt = require("bcryptjs");
const { sendAdminToken } = require("../utils/jwtToken");
const Address = require("../model/Address");
const Orders = require("../model/Orders");
const Product = require("../model/Products");
const Category = require("../model/Categories");
const Coupon = require("../model/Coupon");

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
    const now = new Date();
    let startDate, endDate;

    if (type === "yearly") {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
    } else if (type === "monthly") {
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0);
    } else if (type === "weekly") {
      const firstDayOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay())
      );
      firstDayOfWeek.setHours(0, 0, 0, 0);
      startDate = firstDayOfWeek;

      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);
      endDate = lastDayOfWeek;
    }

    const orders = await Orders.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$items.Price" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = orders.length > 0 ? orders[0].totalRevenue : 0;
    const totalOrders = orders.length > 0 ? orders[0].totalOrders : 0;

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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

    if (orders.length === 0) {
      console.log("No orders found matching the query.");
    }

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

    const result = await Orders.findById(orderId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
