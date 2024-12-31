const User = require('../model/User');
const ErrorHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendAdminToken } = require('../utils/jwtToken');
const Address = require('../model/Address');
const Orders = require('../model/Orders')
const Product = require('../model/Products')


exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email, password , "from the server ")
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find user by email (admin or regular user)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not an admin' });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Send admin token in response
    sendAdminToken(user, 201, res);

  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error handling middleware
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
      console.log(req.params.id, "reached inside ban user ")

        let user = await User.findById(req.params.id);
        if (!user) {
          return next(new ErrorHandler("User not found", 404));
        }
    
        console.log(user.isBlocked, "body")
        user.isBlocked = !user.isBlocked; 
        console.log(user.isBlocked, "body 2")
        await user.save();
    
        res.status(200).json({
          success: true,
          message: "user blocked ",
        });
      } catch (error) {
        return next(error);
      }
}


exports.adminRefreshToken = async (req, res, next) => {
  try {
    // console.log("reachded inside the refresh token ")
    // Find user by ID from verified refresh token
    const user = await User.findById(req.admin);
    
    // console.log(user, "object")
      
      if (!user) {
          return res.status(404).json({ 
              message: 'User not found',
              requireLogin: true 
          });
      }

      sendAdminToken(user, 200, res);

  } catch (error) {
      next(new ErrorHandler('Token refresh failed', 500));
  }
};



exports.getUserDetails = async (req, res) => {

  console.log("reached fo user details ")
  const { id } = req.params;

  try {

    console.log(id, 'userId')
    // Fetch user details
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch user addresses from Address collection
    const addresses = await Address.find({ id: id });

    // Fetch user orders from Order collection
    const orders = await Orders.find({ id: id });

    // Send the response with user details, addresses, and orders
    res.status(200).json({
      user,
      addresses,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};




// API to fetch yearly metrics
exports.adminDashboard = async (req, res) => {
  try {
    const { type, year, month, week } = req.query;
    console.log(type, year, month, week, 'req.query');
    const now = new Date();
    let startDate, endDate;

    // Determine date range based on query type
    if (type === 'yearly') {
      startDate = new Date(year, 0, 1); // Start of the year
      endDate = new Date(year, 11, 31); // End of the year
    } else if (type === 'monthly') {
      startDate = new Date(year, month - 1, 1); // Start of the month
      endDate = new Date(year, month, 0); // End of the month
    } else if (type === 'weekly') {
      // Calculate start and end of the current week
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday of this week
      firstDayOfWeek.setHours(0, 0, 0, 0); // Set to midnight
      startDate = firstDayOfWeek;

      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Saturday of this week
      lastDayOfWeek.setHours(23, 59, 59, 999); // Set to the last millisecond of the day
      endDate = lastDayOfWeek;
    }

    // Fetch the total revenue and total orders for the given date range
    const orders = await Orders.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } }, // Match based on the date range
      { 
        $unwind: "$items" // Unwind the items array to access individual item data
      },
      {
        $group: { 
          _id: null, 
          totalRevenue: { $sum: '$items.Price' }, // Summing up the prices of all items in the orders
          totalOrders: { $sum: 1 } // Counting the number of orders
        }
      }
    ]);

    // If no orders are found, set default values
    const totalRevenue = orders.length > 0 ? orders[0].totalRevenue : 0;
    const totalOrders = orders.length > 0 ? orders[0].totalOrders : 0;

    // Get the total number of users
    const totalUsers = await User.countDocuments();

    // Get the total number of products
    const totalProducts = await Product.countDocuments();

    // Send response with the calculated metrics
    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


