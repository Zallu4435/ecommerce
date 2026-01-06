const Order = require("../model/Orders");
const mongoose = require("mongoose");
const Product = require("../model/Products");
const Address = require("../model/Address");
const Payment = require("../model/Payment");
const Wallet = require("../model/Wallet");
const Transaction = require("../model/WalletTransaction");
const User = require("../model/User");
const Cart = require("../model/Cart");
const Coupon = require("../model/Coupon");
const ProductVariant = require("../model/ProductVariants");
const {
  increaseStockForOrder,
  calculateRefundAmount,
  processWalletRefund,
  handleReferralReward,
  restoreStockIfPending,
  formatOrderItem,
  formatOrderSummary,
  createShippingSnapshot,
  mapToOrderItemRecord,
  restoreCouponUsage
} = require("../utils/orderHelper");

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

    const totalItemsPipeline = [
      { $match: { UserId: userIdObj } },
      { $unwind: "$items" },
      { $count: "total" }
    ];
    const totalItemsResult = await Order.aggregate(totalItemsPipeline);
    const totalItemsCount = totalItemsResult[0]?.total || 0;

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(totalItemsCount / limit),
      totalOrders: totalItemsCount,
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
          Status: 1, // Order level status
          paymentStatus: 1, // Order level payment status
          PaymentMethod: "$paymentMethod",
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
        $lookup: {
          from: "coupons",
          localField: "CouponId",
          foreignField: "_id",
          as: "couponDetails"
        }
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
                itemTotal: "$$item.itemTotal"
              },
            },
          },
          shippingAddress: "$Address",
          couponDiscount: "$CouponDiscount",
          subtotal: "$Subtotal",
          couponCode: { $ifNull: [{ $arrayElemAt: ["$couponDetails.couponCode", 0] }, null] }
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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, addressId, paymentMethod, couponCode } = req.body;
    const userId = req.user;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!addressId) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Fetch Address & User Snapshot
    const address = await Address.findById(addressId).session(session);
    if (!address) {
      throw new Error("Address not found");
    }

    const userSnapshot = await User.findById(userId).session(session);

    const shippingAddressSnapshot = createShippingSnapshot(address, userSnapshot);

    // 1. Process Items & Deduct Stock
    let orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.status !== "active") {
        throw new Error(`Product ${product.productName} is currently unavailable`);
      }

      let price = product.baseOfferPrice > 0 ? product.baseOfferPrice : product.basePrice;
      let variantId = null;

      // Handle Variants if they exist
      if (product.hasVariants && item.color && item.size) {

        let variantQuery = {
          productId: product._id,
          color: item.color.toLowerCase(), // Ensure case matching
          size: item.size.toUpperCase()
        };

        if (item.gender) {
          variantQuery.gender = item.gender.charAt(0).toUpperCase() + item.gender.slice(1).toLowerCase();
        }

        const variant = await ProductVariant.findOne(variantQuery).session(session);

        if (!variant) {
          throw new Error(`Variant ${item.color}/${item.size}${item.gender ? `/${item.gender}` : ''} not found for ${product.productName}`);
        }

        if (variant.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.productName} (${item.color}/${item.size})`);
        }

        // Deduct Variant Stock
        variant.stockQuantity -= item.quantity;
        await variant.save({ session });

        variantId = variant._id;

        // Override price if variant has specific pricing
        if (variant.offerPrice > 0 || variant.price > 0) {
          if (variant.offerPrice > 0) price = variant.offerPrice;
          else if (variant.price > 0) price = variant.price;
        }

      } else {
        if (product.totalStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.productName}`);
        }
      }

      // Always Deduct Total Stock from Main Product
      product.totalStock -= item.quantity;
      await product.save({ session });

      subtotal += price * item.quantity;

      orderItems.push(mapToOrderItemRecord(product, item.quantity, price, {
        color: item.color,
        size: item.size,
        gender: item.gender
      }));
    }

    // 2. Calculate Costs
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% Tax
    const shippingCost = 15; // Fixed shipping
    let couponDiscount = 0;
    let couponId = null;

    // 3. Apply Coupon
    if (couponCode) {
      const { coupon, discountAmount } = await validateAndApplyCoupon(couponCode, userId, orderItems, session);

      if (coupon) {
        couponDiscount = discountAmount;
        couponId = coupon._id;
      }
    }

    const totalAmount = Math.max(0, subtotal + tax + shippingCost - couponDiscount);
    const finalTotal = Math.round(totalAmount * 100) / 100;

    // 4. Handle Wallet Payment
    let paymentStatus = "Pending";
    if (paymentMethod === "Wallet") {
      const userWallet = await Wallet.findOne({ userId }).session(session);

      if (!userWallet) {
        throw new Error("Wallet not found");
      }

      if (userWallet.balance < finalTotal) {
        throw new Error("Insufficient wallet balance");
      }

      if (userWallet.status !== "Active") {
        throw new Error("Wallet is inactive");
      }

      // Deduct from Wallet
      userWallet.balance -= finalTotal;
      await userWallet.save({ session });

      // Create Transaction
      await Transaction.create([{
        walletId: userWallet._id,
        userId: userId,
        type: "Debit",
        amount: finalTotal,
        description: `Payment for order`,
        transactionType: "Purchase",
        status: "Successful",
        paymentMethod: "Wallet"
      }], { session });

      paymentStatus = "Completed";
    }

    // 5. Create Order
    const orderStatus = paymentStatus === "Completed" ? "Confirmed" : "Pending";

    const newOrder = await Order.create([{
      UserId: userId,
      AddressId: addressId,
      shippingAddress: shippingAddressSnapshot,
      orderStatus: orderStatus,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      items: orderItems,
      Subtotal: subtotal,
      Tax: tax,
      ShippingCost: shippingCost,
      CouponDiscount: couponDiscount,
      CouponId: couponId,
      TotalAmount: finalTotal,
      itemCount: orderItems.length
    }], { session });

    // 6. Clear Cart
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    ).session(session);

    // Fetch user for email
    const userForMail = await User.findById(userId).session(session);

    // Create Payment Record (for consistency)
    if (paymentMethod !== "COD") {
      await Payment.create([{
        paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        OrderId: newOrder[0]._id,
        userId: userId,
        amount: finalTotal,
        currency: "INR",
        status: paymentStatus === "Completed" ? "captured" : "created",
        method: paymentMethod,
        email: userForMail ? userForMail.email : "user@example.com"
      }], { session });
    } else {
      await Payment.create([{
        paymentId: `COD-${Date.now()}`,
        OrderId: newOrder[0]._id,
        userId: userId,
        amount: finalTotal,
        currency: "INR",
        status: "pending",
        method: "COD",
        email: userForMail ? userForMail.email : "user@example.com"
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder[0],
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create Order Error:", error);
    next(error);
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId, status, itemsIds, reason } = req.body; // Added reason

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

    const itemsToUpdate = order.items.filter(item => itemsIds.includes(item._id.toString()));

    for (const item of itemsToUpdate) {
      // Check if status is actually changing
      if (item.Status === status) continue;

      // Handle Stock Restoration for Cancel/Return
      if ((status === "Cancelled" || status === "Returned") &&
        item.Status !== "Cancelled" && item.Status !== "Returned") {

        // Restore stock using helper
        await increaseStockForOrder([{
          ProductId: item.ProductId,
          Quantity: item.Quantity,
          color: item.color,
          size: item.size,
          gender: item.gender
        }]);

        // Set Timestamps & Reasons
        if (status === "Cancelled") {
          item.cancelledAt = Date.now();
          item.cancellationReason = reason || "Cancelled by Admin"; // Use provided reason
          item.cancelledBy = "Admin";
        } else {
          item.returnedAt = Date.now();
          item.returnReason = reason || "Returned by Admin"; // Use provided reason
          item.returnedBy = "Admin";
        }

        // Handle Refund
        const refundAmount = calculateRefundAmount(order, item);
        item.refundAmount = refundAmount;
        item.RefundStatus = "Pending";

        // Process Wallet Refund
        const paymentRecord = await Payment.findOne({ OrderId: order._id });

        if (paymentRecord && ["card", "razorpay", "wallet", "cod"].includes(paymentRecord.method.toLowerCase())) {
          const shouldRefund = (paymentRecord.method.toLowerCase() !== "cod") || (status === "Returned");

          if (shouldRefund) {
            try {
              const refundDescription = `Refund for ${status} item in order ${order._id}`;
              await processWalletRefund(order.UserId, refundAmount, refundDescription, order._id, paymentRecord.method);

              item.RefundStatus = "Refunded";
              item.refundedAt = Date.now();

              paymentRecord.refundAmount += refundAmount;
              paymentRecord.refundStatus = "Refunded";
              await paymentRecord.save();

              order.RefundAmount += refundAmount;
            } catch (refundError) {
              console.error("Refund failed:", refundError.message);
              // item.RefundStatus remains "Pending"
            }
          }
        }
      }

      item.Status = status;
      if (status === "Delivered") item.deliveredAt = Date.now();
      if (status === "Shipped") item.shippedAt = Date.now();
    }

    order.updatedAt = new Date();

    await order.save();

    // Check for Referral Reward (only on FIRST order delivery)
    if (status === "Delivered") {
      await handleReferralReward(order.UserId);
    }

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

    console.log(`🚫 [CANCEL ITEM] Initiating cancellation for order ${orderId}, product ${productId}`);

    // Restore Stock using helper
    await increaseStockForOrder([order.items[itemIndex]]);

    const item = order.items[itemIndex];
    item.Status = "Cancelled";
    item.cancellationReason = reason;
    item.cancelledAt = Date.now();
    item.cancelledBy = "User";

    console.log(`📦 [CANCEL ITEM] Item status updated to Cancelled. Calculating refund...`);

    // Calculate refund using helper
    const refundAmount = calculateRefundAmount(order, item);

    // Validate refund amount
    if (refundAmount <= 0) {
      return res.status(400).json({ message: "Invalid refund amount" });
    }

    item.refundAmount = refundAmount;
    item.RefundStatus = "Pending";

    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      const method = paymentRecord.method.toLowerCase();
      if (["card", "razorpay", "wallet"].includes(method)) {
        try {
          const refundDescription = `Refund for cancelled item in order ${orderId}`;
          await processWalletRefund(order.UserId, refundAmount, refundDescription, orderId, method);

          item.RefundStatus = "Refunded";
          item.refundedAt = Date.now();
        } catch (refundError) {
          console.error("Refund failed:", refundError.message);
          return res.status(400).json({ message: refundError.message });
        }
      } else if (method === "cod") {
        console.log("No refund necessary for COD orders");
      }

      paymentRecord.refundAmount += refundAmount;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    } else {
      console.log("No payment record found for this order");
    }

    order.RefundAmount += refundAmount;

    // Update Order Payment Status based on remaining items
    const activeItems = order.items.filter(i =>
      !["Cancelled", "Returned", "Refunded", "Payment Failed"].includes(i.Status)
    );

    const isPrepaid = ["card", "razorpay", "wallet"].includes(paymentRecord?.method?.toLowerCase());

    if (activeItems.length === 0) {
      order.paymentStatus = isPrepaid ? "Refunded" : "Failed";
    } else if (isPrepaid) {
      order.paymentStatus = "Partially Refunded";
    }

    console.log(`✅ [CANCEL ITEM] Success. Refund: ₹${refundAmount}, Order Payment Status: ${order.paymentStatus}`);

    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Item cancelled and refunded successfully",
      refundAmount: refundAmount,
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

    // Check if item is delivered (can only return delivered items)
    if (order.items[itemIndex].Status !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered items can be returned"
      });
    }

    // Restore Stock using helper
    await increaseStockForOrder([{
      ProductId: order.items[itemIndex].ProductId,
      Quantity: order.items[itemIndex].Quantity,
      color: order.items[itemIndex].color,
      size: order.items[itemIndex].size,
      gender: order.items[itemIndex].gender
    }]);

    // Update item status and timestamps
    const item = order.items[itemIndex];
    item.Status = "Returned";
    item.returnReason = reason;
    item.returnRequestedAt = Date.now();
    item.returnedAt = Date.now();
    item.returnedBy = "User";

    // Calculate refund using helper
    const refundAmount = calculateRefundAmount(order, item);

    // Validate refund amount
    if (refundAmount <= 0) {
      return res.status(400).json({ message: "Invalid refund amount" });
    }

    // Update item refund tracking
    item.refundAmount = refundAmount;
    item.RefundStatus = "Pending";

    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      // Refund to wallet for all payment methods (including COD - already paid)
      const method = paymentRecord.method.toLowerCase();
      try {
        const refundDescription = `Refund for returned item in order ${orderId}`;
        await processWalletRefund(order.UserId, refundAmount, refundDescription, orderId, method);

        // Update item refund status
        item.RefundStatus = "Refunded";
        item.refundedAt = Date.now();
      } catch (refundError) {
        console.error("Refund failed:", refundError.message);
        return res.status(400).json({ message: refundError.message });
      }

      // Update payment record
      paymentRecord.refundAmount += refundAmount;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    } else {
      console.log("No payment record found for this order");
    }

    // Update order refund amount
    order.RefundAmount += refundAmount;

    // Save order (auto-updates orderStatus via pre-save hook)
    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Item returned and refunded successfully",
      refundAmount: refundAmount,
      updatedOrder,
    });
  } catch (error) {
    console.error("Error processing return:", error);
    res.status(500).json({ message: "Failed to process return" });
  }
};

