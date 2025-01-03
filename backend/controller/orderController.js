const Order = require("../model/Orders"); // Assuming you have an Order model
const ErrorHandler = require("../utils/ErrorHandler"); // Custom error handler utility
const mongoose = require("mongoose");
const Product = require("../model/Products");
const User = require("../model/User");
const Address = require("../model/Address");
const Payment = require("../model/Payment"); // Assuming you have a Payment model
const Wallet = require("../model/Wallet"); // Assuming you have a Wallet model (if applicable)
const Transaction = require("../model/WalletTransaction"); // Import the Transaction model

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
  try {
    const userId = req.user; // Assuming user information is in req.user

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId); // Convert userId to ObjectId if needed

    // Extract pagination parameters from the request query
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not provided

    const pipeline = [
      {
        $match: { UserId: userIdObj }, // Match the userId
      },
      {
        $unwind: "$items", // Unwind items in each order, so each item becomes a separate document
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
        $unwind: "$productDetails", // Unwind the product details
      },
      {
        $project: {
          _id: 1,
          UserId: 1,
          TotalAmount: 1,
          Status: 1,
          createdAt: 1,
          updatedAt: 1,
          ProductId: "$items.ProductId",
          Price: "$items.Price",
          Quantity: "$items.Quantity",
          ProductName: "$productDetails.productName",
          ProductImage: "$productDetails.image",
          Status: "$items.Status",
          offerPrice: "$productDetails.offerPrice",
          itemsIds: "$items._id",
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by creation date (most recent first)
      },
      {
        $skip: (page - 1) * limit, // Skip documents for previous pages
      },
      {
        $limit: limit, // Limit the number of documents returned
      },
    ];

    const orders = await Order.aggregate(pipeline);

    // Get total count of documents for pagination metadata
    const totalOrders = await Order.countDocuments({ UserId: userIdObj });

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching user orders" });
  }
};


