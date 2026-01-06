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

    const shippingAddressSnapshot = {
      name: userSnapshot ? userSnapshot.username : "N/A", // Or fetch from address if available later
      phone: userSnapshot ? userSnapshot.phone : "N/A",
      addressLine1: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      pincode: address.zipCode.toString()
    };

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
        const variant = await ProductVariant.findOne({
          productId: product._id,
          color: item.color.toLowerCase(), // Ensure case matching
          size: item.size.toUpperCase()
        }).session(session);

        if (!variant) {
          throw new Error(`Variant ${item.color}/${item.size} not found for ${product.productName}`);
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
          // Logic: if variant has offerPrice, use it. Else if variant has price, use it? 
          // Or does variant offerPrice override product baseOfferPrice?
          // Let's assume strict override if present.
          if (variant.offerPrice > 0) price = variant.offerPrice;
          else if (variant.price > 0) price = variant.price;
        }

      } else {
        // Fallback for Products without Variants or outdated data
        if (product.totalStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.productName}`);
        }
      }

      // Always Deduct Total Stock from Main Product (as a cached sum)
      product.totalStock -= item.quantity;
      await product.save({ session });

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        ProductId: product._id,
        productName: product.productName,
        productImage: product.image,
        Price: price,
        Quantity: item.quantity,
        itemTotal: itemTotal,
        color: item.color,
        size: item.size,
        Status: "Pending"
      });
    }

    // 2. Calculate Costs
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% Tax
    const shippingCost = 15; // Fixed shipping
    let couponDiscount = 0;
    let couponId = null;

    // 3. Apply Coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() }).session(session);

      if (coupon) {
        if (!coupon.isAvailable()) {
          throw new Error("Coupon is expired or usage limit reached");
        }

        if (subtotal < coupon.minAmount) {
          throw new Error(`Minimum purchase of ₹${coupon.minAmount} required for this coupon`);
        }

        // Check per-user limit
        if (!coupon.canUserApply(userId.toString())) {
          // Allow if unchecked, but strictly user limit applies
          // Logic in coupon model: canUserApply checks usage count
          throw new Error("You have already used this coupon or are not eligible");
        }

        // Calculate Discount
        let discountCalc = (subtotal * coupon.discount) / 100;
        if (discountCalc > coupon.maxAmount) {
          discountCalc = coupon.maxAmount;
        }

        couponDiscount = Math.round(discountCalc * 100) / 100;
        couponId = coupon._id;

        // Update Coupon Usage
        coupon.usageCount += 1;
        coupon.appliedUsers.push(userId.toString());
        await coupon.save({ session });
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
      CoupenId: couponId,
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

    const itemsToUpdate = order.items.filter(item => itemsIds.includes(item._id.toString()));

    for (const item of itemsToUpdate) {
      // Check if status is actually changing
      if (item.Status === status) continue;

      // Handle Stock Restoration for Cancel/Return
      if ((status === "Cancelled" || status === "Returned") &&
        item.Status !== "Cancelled" && item.Status !== "Returned") {

        const product = await Product.findById(item.ProductId);
        if (product) {
          product.totalStock += item.Quantity;
          await product.save();

          // Restore Variant Stock
          if (item.color && item.size) {
            const variant = await ProductVariant.findOne({
              productId: product._id,
              color: item.color.toLowerCase(),
              size: item.size.toUpperCase()
            });

            if (variant) {
              variant.stockQuantity += item.Quantity;
              await variant.save();
            }
          }
        }

        // Set Timestamps & Reasons
        if (status === "Cancelled") {
          item.cancelledAt = Date.now();
          item.cancellationReason = "Cancelled by Admin";
        } else {
          item.returnedAt = Date.now();
          item.returnReason = "Returned by Admin";
        }

        // Handle Refund
        let refundAmount = item.Price * item.Quantity;

        if (order.CouponDiscount > 0) {
          const discountPercentage = order.CouponDiscount / order.Subtotal;
          refundAmount = refundAmount * (1 - discountPercentage);
        }

        item.refundAmount = refundAmount;
        item.RefundStatus = "Pending";

        // Process Wallet Refund (Reusing logic from cancelOrder simplified)
        // Finding payment record
        const paymentRecord = await Payment.findOne({ OrderId: order._id });

        if (paymentRecord && ["card", "razorpay", "wallet", "cod"].includes(paymentRecord.method.toLowerCase())) {
          // For COD, only refund if Returned (User paid) or if Cancelled AND status was Delivered? 
          // Actually if Admin cancels a pending COD, no refund.
          // if Admin Returns a COD (Delivered), yes refund.

          const shouldRefund = (paymentRecord.method.toLowerCase() !== "cod") ||
            (status === "Returned");

          if (shouldRefund) {
            const userWallet = await Wallet.findOne({ userId: order.UserId });
            if (userWallet && userWallet.status === "Active") {
              // Check Max Limit
              if (userWallet.balance + refundAmount <= 100000) {
                userWallet.balance += refundAmount;
                await userWallet.save();

                await Transaction.create({
                  walletId: userWallet._id,
                  userId: order.UserId,
                  type: "Credit",
                  amount: refundAmount,
                  description: `Refund for ${status} item in order ${order._id}`,
                  transactionType: "Refund",
                  status: "Successful",
                  paymentMethod: paymentRecord.method.toLowerCase()
                });

                item.RefundStatus = "Refunded";
                item.refundedAt = Date.now();

                paymentRecord.refundAmount += refundAmount;
                paymentRecord.refundStatus = "Refunded";
                await paymentRecord.save();

                order.RefundAmount += refundAmount;
              }
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
      const user = await User.findById(order.UserId);
      if (user && user.referredBy && !user.isReferrerRewardClaimed) {
        // Check if this is the first delivered order
        const deliveredOrders = await Order.find({
          UserId: order.UserId,
          orderStatus: "Delivered"
        });

        // Only give referral bonus if this is the first delivered order
        if (deliveredOrders.length === 1) {
          const referrerId = user.referredBy;
          const referrer = await User.findOne({ referralCode: referrerId });

          if (referrer) {
            const referrerWallet = await Wallet.findOne({ userId: referrer._id });

            if (referrerWallet && referrerWallet.status === "Active") {
              const bonusAmount = 100; // Configurable amount

              // Check wallet max limit
              if (referrerWallet.balance + bonusAmount <= 100000) {
                referrerWallet.balance += bonusAmount;
                await referrerWallet.save();

                await Transaction.create({
                  walletId: referrerWallet._id,
                  userId: referrer._id,
                  type: "Credit",
                  amount: bonusAmount,
                  description: `Referral Bonus: ${user.username || 'Friend'} completed first order`,
                  transactionType: "Referral",
                  status: "Successful"
                });

                user.isReferrerRewardClaimed = true;
                await user.save();
              }
            }
          }
        }
      }
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

    const product = await Product.findById(order.items[itemIndex].ProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Restore Total Stock
    product.stockQuantity += order.items[itemIndex].Quantity;
    // NOTE: Schema has totalStock, but previous code successfully used stockQuantity aliased or virtual? 
    // Schema says totalStock. But check product model... 
    // Product model has totalStock. Wait. 
    // Previous code said `product.stockQuantity += ...`
    // Let's check Product Model again.
    // Product model has `totalStock`. It does NOT have `stockQuantity`.
    // Wait, let's fix that.
    if (product.totalStock !== undefined) {
      product.totalStock += order.items[itemIndex].Quantity;
    } else {
      // Fallback if schema was different in some version, but we saw totalStock in file view
      product.totalStock = (product.totalStock || 0) + order.items[itemIndex].Quantity;
    }

    await product.save();

    // Restore Variant Stock
    const item = order.items[itemIndex];
    if (item.color && item.size) {
      const variant = await ProductVariant.findOne({
        productId: product._id,
        color: item.color.toLowerCase(),
        size: item.size.toUpperCase()
      });

      if (variant) {
        variant.stockQuantity += item.Quantity;
        await variant.save();
      }
    }

    order.items[itemIndex].Status = "Cancelled";
    order.items[itemIndex].cancellationReason = reason;
    order.items[itemIndex].cancelledAt = Date.now();

    let refundAmount =
      order.items[itemIndex].Price * order.items[itemIndex].Quantity;

    if (order?.CouponDiscount > 0) {
      const discountPercentage = order.CouponDiscount / order.Subtotal;
      refundAmount = refundAmount * (1 - discountPercentage);
    }

    // Validate refund amount
    if (refundAmount <= 0) {
      return res.status(400).json({ message: "Invalid refund amount" });
    }

    order.items[itemIndex].refundAmount = refundAmount;
    order.items[itemIndex].RefundStatus = "Pending";

    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      if (
        paymentRecord.method.toLowerCase() === "card" ||
        paymentRecord.method.toLowerCase() === "razorpay" ||
        paymentRecord.method.toLowerCase() === "wallet"
      ) {
        const userWallet = await Wallet.findOne({
          userId: paymentRecord.userId,
        });
        if (!userWallet) {
          return res.status(404).json({ message: "User wallet not found" });
        }

        // Check wallet status
        if (userWallet.status !== "Active") {
          return res.status(400).json({
            message: "Cannot refund to inactive wallet. Please contact support."
          });
        }

        // Check wallet max limit (₹100,000)
        if (userWallet.balance + refundAmount > 100000) {
          return res.status(400).json({
            message: "Refund would exceed wallet maximum limit of ₹100,000. Please contact support."
          });
        }

        userWallet.balance += refundAmount;
        await userWallet.save();

        const transaction = new Transaction({
          walletId: userWallet?._id,
          userId: paymentRecord?.userId,
          type: "Credit",
          amount: refundAmount,
          description: `Refund for cancelled item in order ${paymentRecord?.OrderId}`,
          transactionType: "Refund",
          status: "Successful",
        });
        await transaction.save();

        order.items[itemIndex].RefundStatus = "Refunded";
        order.items[itemIndex].refundedAt = Date.now();
      } else if (paymentRecord.method.toLowerCase() === "cod") {
        console.log("No refund necessary for COD orders");
      }

      paymentRecord.refundAmount += refundAmount;
      paymentRecord.refundStatus = "Refunded";
      await paymentRecord.save();
    } else {
      console.log("No payment record found for this order");
    }

    order.RefundAmount += refundAmount;
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

    const product = await Product.findById(order.items[itemIndex].ProductId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Restore stock
    if (product.totalStock !== undefined) {
      product.totalStock += order.items[itemIndex].Quantity;
    } else {
      product.totalStock = (product.totalStock || 0) + order.items[itemIndex].Quantity;
    }
    await product.save();

    // Restore Variant Stock
    const item = order.items[itemIndex];
    if (item.color && item.size) {
      const variant = await ProductVariant.findOne({
        productId: product._id,
        color: item.color.toLowerCase(),
        size: item.size.toUpperCase()
      });

      if (variant) {
        variant.stockQuantity += item.Quantity;
        await variant.save();
      }
    }

    // Update item status and timestamps
    order.items[itemIndex].Status = "Returned";
    order.items[itemIndex].returnReason = reason;
    order.items[itemIndex].returnRequestedAt = Date.now();
    order.items[itemIndex].returnedAt = Date.now();

    // Calculate refund with CORRECT coupon discount (order-level)
    let refundAmount =
      order.items[itemIndex].Price * order.items[itemIndex].Quantity;

    // Apply proportional coupon discount (same as cancelOrder)
    if (order.CouponDiscount > 0) {
      const discountPercentage = order.CouponDiscount / order.Subtotal;
      refundAmount = refundAmount * (1 - discountPercentage);
    }

    // Validate refund amount
    if (refundAmount <= 0) {
      return res.status(400).json({ message: "Invalid refund amount" });
    }

    // Update item refund tracking
    order.items[itemIndex].refundAmount = refundAmount;
    order.items[itemIndex].RefundStatus = "Pending";

    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      // Refund to wallet for all payment methods (including COD - already paid)
      if (
        paymentRecord.method.toLowerCase() === "card" ||
        paymentRecord.method.toLowerCase() === "razorpay" ||
        paymentRecord.method.toLowerCase() === "wallet" ||
        paymentRecord.method.toLowerCase() === "cod"
      ) {
        const userWallet = await Wallet.findOne({
          userId: paymentRecord.userId,
        });

        if (!userWallet) {
          console.error(`Wallet not found for user ${paymentRecord.userId}`);
          return res.status(404).json({ message: "User wallet not found" });
        }

        // Check wallet status
        if (userWallet.status !== "Active") {
          return res.status(400).json({
            message: "Cannot refund to inactive wallet. Please contact support."
          });
        }

        // Check wallet max limit (₹100,000)
        if (userWallet.balance + refundAmount > 100000) {
          return res.status(400).json({
            message: "Refund would exceed wallet maximum limit of ₹100,000. Please contact support."
          });
        }

        // Credit wallet
        userWallet.balance += refundAmount;
        await userWallet.save();

        // Create transaction record
        await Transaction.create({
          walletId: userWallet._id,
          userId: paymentRecord.userId,
          type: "Credit",
          amount: refundAmount,
          description: `Refund for returned item in order ${orderId}`,
          transactionType: "Refund",
          status: "Successful",
          orderId: orderId,
          paymentMethod: paymentRecord.method.toLowerCase(),
        });

        // Update item refund status
        order.items[itemIndex].RefundStatus = "Refunded";
        order.items[itemIndex].refundedAt = Date.now();
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
      .sort({ createdAt: sortDirection })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Transform orders to include calculated fields
    const transformedOrders = orders.map((order) => {
      const itemCount = order.items.length;
      const firstItem = order.items[0];

      // Get first few product images for preview
      const productImages = order.items
        .slice(0, 3)
        .map((item) => item.ProductId?.image)
        .filter(Boolean);

      return {
        _id: order._id,
        orderId: `ORD-${order._id.toString().slice(0, 8).toUpperCase()}`,
        orderDate: order.createdAt,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.TotalAmount,
        itemCount,
        productImages,
        expectedDeliveryDate: order.expectedDeliveryDate,
        canCancel: order.items.some(
          (item) =>
            !["Delivered", "Cancelled", "Returned", "Shipped", "Out for Delivery"].includes(
              item.Status
            )
        ),
        canReturn: order.items.some((item) => item.Status === "Delivered"),
      };
    });

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
        path: "items.ProductId",
        select: "productName image offerPrice originalPrice stockQuantity category",
      })
      .populate("AddressId")
      .populate("CoupenId")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get payment details
    const payment = await Payment.findOne({ OrderId: orderId }).lean();

    // Transform items to include product details
    const transformedItems = order.items.map((item) => ({
      itemId: item._id,
      productId: item.ProductId?._id,
      productName: item.ProductId?.productName || item.productName,
      productImage: item.ProductId?.image || item.productImage,
      price: item.Price,
      quantity: item.Quantity,
      itemTotal: item.itemTotal,
      status: item.Status,
      trackingNumber: item.trackingNumber,

      // Timestamps
      confirmedAt: item.confirmedAt,
      shippedAt: item.shippedAt,
      deliveredAt: item.deliveredAt,
      cancelledAt: item.cancelledAt,
      returnedAt: item.returnedAt,

      // Cancellation/Return info
      cancellationReason: item.cancellationReason,
      returnReason: item.returnReason,

      // Refund info
      refundStatus: item.RefundStatus,
      refundAmount: item.refundAmount,
      refundedAt: item.refundedAt,

      // Actions available
      canCancel: !["Delivered", "Cancelled", "Returned", "Shipped", "Out for Delivery"].includes(
        item.Status
      ),
      canReturn: item.Status === "Delivered",
    }));

    const response = {
      _id: order._id,
      orderId: `ORD-${order._id.toString().slice(0, 8).toUpperCase()}`,
      orderDate: order.createdAt,
      orderStatus: order.orderStatus,

      // Payment info
      paymentMethod: order.paymentMethod || payment?.method,
      paymentStatus: order.paymentStatus || payment?.status,

      // Pricing
      subtotal: order.Subtotal,
      couponDiscount: order.CouponDiscount,
      totalAmount: order.TotalAmount,
      refundAmount: order.RefundAmount,

      // Items
      items: transformedItems,
      itemCount: order.items.length,

      // Address
      shippingAddress: order.AddressId,

      // Delivery
      expectedDeliveryDate: order.expectedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,

      // Coupon
      coupon: order.CoupenId,

      // Notes
      orderNotes: order.orderNotes,

      // Actions
      canCancelOrder: order.items.some(
        (item) =>
          !["Delivered", "Cancelled", "Returned", "Shipped", "Out for Delivery"].includes(
            item.Status
          )
      ),
      canReturnOrder: order.items.some((item) => item.Status === "Delivered"),
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

    let totalRefund = 0;

    // Cancel all items and restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.ProductId);
      if (product) {
        if (product.totalStock !== undefined) {
          product.totalStock += item.Quantity;
        } else {
          product.totalStock = (product.totalStock || 0) + item.Quantity;
        }
        await product.save();

        // Restore Variant Stock
        if (item.color && item.size) {
          const variant = await ProductVariant.findOne({
            productId: product._id,
            color: item.color.toLowerCase(),
            size: item.size.toUpperCase()
          });

          if (variant) {
            variant.stockQuantity += item.Quantity;
            await variant.save();
          }
        }
      }

      item.Status = "Cancelled";
      item.cancellationReason = reason;
      item.cancelledAt = Date.now();

      // Calculate refund for this item
      let itemRefund = item.Price * item.Quantity;

      // Apply proportional coupon discount if exists
      if (order.CouponDiscount > 0) {
        const discountPercentage = order.CouponDiscount / order.Subtotal;
        itemRefund = itemRefund * (1 - discountPercentage);
      }

      item.refundAmount = itemRefund;
      item.RefundStatus = "Pending";
      totalRefund += itemRefund;
    }

    // Update order refund amount
    order.RefundAmount = totalRefund;

    // Process refund
    const paymentRecord = await Payment.findOne({ OrderId: orderId });

    if (paymentRecord) {
      if (
        paymentRecord.method.toLowerCase() === "card" ||
        paymentRecord.method.toLowerCase() === "razorpay" ||
        paymentRecord.method.toLowerCase() === "wallet"
      ) {
        const userWallet = await Wallet.findOne({ userId: order.UserId });

        if (!userWallet) {
          return res.status(404).json({ message: "User wallet not found" });
        }

        // Check wallet status
        if (userWallet.status !== "Active") {
          return res.status(400).json({
            message: "Cannot refund to inactive wallet. Please contact support."
          });
        }

        // Check wallet max limit (₹100,000)
        if (userWallet.balance + totalRefund > 100000) {
          return res.status(400).json({
            message: "Refund would exceed wallet maximum limit of ₹100,000. Please contact support."
          });
        }

        userWallet.balance += totalRefund;
        await userWallet.save();

        await Transaction.create({
          walletId: userWallet._id,
          userId: order.UserId,
          type: "Credit",
          amount: totalRefund,
          description: `Full refund for cancelled order ${orderId}`,
          transactionType: "Refund",
          status: "Successful",
        });

        // Update refund status for all items
        order.items.forEach((item) => {
          item.RefundStatus = "Refunded";
          item.refundedAt = Date.now();
        });
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
    const transformedOrders = orders.map((order) => {
      const itemCount = order.items.length;

      // Get first few product images for preview
      const productImages = order.items
        .slice(0, 3)
        .map((item) => item.ProductId?.image)
        .filter(Boolean);

      return {
        _id: order._id,
        orderId: `ORD-${order._id.toString().slice(0, 8).toUpperCase()}`,
        orderDate: order.createdAt,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: order.TotalAmount,
        itemCount,
        productImages,
        expectedDeliveryDate: order.expectedDeliveryDate,
        userName: order.UserId?.username || "Unknown",
        userEmail: order.UserId?.email || "Unknown",
        userId: order.UserId?._id,
      };
    });

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
      .populate("CoupenId")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get payment details
    const payment = await Payment.findOne({ OrderId: orderId }).lean();

    // Transform items to include product details
    const transformedItems = order.items.map((item) => ({
      itemId: item._id,
      productId: item.ProductId?._id,
      productName: item.ProductId?.productName || item.productName,
      productImage: item.ProductId?.image || item.productImage,
      price: item.Price,
      quantity: item.Quantity,
      itemTotal: item.itemTotal,
      status: item.Status,
      trackingNumber: item.trackingNumber,

      // Timestamps
      confirmedAt: item.confirmedAt,
      shippedAt: item.shippedAt,
      deliveredAt: item.deliveredAt,
      cancelledAt: item.cancelledAt,
      returnedAt: item.returnedAt,

      // Cancellation/Return info
      cancellationReason: item.cancellationReason,
      returnReason: item.returnReason,

      // Refund info
      refundStatus: item.RefundStatus,
      refundAmount: item.refundAmount,
      refundedAt: item.refundedAt,
    }));

    const response = {
      _id: order._id,
      orderId: `ORD-${order._id.toString().slice(0, 8).toUpperCase()}`,
      orderDate: order.createdAt,
      orderStatus: order.orderStatus,

      // User info
      userName: order.UserId?.username,
      userEmail: order.UserId?.email,
      userPhone: order.UserId?.phone,
      userId: order.UserId?._id,

      // Payment info
      paymentMethod: order.paymentMethod || payment?.method,
      paymentStatus: order.paymentStatus || payment?.status,

      // Pricing
      subtotal: order.Subtotal,
      couponDiscount: order.CouponDiscount,
      totalAmount: order.TotalAmount,
      refundAmount: order.RefundAmount,

      // Items
      items: transformedItems,
      itemCount: order.items.length,

      // Address
      shippingAddress: order.AddressId,

      // Delivery
      expectedDeliveryDate: order.expectedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,

      // Coupon
      coupon: order.CoupenId,

      // Notes
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