// Get orders grouped by order (not by items) - Amazon/Flipkart style
exports.getOrdersGrouped = async (req, res) => {
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

    // Get orders with basic info
    const orders = await Order.find({ UserId: userIdObj })
      .populate({
        path: "items.ProductId",
        select: "productName image offerPrice originalPrice",
      })
      .populate("AddressId")
      .sort({ updatedAt: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform orders to include calculated fields
    const transformedOrders = orders.map(formatOrderSummary);

    const totalOrders = await Order.countDocuments({ UserId: userIdObj });

    res.status(200).json({
      success: true,
      orders: transformedOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching grouped orders:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching orders",
    });
  }
};

// Get single order with all items - Order details page
exports.getSingleOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({
      _id: orderId,
      UserId: userId,
    })
      .populate({
        path: "UserId",
        select: "username email phone",
      })
      .populate({
        path: "items.ProductId",
        select: "productName image offerPrice originalPrice stockQuantity category",
      })
      .populate("AddressId")
      .populate("CouponId")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get payment details
    const payment = await Payment.findOne({ OrderId: orderId }).lean();

    // Transform items to include product details
    const transformedItems = order.items.map(formatOrderItem);
    const summary = formatOrderSummary(order);

    const response = {
      ...summary,
      // Overwrite/Extend summary with detailed info
      items: transformedItems,
      subtotal: order.Subtotal,
      couponDiscount: order.CouponDiscount,
      discountAmount: order.CouponDiscount,
      refundAmount: order.RefundAmount,
      shippingAddress: { ...(order.AddressId || {}), ...(order.shippingAddress || {}) },
      actualDeliveryDate: order.actualDeliveryDate,
      coupon: order.CouponId,
      couponCode: order.CouponId?.couponCode,
      orderNotes: order.orderNotes,
      canCancelOrder: summary.canCancel,
      canReturnOrder: summary.canReturn,
    };

    res.status(200).json({
      success: true,
      order: response,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching order details",
    });
  }
};

