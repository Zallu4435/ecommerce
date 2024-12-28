const Order = require('../model/Orders');
const Product = require('../model/Products');
const moment = require('moment'); // Use moment.js or JavaScript Date methods to handle date range calculations

// Fetch paginated orders

// exports.getOrders = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10; // Default pageSize to 10
//     const skip = (page - 1) * pageSize;

//     // Fetch orders with selected fields
//     const orders = await Order.aggregate([
//       { $skip: skip }, // Skip documents for pagination
//       { $limit: pageSize }, // Limit documents for pagination

//       // Lookup customer details (replace 'users' with your customer collection name)
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'UserId', // Match UserId in orders
//           foreignField: '_id', // Match _id in users
//           as: 'customerDetails',
//         },
//       },

//       // Unwind the customerDetails array to simplify structure
//       { $unwind: { path: '$customerDetails', preserveNullAndEmptyArrays: true } },

//       // Project only the required fields
//       {
//         $project: {
//           _id: 1, // Order ID
//           customer: '$customerDetails.username', // Customer name (adjust field as needed)
//           total: '$TotalAmount', // Total amount
//           status: '$items.Status', // Order status
//           quantity: {
//             $sum: '$items.Quantity', // Calculate total quantity from items array
//           },
//         },
//       },
//     ]);

//     // Fetch total orders count for pagination
//     const totalOrders = await Order.countDocuments();
//     const totalPages = Math.ceil(totalOrders / pageSize);

//     // Send response
//     res.json({
//       orders,
//       totalOrders,
//       totalPages,
//       currentPage: page,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server Error' });
//   }
// };


exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10; // Default pageSize to 10
    const skip = (page - 1) * pageSize;

    // Get the selected date range from the query parameter
    const dateRange = req.query.dateRange || 'This Week'; // Default to 'This Week' if no dateRange is provided

    // Calculate the start and end date based on the date range
    let startDate, endDate;
    const today = moment().startOf('day'); // Start of today
    switch (dateRange) {
      case 'Today':
        startDate = today;
        endDate = today.endOf('day'); // End of today
        break;
      case 'This Week':
        startDate = moment().startOf('week'); // Start of this week (Sunday)
        endDate = moment().endOf('week'); // End of this week (Saturday)
        break;
      case 'This Month':
        startDate = moment().startOf('month'); // Start of this month
        endDate = moment().endOf('month'); // End of this month
        break;
      case 'This Year':
        startDate = moment().startOf('year'); // Start of this year
        endDate = moment().endOf('year'); // End of this year
        break;
      default:
        startDate = today;
        endDate = today.endOf('day');
        break;
    }

    // Fetch orders with the date filter applied
    const orders = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() } } }, // Filter orders by date range
      { $skip: skip }, // Skip documents for pagination
      { $limit: pageSize }, // Limit documents for pagination

      // Lookup customer details (replace 'users' with your customer collection name)
      {
        $lookup: {
          from: 'users',
          localField: 'UserId', // Match UserId in orders
          foreignField: '_id', // Match _id in users
          as: 'customerDetails',
        },
      },

      // Unwind the customerDetails array to simplify structure
      { $unwind: { path: '$customerDetails', preserveNullAndEmptyArrays: true } },

      // Project only the required fields
      {
        $project: {
          _id: 1, // Order ID
          customer: '$customerDetails.username', // Customer name (adjust field as needed)
          total: '$TotalAmount', // Total amount
          status: '$items.Status', // Order status
          quantity: {
            $sum: '$items.Quantity', // Calculate total quantity from items array
          },
        },
      },
    ]);

    // Fetch total orders count for pagination with date filter
    const totalOrders = await Order.countDocuments({
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    });
    const totalPages = Math.ceil(totalOrders / pageSize);

    // Send response
    res.json({
      orders,
      totalOrders,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// Fetch sales overview (revenue, total orders, etc.)
exports.getSalesOverview = async (req, res) => {
  try {
    // Calculate total revenue
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$TotalAmount' } } }, // Adjust to match your field name
    ]);

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    // Calculate total orders
    const totalOrders = await Order.countDocuments();

    // Calculate average order value (total revenue / total orders)
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    // For Conversion Rate (example calculation)
    // Assuming `visits` is tracked and stored somewhere, replace with your logic
    const totalVisits = 500; // Replace this with actual value from your analytics
    const conversionRate = totalVisits > 0 ? ((totalOrders / totalVisits) * 100).toFixed(2) : 0;

    // Send response
    res.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      conversionRate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};


// Fetch specific sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const saleId = req.params.id;
    const saleDetails = await Order.findById(saleId); // Assuming sale is stored in the "Order" collection

    if (!saleDetails) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json(saleDetails);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Update sale status (e.g., Completed, Canceled)
exports.updateSaleStatus = async (req, res) => {
  try {
    const { saleId, newStatus } = req.body; // Assuming you send saleId and status to update

    const updatedSale = await Order.findByIdAndUpdate(
      saleId,
      { status: newStatus }, // Update sale status
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json(updatedSale);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Fetch top-selling products (sales analysis)
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      // Unwind the items array to process each product in an order separately
      { $unwind: '$items' },
      
      // Lookup product details from the products collection
      {
        $lookup: {
          from: 'products', // The name of the products collection
          localField: 'items.ProductId', // Match the ProductId in items
          foreignField: '_id', // Match with the _id field in the products collection
          as: 'productDetails',
        },
      },

      // Unwind the productDetails array to simplify the structure
      { $unwind: '$productDetails' },

      // Group by product name and sum the quantities sold
      {
        $group: {
          _id: '$productDetails.productName', // Group by product name
          totalSold: { $sum: '$items.Quantity' }, // Sum up the quantities
          totalRevenue: { $sum: { $multiply: ['$items.Quantity', '$productDetails.price'] } }, // Calculate total revenue
        },
      },

      // Sort by totalSold in descending order
      { $sort: { totalSold: -1 } },

      // Limit to top 5 products
      { $limit: 5 },
    ]);

    console.log(topProducts, 'topProducts');
    res.json(topProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
