const Order = require("../model/Orders");
const mongoose = require("mongoose");
const Product = require("../model/Products");
const Address = require("../model/Address");
const Payment = require("../model/Payment");
const Wallet = require("../model/Wallet");
const Transaction = require("../model/WalletTransaction");
const User = require("../model/User");

exports.getAllOrders = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sort || "desc";

    const sortDirection = sortOrder === "desc" ? -1 : 1;

    const pipeline = [
      {
        $match: { UserId: userIdObj },
      },
      {
        $unwind: "$items",
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
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 1,
          UserId: 1,
          TotalAmount: 1,
          Status: 1,
          createdAt: 1,
          updatedAt: 1,
          CouponDiscount: 1,
          Subtotal: 1,
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
        $sort: { updatedAt: sortDirection },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    const orders = await Order.aggregate(pipeline);

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

exports.getUserIndividualOrders = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ email });
    const userId = user._id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const pipeline = [
      {
        $match: { UserId: userId },
      },
      {
        $unwind: "$items",
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
        $unwind: "$productDetails",
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
        $sort: { updatedAt: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    const orders = await Order.aggregate(pipeline);

    const totalOrders = await Order.countDocuments({ UserId: userId });

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
  try {
    const { id: userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const orders = await Order.aggregate([
      {
        $match: { UserId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users",
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
          from: "products",
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

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getOrdersByUserId:", error);
    res
      .status(500)
      .json({ message: "Error fetching order details", error: error.message });
  }
};

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
  const { orderId, status, itemsIds } = req.body;

  if (!orderId || !status || !itemsIds) {
    return res
      .status(400)
      .json({ message: "Order ID, status, and item IDs are required" });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.items = order.items.map((item) => {
      if (itemsIds.includes(item._id.toString())) {
        item.Status = status;
      }
      return item;
    });

    order.updatedAt = new Date();

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

exports.cancelOrder = async (req, res) => {
  const { orderId, productId } = req.params;
  const { reason } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!Array.isArray(order.items)) {
      return res
        .status(400)
        .json({ message: "Order items not found or invalid" });
    }

    const itemIndex = order.items.findIndex(
      (item) => item.ProductId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    const product = await Product.findById(order.items[itemIndex].ProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stockQuantity += order.items[itemIndex].Quantity;
    await product.save();

    order.items[itemIndex].Status = "Cancelled";
    order.items[itemIndex].reason = reason;

    let refundAmount =
      order.items[itemIndex].Price * order.items[itemIndex].Quantity;

    if (order?.CouponDiscount > 0) {
      const discountedPrice =
        order.items[itemIndex].Price -
        (order.items[itemIndex].Price - order.CouponDiscount);
      refundAmount = discountedPrice * order.items[itemIndex].Quantity;
    }

    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      if (
        paymentRecord.method.toLowerCase() === "card" ||
        paymentRecord.method.toLowerCase() === "razorpay"
      ) {
        const userWallet = await Wallet.findOne({
          userId: paymentRecord.userId,
        });
        if (!userWallet) {
          return res.status(404).json({ message: "User wallet not found" });
        }

        userWallet.balance += refundAmount;
        await userWallet.save();

        const transaction = new Transaction({
          walletId: userWallet?._id,
          userId: paymentRecord?.userId,
          type: "Credit",
          amount: refundAmount,
          description: `Refund for order cancel ${paymentRecord?.OrderId}`,
          status: "Successful",
        });
        await transaction.save();
      } else if (paymentRecord.method.toLowerCase() === "cod") {
        console.log("No refund necessary for COD orders");
      }

      paymentRecord.refundAmount += refundAmount;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    } else {
      console.log("No payment record found for this order");
    }

    const updatedOrder = await order.save();

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

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users with orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserOrdersMoadl = async (req, res) => {
  const userId = req.query.userId;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);

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
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).select("AddressId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const address = await Address.findOne({ _id: order.AddressId });

    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found for this order" });
    }

    res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching address" });
  }
};

exports.returnOrder = async (req, res) => {
  const { orderId, productId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!Array.isArray(order.items)) {
      return res
        .status(400)
        .json({ message: "Order items not found or invalid" });
    }

    const itemIndex = order.items.findIndex(
      (item) => item.ProductId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in the order" });
    }

    const product = await Product.findById(order.items[itemIndex].ProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stockQuantity += order.items[itemIndex].Quantity;
    await product.save();

    order.items[itemIndex].Status = "Returned";

    let refundAmount =
      order.items[itemIndex].Price * order.items[itemIndex].Quantity;

    if (order.items[itemIndex].CouponDiscount > 0) {
      const discountedPrice =
        order.items[itemIndex].Price -
        (order.items[itemIndex].Price * order.items[itemIndex].CouponDiscount) /
          100;
      refundAmount = discountedPrice * order.items[itemIndex].Quantity;
    }

    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      if (
        paymentRecord.method.toLowerCase() === "card" ||
        paymentRecord.method.toLowerCase() === "razorpay" ||
        paymentRecord.method.toLowerCase() === "cod"
      ) {
        const userWallet = await Wallet.findOne({
          userId: paymentRecord.userId,
        });
        if (!userWallet) {
          console.error(`Wallet not found for user ${paymentRecord.userId}`);
          return res.status(404).json({ message: "User wallet not found" });
        }

        userWallet.balance += refundAmount;
        await userWallet.save();

        const transaction = new Transaction({
          walletId: userWallet?._id,
          userId: paymentRecord?.userId,
          type: "Credit",
          amount: refundAmount,
          description: `Refund for returned item ${paymentRecord?.OrderId}`,
          status: "Successful",
          orderId: orderId,
          paymentMethod: paymentRecord.method.toLowerCase(),
        });
        await transaction.save();
      }

      paymentRecord.refundAmount += refundAmount;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    } else {
      console.log("No payment record found for this order");
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Item returned and refunded successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Error processing return:", error);
    res.status(500).json({ message: "Failed to process return" });
  }
};