exports.getOrderById = async (req, res) => {
  console.log("Entering getOrdersByUserId function");
  try {
    const { id: userId } = req.params;
    console.log("User ID:", userId);

    // Validate object ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid user ID");
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("Fetching orders for user");
    const orders = await Order.aggregate([
      {
        $match: { UserId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users", // Assuming your users collection name
          localField: "UserId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "products", // Assuming your products collection name
          localField: "items.ProductId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $addFields: {
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  {
                    productDetails: {
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
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: "$user.username",
          email: "$user.email",
          status: "$Status",
          totalAmount: "$TotalAmount",
          orderDate: "$createdAt",
          updatedAt: 1,
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                productName: "$$item.productDetails.productName",
                productImage: "$$item.productDetails.image",
                quantity: "$$item.Quantity",
                price: "$$item.Price",
                originalPrice: "$$item.productDetails.originalPrice",
              },
            },
          },
          shippingAddress: "$Address",
        },
      },
      {
        $sort: { orderDate: -1 },
      },
    ]);

    console.log("Orders found:", orders.length);
    if (!orders || orders.length === 0) {
      console.log("No orders found for this user");
      return res.status(404).json({ message: "No orders found for this user" });
    }

    console.log("Transformed orders:", orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getOrdersByUserId:", error);
    res
      .status(500)
      .json({ message: "Error fetching order details", error: error.message });
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

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status, itemsIds } = req.body; // Get orderId, status, and itemsIds from the request body

  console.log(itemsIds, "itemsIds");

  if (!orderId || !status || !itemsIds) {
    return res
      .status(400)
      .json({ message: "Order ID, status, and item IDs are required" });
  }

  try {
    // Find the order by its ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the status of matching items inside the items array
    order.items = order.items.map((item) => {
      if (itemsIds.includes(item._id.toString())) {
        // Check if item ID matches any of the given IDs
        item.Status = status; // Update the status
      }
      return item;
    });

    // Update the overall order's `updatedAt` field
    order.updatedAt = new Date(); // Set the updatedAt to the current time

    // Save the updated order
    await order.save();

    return res.status(200).json({
      message: "Order and item statuses updated successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error while updating order:", error);
    return res.status(500).json({
      message: "An error occurred while updating the order and item statuses",
    });
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
// exports.cancelOrder = async (req, res) => {
//   const { orderId, productId } = req.params;

//   try {
//     // Find the order and update the specific item's status to 'Cancelled'
//     const updatedOrder = await Order.findOneAndUpdate(
//       { _id: orderId, "items._id": itemId }, // Match the order and specific item
//       { $set: { "items.$.Status": "Cancelled" } }, // Update the status of the matched item
//       { new: true } // Return the updated document
//     );

//     // Check if the order or item was found and updated
//     if (!updatedOrder) {
//       return res.status(404).json({ message: "Order or item not found" });
//     }

//     // Send a success response with the updated order
//     res.status(200).json({
//       message: "Item canceled successfully",
//       updatedOrder,
//     });
//   } catch (error) {
//     console.error("Error canceling item in order:", error);
//     res.status(500).json({ message: "Failed to cancel item in order" });
//   }
// };

// exports.cancelOrder = async (req, res) => {
//   console.log("reached for cancel ")
//   const { orderId, productId } = req.params;
//   console.log(orderId, productId, "fromfromfrom")
//   try {
//     // Find the order by its ID
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     // Check if the Items array exists and is an array
//     if (!Array.isArray(order.items)) {
//       return res
//         .status(400)
//         .json({ message: "Order items not found or invalid" });
//     }

//     // Find the index of the item with the specified productId
//     const itemIndex = order.items.findIndex(
//       (item) => item.ProductId.toString() === productId
//     );

//     console.log(itemIndex, "itemIndex");
//     if (itemIndex === -1) {
//       return res.status(404).json({ message: "Item not found in the order" });
//     }

//     // Cancel the specific item by updating its status
//     order.items[itemIndex].Status = "Cancelled";

//     // Save the updated order
//     const updatedOrder = await order.save();

//     // Log the updated order
//     console.log(updatedOrder, "updated order");

//     // Respond to the client
//     res.status(200).json({
//       message: "Item cancelled successfully",
//       updatedOrder,
//     });
//   } catch (error) {
//     console.error("Error canceling order item:", error);
//     res.status(500).json({ message: "Failed to cancel item" });
//   }
// };

exports.cancelOrder = async (req, res) => {
  const { orderId, productId } = req.params;

  try {
    // Find the order by its ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the Items array exists and is an array
    if (!Array.isArray(order.items)) {
      return res
        .status(400)
        .json({ message: "Order items not found or invalid" });
    }

    // Find the index of the item with the specified productId
    const itemIndex = order.items.findIndex(
      (item) => item.ProductId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    // Get the product details to update the quantity
    const product = await Product.findById(order.items[itemIndex].ProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increase the stock quantity of the product
    product.stockQuantity += order.items[itemIndex].Quantity;
    await product.save();

    // Cancel the specific item by updating its status
    order.items[itemIndex].Status = "Cancelled";

    // Calculate the refund amount based on the discounted price
    let refundAmount =
      order.items[itemIndex].Price * order.items[itemIndex].Quantity;

    // Apply the coupon discount if available
    if (order.items[itemIndex].CouponDiscount > 0) {
      const discountedPrice =
        order.items[itemIndex].Price -
        (order.items[itemIndex].Price * order.items[itemIndex].CouponDiscount) /
          100;
      refundAmount = discountedPrice * order.items[itemIndex].Quantity;
    }
    // Process the payment and initiate the refund if needed
    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      if (
        paymentRecord.method.toLowerCase() === "card" ||
        paymentRecord.method.toLowerCase() === "razorpay"
      ) {
        // Handle card or Razorpay refund
        if (paymentRecord.method.toLowerCase() === "card") {
          const userWallet = await Wallet.findOne({
            userId: paymentRecord.userId,
          });
          if (!userWallet) {
            console.error(`Wallet not found for user ${paymentRecord.userId}`);
            return res.status(404).json({ message: "User wallet not found" });
          }

          userWallet.balance += refundAmount;
          await userWallet.save();

          // Create a successful transaction record for debit
          const transaction = new Transaction({
            walletId: userWallet?._id,
            userId: paymentRecord?.userId,
            type: "Debit",
            amount: refundAmount,
            description: `Refund for order cancel ${paymentRecord?.OrderId}`,
            status: "Successful",
          });
          await transaction.save();
        } else if (paymentRecord.method.toLowerCase() === "razorpay") {
          const userWallet = await Wallet.findOne({
            userId: paymentRecord.userId,
          });
          if (!userWallet) {
            console.error(`Wallet not found for user ${paymentRecord.userId}`);
            return res.status(404).json({ message: "User wallet not found" });
          }

          userWallet.balance += refundAmount;
          await userWallet.save(); 

          // Create a successful transaction record for debit
          const transaction = new Transaction({
            walletId: userWallet?._id,
            userId: paymentRecord?.userId,
            type: "Debit",
            amount: refundAmount,
            description: `Refund for order cancel ${paymentRecord?.OrderId}`,
            status: "Successful",
          });
          await transaction.save();
        }
      } else if (paymentRecord.method.toLowerCase() === "cod") {
        console.log("No refund necessary for COD orders");
      }

      // Update the payment status
      paymentRecord.refundAmount += refundAmount;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    } else {
      console.log("No payment record found for this order");
    }

    // Save the updated order
    const updatedOrder = await order.save();

    // Respond to the client
    res.status(200).json({
      message: "Item cancelled and refunded successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error canceling order item:", error);
    res.status(500).json({ message: "Failed to cancel item" });
  }
};

exports.getAllUsersOrders = async (req, res) => {
  try {
    const result = await Order.aggregate([
      // Step 1: Lookup to join the User collection based on UserId
      {
        $lookup: {
          from: "users", // Ensure this matches the name of your users collection
          localField: "UserId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      // Step 2: Unwind the userDetails array to access individual user details
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: false, // If no user is found, it won't include the order
        },
      },
      // Step 3: Group by UserId and calculate order length, total amount, and last order date
      {
        $group: {
          _id: "$UserId",
          username: { $first: "$userDetails.username" }, // Get the first (and only) user name from the joined details
          email: { $first: "$userDetails.email" }, // Get the first (and only) user name from the joined details
          ordersCount: { $sum: 1 }, // Count number of orders per user
          totalAmount: { $sum: "$TotalAmount" }, // Sum of the total amount from all orders
          lastOrderDate: { $max: "$createdAt" }, // Find the last order date
          lastOrderStatus: { $first: "$Status" }, // Get the status of the last order
        },
      },
      // Step 4: Format the last order date into a readable format
      {
        $project: {
          username: 1,
          email: 1,
          ordersCount: 1,
          totalAmount: 1,
          lastOrderDate: {
            $dateToString: { format: "%Y-%m-%d", date: "$lastOrderDate" },
          },
          lastOrderStatus: 1,
        },
      },
    ]);

    console.log(result, "result from order");

    // Return the aggregated data
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users with orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserOrdersMoadl = async (req, res) => {
  const userId = req.query.userId; // Retrieve userId from the query string

  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    // Find all orders for this user
    const orders = await Order.find({ UserId: objectId });

    if (!orders) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAddressByOrderId = async (req, res, next) => {
  console.log("reached inside the order");
  try {
    const { orderId } = req.params;

    // console.log(req.params, "params")

    // Fetch the order to get user details
    const order = await Order.findById(orderId).select("AddressId"); // Find the order by orderId
    console.log(order, "orderid");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Fetch the address based on userId (or other relation based on your schema)
    const address = await Address.findOne({ _id: order.AddressId });

    console.log(address, "address");
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found for this order" });
    }

    // Return the address details
    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching address" });
  }
};


exports.returnOrder = async (req, res) => {

  console.log("reached for return")
  const { orderId, productId } = req.params;

  console.log(orderId, productId, 'orderId, productId')

  try {
    // Find the order by its ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the Items array exists and is valid
    if (!Array.isArray(order.items)) {
      return res
        .status(400)
        .json({ message: "Order items not found or invalid" });
    }

    // Find the index of the item with the specified productId
    const itemIndex = order.items.findIndex(
      (item) => item.ProductId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    // Get the product details to update the quantity
    const product = await Product.findById(order.items[itemIndex].ProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increase the stock quantity of the product
    product.stockQuantity += order.items[itemIndex].Quantity;
    await product.save();

    // Mark the specific item as 'Returned'
    order.items[itemIndex].Status = "Returned";

    // Calculate the refund amount based on the discounted price
    let refundAmount =
      order.items[itemIndex].Price * order.items[itemIndex].Quantity;

    // Apply the coupon discount if available
    if (order.items[itemIndex].CouponDiscount > 0) {
      const discountedPrice =
        order.items[itemIndex].Price -
        (order.items[itemIndex].Price * order.items[itemIndex].CouponDiscount) /
          100;
      refundAmount = discountedPrice * order.items[itemIndex].Quantity;
    }

    // Process the payment and initiate the refund if needed
    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      if (
        paymentRecord.method.toLowerCase() === "card" ||
        paymentRecord.method.toLowerCase() === "razorpay"
      ) {
        // Handle card or Razorpay refund
        const userWallet = await Wallet.findOne({
          userId: paymentRecord.userId,
        });
        if (!userWallet) {
          console.error(`Wallet not found for user ${paymentRecord.userId}`);
          return res.status(404).json({ message: "User wallet not found" });
        }

        userWallet.balance += refundAmount;
        await userWallet.save();

        // Create a successful transaction record for debit
        const transaction = new Transaction({
          walletId: userWallet?._id,
          userId: paymentRecord?.userId,
          type: "Debit",
          amount: refundAmount,
          description: `Refund for returned item ${paymentRecord?.OrderId}`,
          status: "Successful",
        });
        await transaction.save();
      } else if (paymentRecord.method.toLowerCase() === "cod") {
        console.log("No refund necessary for COD orders");
      }

      // Update the payment status
      paymentRecord.refundAmount += refundAmount;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    } else {
      console.log("No payment record found for this order");
    }

    // Save the updated order
    const updatedOrder = await order.save();

    // Respond to the client
    res.status(200).json({
      message: "Item returned and refunded successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error processing return:", error);
    res.status(500).json({ message: "Failed to process return" });
  }
};
