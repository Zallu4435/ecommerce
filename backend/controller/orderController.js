const Order = require('../model/Orders'); // Assuming you have an Order model
const ErrorHandler = require('../utils/ErrorHandler'); // Custom error handler utility
const mongoose = require('mongoose')
const products = require('../model/Products')
const User = require('../model/User')

// exports.getAllOrders = async (req, res) => {
//   console.log("Reached inside the getAllOrders function");
//   try {
//     const userId = req.user; // Assuming you have user information in the request
//     console.log("User ID:", userId);
    
//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }


//     const pipeline = [
//       {
//         $match: { UserId: new mongoose.Types.ObjectId(userId) }
//       },
//       {
//         $unwind: '$items'
//       },
//       {
//         $lookup: {
//           from: 'products',
//           localField: 'items.ProductId',
//           foreignField: '_id',
//           as: 'productDetails'
//         }
//       },
//       {
//         $unwind: '$productDetails'
//       },
//       {
//         $project: {
//           _id: 1,
//           UserId: 1,
//           TotalAmount: 1,
//           Status: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           Items: {
//             _id: '$items._id',
//             ProductId: '$items.ProductId',
//             Price: '$items.Price',
//             Quantity: '$items.Quantity',
//             ProductName: '$productDetails.productName', // Add more fields if needed
//             ProductImage: '$productDetails.image'
//           }
//         }
//       },
//       {
//         $sort: { createdAt: -1 }
//       }
//     ];
    
    
//     console.log("Pipeline:", pipeline);
    
//     const orders = await Order.aggregate(pipeline);
//     console.log("Orders:", orders);
    

//     res.status(200).json(orders);
//   } catch (error) {
//     console.error('Error fetching user orders:', error);
//     res.status(500).json({ message: 'An error occurred while fetching user orders' });
//   }
// };

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
        $unwind: '$items' // Unwind items in each order
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
        $unwind: '$productDetails' // Unwind the product details
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
            ProductName: '$productDetails.productName',
            ProductImage: '$productDetails.image'
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          UserId: { $first: '$UserId' },
          TotalAmount: { $first: '$TotalAmount' },
          Status: { $first: '$Status' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          Items: { $push: '$Items' } // Group all items back together under the 'Items' field
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





exports.getOrderById = async (req, res) => {
  console.log('Entering getOrdersByUserId function');
  try {
    const { id: userId } = req.params;
    console.log('User ID:', userId);

    // Validate object ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('Invalid user ID');
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    console.log('Fetching orders for user');
    const orders = await Order.aggregate([
      {
        $match: { UserId: new mongoose.Types.ObjectId(userId) }
      },
      {
        $lookup: {
          from: 'users', // Assuming your users collection name
          localField: 'UserId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $lookup: {
          from: 'products', // Assuming your products collection name
          localField: 'items.ProductId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {
        $addFields: {
          'items': {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                $mergeObjects: [
                  '$$item',
                  {
                    productDetails: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$productDetails',
                            cond: { $eq: ['$$this._id', '$$item.ProductId'] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          username: '$user.username',
          email: '$user.email',
          status: '$Status',
          totalAmount: '$TotalAmount',
          orderDate: '$createdAt',
          updatedAt: 1,
          items: {
            $map: {
              input: '$items',
              as: 'item',
              in: {
                productName: '$$item.productDetails.productName',
                productImage: '$$item.productDetails.image',
                quantity: '$$item.Quantity',
                price: '$$item.Price',
                originalPrice: '$$item.productDetails.originalPrice'
              }
            }
          },
          shippingAddress: '$Address'
        }
      },
      {
        $sort: { orderDate: -1 }
      }
    ]);
    
    console.log('Orders found:', orders.length);
    if (!orders || orders.length === 0) {
      console.log('No orders found for this user');
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    console.log('Transformed orders:', orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in getOrdersByUserId:', error);
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// Example in Express route handler
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
// Example Express route for canceling an order
exports.cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId, "from cancel order");

  try {
    // Find the order by its ID and update the status to 'Cancelled'
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { Status: 'Cancelled' },  // Ensure 'status' matches your schema field name
      { new: true }  // This ensures the updated document is returned
    );

    // Log the updated order to see if the status has changed
    console.log(updatedOrder, "updated order");

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order canceled successfully',
      updatedOrder,
    });
  } catch (error) {
    console.error('Error canceling order:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
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