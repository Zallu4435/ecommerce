const User = require('../model/User');
const ErrorHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendAdminToken } = require('../utils/jwtToken');
const Address = require('../model/Address');
const Orders = require('../model/Orders')
const Product = require('../model/Products')
const Category = require('../model/Categories')
const Coupon = require('../model/Coupon')

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
  console.log("reached for user details");
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addresses = await Address.find({ userId: id });

    const orders = await Orders.find({ UserId: id })
                               .sort({ createdAt: -1 }) // Sort by date, descending
                               .limit(5); // Limit to last 5 orders

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




// exports.searchUsers = async (req, res) => {
//   const query = req.query.query;
//   try {
//     const users = await User.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { email: { $regex: query, $options: 'i' } },
//       ],
//     });
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users', error });
//   }
// };




exports.searchUsers = async (req, res) => {
  // Extract query, page, and limit from the query parameters
  const { search, page = 1, limit = 10 } = req.query;

  console.log(req.query, 'user')

  // Check if query is a valid string
  if (!search || typeof search !== 'string') {
    return res.status(400).json({ message: 'Search query is required and must be a string' });
  }

  // Parse page and limit as integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  try {
    // Search query using regex
    const users = await User.find({
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    })
      .skip(skip)  // Skip based on pagination
      .limit(limitNumber);  // Limit the number of results per page

    // Get the total count of users for pagination metadata
    const totalUsers = await User.countDocuments({
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    });

    // Return the results with pagination data
    res.status(200).json({
      success: true,
      users,
      totalUsers,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};




// exports.searchProducts = async (req, res) => {
//   const query = req.query.query; // Get the query parameter from the request
//   try {
//     // Search for products based on the query in either the name or category
//     const products = await Product.find({
//       $or: [
//         { productName: { $regex: query, $options: 'i' } },   // Case-insensitive search for name
//         { category: { $regex: query, $options: 'i' } }, // Case-insensitive search for category
//       ],
//     });

//     // Return the matching products
//     res.status(200).json(products);
//   } catch (error) {
//     // Return an error if something goes wrong
//     res.status(500).json({ message: 'Error fetching products', error });
//   }
// };

// exports.searchProducts = async (req, res) => {
//   const { query, page = 1, limit = 10 } = req.query; // Get query, page, and limit from request

//   // Check if query is a valid string
//   if (!query || typeof query !== 'string') {
//     return res.status(400).json({ message: 'Search query is required and must be a string' });
//   }

//   // Parse page and limit as integers
//   const pageNumber = parseInt(page, 10);
//   const limitNumber = parseInt(limit, 10);

//   const skip = (pageNumber - 1) * limitNumber;

//   try {
//     // Search products using regex on product name and category
//     const products = await Product.find({
//       $or: [
//         { productName: { $regex: query, $options: 'i' } }, // Case-insensitive search for name
//         { category: { $regex: query, $options: 'i' } },    // Case-insensitive search for category
//       ],
//     })
//       .skip(skip)    // Skip based on pagination
//       .limit(limitNumber); // Limit the number of results per page

//     // Get the total count of products for pagination metadata
//     const totalProducts = await Product.countDocuments({
//       $or: [
//         { productName: { $regex: query, $options: 'i' } },
//         { category: { $regex: query, $options: 'i' } },
//       ],
//     });

//     // Return the results with pagination data
//     res.status(200).json({
//       success: true,
//       products,
//       totalProducts,
//       currentPage: pageNumber,
//       totalPages: Math.ceil(totalProducts / limitNumber),
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching products', error: error.message });
//   }
// };



exports.searchProducts = async (req, res) => {
  // Extract query, page, and limit from the query parameters
  console.log(req.query, 'query')

  const { search, page = 1, limit = 10 } = req.query;

  console.log(search, 'search')

  // Check if query is a valid string
  if (!search || typeof search !== 'string') {
    return res.status(400).json({ message: 'Search search is required and must be a string' });
  }

  // Parse page and limit as integers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const skip = (pageNumber - 1) * limitNumber;

  try {
    // Search products using regex for product name and category
    const products = await Product.find({
      $or: [
        { productName: { $regex: search, $options: 'i' } },  // Case-insensitive search for name
        { category: { $regex: search, $options: 'i' } },     // Case-insensitive search for category
      ],
    })
      .skip(skip)      // Skip based on pagination
      .limit(limitNumber);  // Limit the number of results per page

    // Get the total count of products for pagination metadata
    const totalProducts = await Product.countDocuments({
      $or: [
        { productName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ],
    });

    // Return the results with pagination data
    res.status(200).json({
      success: true,
      products: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        originalPrice: product.originalPrice,
        offerPrice: product.offerPrice,
        image: product.image, // Include image field if necessary
      })),
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};


exports.searchOrders = async (req, res) => {
  const query = req.query.query; // Get the query parameter from the request
  try {
    // Aggregation pipeline to find orders based on the query and get the associated email from the users collection
    const orders = await Orders.aggregate([
      {
        $match: {
          $or: [
            { orderId: { $regex: query, $options: 'i' } },  // Case-insensitive search for orderId
            { customerName: { $regex: query, $options: 'i' } }, // Case-insensitive search for customerName
          ],
        },
      },
      {
        $lookup: {
          from: 'users',          // Name of the users collection
          localField: 'userId',   // Field in the orders collection
          foreignField: '_id',    // Field in the users collection to match
          as: 'userDetails',      // Alias for the resulting user details
        },
      },
      {
        $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true }, // Unwind the array to get user details in a single document
      },
      {
        $project: { // Select only necessary fields
          orderId: 1,
          customerName: 1,
          email: '$userDetails.email', // Extract email from the user details
        },
      },
    ]);

    // Return the matching orders with the user details
    res.status(200).json(orders);
  } catch (error) {
    // Return an error if something goes wrong
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};




exports.searchCategories = async (req, res) => {
  const query = req.query.query; // Get the query parameter from the request
  try {
    // Search for categories based on the query in either the name or description
    const categories = await Category.find({
      $or: [
        { categoryName: { $regex: query, $options: 'i' } },   // Case-insensitive search for categoryName
        { description: { $regex: query, $options: 'i' } }, // Case-insensitive search for description
      ],
    });

    // Return the matching categories
    res.status(200).json(categories);
  } catch (error) {
    // Return an error if something goes wrong
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};


exports.searchCoupons = async (req, res) => {
  const query = req.query.query; // Get the query parameter from the request
  try {
    // Search for coupons based on the query in either the couponCode or description
    const coupons = await Coupon.find({
      $or: [
        { couponCode: { $regex: query, $options: 'i' } },   // Case-insensitive search for couponCode
        { title: { $regex: query, $options: 'i' } }, // Case-insensitive search for description
      ],
    });

    // Return the matching coupons
    res.status(200).json(coupons);
  } catch (error) {
    // Return an error if something goes wrong
    res.status(500).json({ message: 'Error fetching coupons', error });
  }
};


const mongoose = require('mongoose')



// exports.searchIndividualOrders = async (req, res) => {
//   const query = req.query.query; // Get the query parameter from the request
//   console.log(typeof query, 'type'); // Log the type of the query to ensure it's a string

//   // Log the query parameter to make sure it's what you expect
//   console.log('Query parameter:', query);

//   try {
//     // Convert query to number (assuming it's a string of digits)
//     const numericQuery = parseFloat(query);

//     // Check if the query is a valid ObjectId or a number
//     let matchCondition = {};
//     if (new mongoose.Types.isValid(query)) { // Use mongoose.Types.isValid
//       // If it's a valid ObjectId, use it as _id
//       matchCondition = { _id:new mongoose.Types.ObjectId(query) };
//     } else {
//       // Otherwise, search by ProductId in items array
//       matchCondition = {
//         $or: [
//           { "items.ProductId": numericQuery },  // Match ProductId inside items array
//         ],
//       };
//     }

//     // Aggregation pipeline to find orders based on the query
//     const orders = await Orders.aggregate([
//       {
//         $match: matchCondition, // Match the condition for ProductId in items array or _id
//       },
//     ]);

//     // Log the full orders array to check the results
//     console.log('Orders found:', orders);

//     // Return the matching orders to the frontend
//     res.status(200).json(orders);
//   } catch (error) {
//     // Return an error if something goes wrong
//     console.error('Error fetching orders:', error);
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// };

// exports.searchIndividualOrders = async (req, res) => {
//   try {
//       const orderId = req.query.query;

//       if (!orderId) {
//           return res.status(400).json({ message: 'Missing query parameter' });
//       }

//       let query;

//       if (mongoose.Types.ObjectId.isValid(orderId)) {
//           query = { _id: new mongoose.Types.ObjectId(orderId) };
//       } else if (!isNaN(orderId)) {
//           const numericOrderId = parseInt(orderId);
//           query = { _id: numericOrderId };
//       } else {
//           return res.status(400).json({ message: 'Invalid order ID format. Must be a valid ObjectId string or a Number string.' });
//       }

//       const order = await Orders.find(query);

//       if (!order || order.length === 0) {
//           return res.status(404).json({ message: 'Order not found' });
//       }

//       res.status(200).json(order);
//   } catch (error) {
//       console.error("Error finding order:", error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


exports.searchIndividualOrders = async (req, res) => {
  try {
    const orderId = req.query.query; // Assuming the order ID is passed as a URL parameter


    // const result = await Orders.aggregate([
    //   {
    //     $match: {
    //       "items._id": new mongoose.ObjectId(orderId)
    //     }
    //   },
    // ])

       const result = await Orders.findById(orderId)




    console.log(result)
      res.status(200).json(result);
  
  } catch (error) {
    console.error('Error in getOrderById:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};