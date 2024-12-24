const Order = require('../model/Orders'); // Assuming you have an Order model
const ErrorHandler = require('../utils/ErrorHandler'); // Custom error handler utility
const mongoose = require('mongoose')
const products = require('../model/Products')
const User = require('../model/User')

exports.getAllOrders = async (req, res) => {
  console.log("Reached inside the getAllOrders function");
  try {
    const userId = req.user; // Assuming you have user information in the request
    console.log("User ID:", userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }


    const pipeline = [
      {
        $match: { UserId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $unwind: '$items'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.ProductId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $unwind: '$productDetails'
      },
      {
        $project: {
          _id: 1,
          UserId: 1,
          TotalAmount: 1,
          Status: 1,
          createdAt: 1,
          updatedAt: 1,
          Items: {
            _id: '$items._id',
            ProductId: '$items.ProductId',
            Price: '$items.Price',
            Quantity: '$items.Quantity',
            ProductName: '$productDetails.productName', // Add more fields if needed
            ProductImage: '$productDetails.image'
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ];
    
    
    console.log("Pipeline:", pipeline);
    
    const orders = await Order.aggregate(pipeline);
    console.log("Orders:", orders);
    

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'An error occurred while fetching user orders' });
  }
};




// Get order details
exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Update an order

// Controller to update multiple orders

exports.updateOrderStatus = async (req, res) => {
  
  // Ensure orderUpdates is an array
  const orderUpdates = req.body;
  console.log("Received update request:", orderUpdates);

  if (!Array.isArray(orderUpdates)) {
    return res.status(400).json({ message: 'orderUpdates must be an array.' });
  }

  try {
    const updatedOrders = [];

    for (const update of orderUpdates) {
      const { orderId, status } = update;

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: `Invalid orderId: ${orderId}` });
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { $set: { Status: status } },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: `Order not found: ${orderId}` });
      }

      updatedOrders.push(order);
    }

    console.log("Orders updated successfully:", updatedOrders);

    res.status(200).json({
      message: 'Orders updated successfully',
      updatedOrders: updatedOrders
    });
  } catch (error) {
    console.error('Error updating orders:', error);
    res.status(500).json({ message: 'Failed to update orders', error: error.message });
  }
};





    // Find the order by ID and update its status
//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status }, // Update the `status` field
//       { new: true, runValidators: true } // Return the updated document and run validations
//     );

//     // If the order is not found, send a 404 error
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     // Send the updated order as a response
//     res.status(200).json({
//       success: true,
//       message: "Order updated successfully",
//       order,
//     });
//   } catch (error) {
//     next(error); // Pass any errors to the error-handling middleware
//   }
// };


// Delete an order
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    await order.remove();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllUsersOrders = async (req, res) => {
  try {
    const result = await Order.aggregate([
      // Step 1: Lookup to join the User collection based on UserId
      {
        $lookup: {
          from: 'users', // Ensure this matches the name of your users collection
          localField: 'UserId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      // Step 2: Unwind the userDetails array to access individual user details
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: false,  // If no user is found, it won't include the order
        },
      },
      // Step 3: Group by UserId and calculate order length, total amount, and last order date
      {
        $group: {
          _id: '$UserId',
          username: { $first: '$userDetails.username' }, // Get the first (and only) user name from the joined details
          ordersCount: { $sum: 1 }, // Count number of orders per user
          totalAmount: { $sum: '$TotalAmount' }, // Sum of the total amount from all orders
          lastOrderDate: { $max: '$createdAt' }, // Find the last order date
          lastOrderStatus: { $first: '$Status' }, // Get the status of the last order
        },
      },
      // Step 4: Format the last order date into a readable format
      {
        $project: {
          username: 1,
          ordersCount: 1,
          totalAmount: 1,
          lastOrderDate: { $dateToString: { format: '%Y-%m-%d', date: '$lastOrderDate' } },
          lastOrderStatus: 1,
        },
      },
    ]);

    console.log(result, "result from order")

    // Return the aggregated data
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users with orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getUserOrdersMoadl = async (req, res) => {

  const userId = req.query.userId; // Retrieve userId from the query string

  try {
    const objectId =new mongoose.Types.ObjectId(userId);

    // Find all orders for this user
    const orders = await Order.find({ UserId: objectId });

    if (!orders) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};