// Cancel entire order (all items)
exports.cancelEntireOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({
      _id: orderId,
      UserId: userId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if any items cannot be cancelled
    const nonCancellableItems = order.items.filter((item) =>
      ["Delivered", "Cancelled", "Returned", "Shipped", "Out for Delivery"].includes(
        item.Status
      )
    );

    if (nonCancellableItems.length > 0) {
      return res.status(400).json({
        message: "Some items cannot be cancelled as they are already shipped or delivered",
        nonCancellableItems: nonCancellableItems.map((item) => ({
          productId: item.ProductId,
          status: item.Status,
        })),
      });
    }

    console.log(`🚫 [CANCEL ORDER] Initiating FULL cancellation for order ${orderId}`);

    let totalRefund = 0;

    // Cancel all items and restore stock using helper
    await increaseStockForOrder(order.items);

    for (const item of order.items) {
      item.Status = "Cancelled";
      item.cancellationReason = reason;
      item.cancelledAt = Date.now();
      item.cancelledBy = "User";

      // Calculate refund for this item using helper
      const itemRefund = calculateRefundAmount(order, item);
      item.refundAmount = itemRefund;
      item.RefundStatus = "Pending";
      totalRefund += itemRefund;
    }

    // Update order refund amount
    order.RefundAmount = totalRefund;

    // Process payment status update
    const isPrepaid = ["card", "razorpay", "wallet"].includes(paymentRecord?.method?.toLowerCase());
    order.paymentStatus = isPrepaid ? "Refunded" : "Failed";

    console.log(`💰 [CANCEL ORDER] Refund calculated: ₹${totalRefund}, Payment Status set to: ${order.paymentStatus}`);

    // Restore coupon usage if any
    if (order.CouponId) {
      await restoreCouponUsage(order.CouponId, order.UserId);
    }

    // Process refund
    const paymentRecord = await Payment.findOne({ OrderId: orderId });

    if (paymentRecord) {
      const method = paymentRecord.method.toLowerCase();
      if (["card", "razorpay", "wallet"].includes(method)) {
        try {
          const refundDescription = `Full refund for cancelled order ${orderId}`;
          await processWalletRefund(order.UserId, totalRefund, refundDescription, orderId, method);

          // Update refund status for all items
          order.items.forEach((item) => {
            item.RefundStatus = "Refunded";
            item.refundedAt = Date.now();
          });
        } catch (refundError) {
          console.error("Refund failed:", refundError.message);
          return res.status(400).json({ message: refundError.message });
        }
      }

      paymentRecord.refundAmount = totalRefund;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    }

    // Save order (this will auto-update orderStatus via pre-save hook)
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      refundAmount: totalRefund,
      order: {
        _id: order._id,
        orderStatus: order.orderStatus,
        refundAmount: order.RefundAmount,
      },
    });
  } catch (error) {
    console.error("Error cancelling entire order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

// Admin: Get all orders from all users
exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sort || "desc";
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    // Get orders with user details
    const orders = await Order.find()
      .populate({
        path: "UserId",
        select: "username email",
      })
      .populate({
        path: "items.ProductId",
        select: "productName image",
      })
      .sort({ createdAt: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform orders to include user info and calculated fields
    const transformedOrders = orders.map(formatOrderSummary);

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      orders: transformedOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching orders",
    });
  }
};

// Admin: Get single order details
exports.getAdminOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId)
      .populate({
        path: "UserId",
        select: "username email phone",
      })
      .populate({
        path: "items.ProductId",
        select: "productName image offerPrice originalPrice stockQuantity category",
      })
      .populate("AddressId")
      .populate("CouponId")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get payment details
    const payment = await Payment.findOne({ OrderId: orderId }).lean();

    // Transform items to include product details
    const transformedItems = order.items.map(formatOrderItem);
    const summary = formatOrderSummary(order);

    const response = {
      ...summary,
      // pricing and details
      subtotal: order.Subtotal,
      couponDiscount: order.CouponDiscount,
      discountAmount: order.CouponDiscount,
      refundAmount: order.RefundAmount,
      items: transformedItems,
      shippingAddress: order.AddressId,
      actualDeliveryDate: order.actualDeliveryDate,
      coupon: order.CouponId,
      couponCode: order.CouponId?.couponCode,
      orderNotes: order.orderNotes,
    };

    res.status(200).json({
      success: true,
      order: response,
    });
  } catch (error) {
    console.error("Error fetching admin order details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching order details",
    });
  }
};

