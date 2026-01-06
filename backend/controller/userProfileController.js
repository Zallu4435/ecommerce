const Address = require("../model/Address");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../model/User");
const Order = require("../model/Orders");
const Coupon = require("../model/Coupon");
const Product = require("../model/Products");
const Cart = require("../model/Cart");
const Payment = require("../model/Payment");
const Wallet = require("../model/Wallet");
const Transaction = require("../model/WalletTransaction");
const ProductVariant = require("../model/ProductVariants");
const { sendMail } = require("../utils/email");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const {
  decreaseStockForOrder,
  increaseStockForOrder,
  validateAndApplyCoupon,
  handleSingleProductOrder,
  handleCartOrder,
  removeOrderedItemsFromCart,
  ensureStockAndDeductForOrder,
  verifyRazorpaySignature,
  createShippingSnapshot,
  restoreStockIfPending,
  consumeCouponUsage
} = require("../utils/orderHelper");
require("dotenv").config({ path: "backend/config/.env" }); // Ensure env vars are loaded

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourKeyHere",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YourSecretHere",
});


exports.contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await sendMail({
      email: email,
      subject: "New Contact Request",
      message: `You have received a new message from ${name} (${email}):\n\n${message}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ message: "Message sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ message: "Failed to send message." });
  }
};


exports.getAddress = async (req, res) => {
  try {
    const userId = req.user;
    const addresses = await Address.find({ userId: userId }).sort({
      createdAt: -1,
      updatedAt: -1,
    });

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch addresses", error: error.message });
  }
};

exports.getAddressById = async (req, res, next) => {
  try {
    const userId = req.user;
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Address id is required", 400));
    }

    const address = await Address.findOne({ _id: id, userId });
    if (!address) {
      return next(new ErrorHandler("Address not found", 404));
    }

    return res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address by id:", error);
    return next(new ErrorHandler("Failed to fetch address", 500));
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.user;
    const { country, state, city, zipCode, street, house, landmark, fullName, phone } = req.body;

    const existingAddress = await Address.findOne({
      street,
    });

    if (existingAddress) {
      return next(
        new ErrorHandler("Address with these details already exists", 400)
      );
    }

    const address = await Address.create({
      userId,
      country,
      state,
      city,
      zipCode,
      street,
      house,
      landmark,
      fullName,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return next(new ErrorHandler("Failed to add address", 500));
  }
};

exports.editAddress = async (req, res, next) => {
  try {
    const userId = req.user;
    const { _id, country, state, city, zipCode, street, house, landmark, fullName, phone } = req.body;

    const address = await Address.findOne({ _id, userId });
    if (!address) {
      return next(new ErrorHandler("Address not found", 404));
    }

    const existingAddress = await Address.findOne({
      userId,
      street,
      _id: { $ne: _id },
    });

    if (existingAddress) {
      return next(
        new ErrorHandler("Address with these details already exists", 400)
      );
    }

    address.country = country || address.country;
    address.state = state || address.state;
    address.city = city || address.city;
    address.zipCode = zipCode || address.zipCode;
    address.street = street || address.street;
    address.house = house || address.house;
    address.landmark = landmark || address.landmark;
    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return next(new ErrorHandler("Failed to update address", 500));
  }
};

exports.removeAddress = async (req, res, next) => {
  const userId = req.user;
  const { id } = req.params;

  const address = await Address.findOne({ _id: id, userId });
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  await address.deleteOne();

  res.status(200).json({
    success: true,
    message: "Address removed successfully",
  });
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler("Failed to change password", 500));
  }
};

exports.checkoutAddress = async (req, res) => {
  try {
    const userId = req.user;

    const addressWithUserDetails = await Address.find({ userId: userId });

    if (!addressWithUserDetails) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(addressWithUserDetails);
  } catch (error) {
    console.error("Error fetching address and user details:", error);
    res.status(500).json({
      message: "Failed to fetch address and user details",
      error: error.message,
    });
  }
};

exports.checkProductStock = async (req, res) => {
  try {
    const { productId, quantity, color, size, gender } = req.query;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "ProductId and quantity are required." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    let isAvailable = false;

    // Check Variant Stock if details provided
    if (color && size) {
      let variantQuery = {
        productId: product._id,
        color: color.toLowerCase(),
        size: size.toUpperCase()
      };

      if (gender) {
        variantQuery.gender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
      }

      const variant = await ProductVariant.findOne(variantQuery);

      if (variant && variant.stockQuantity >= quantity) {
        isAvailable = true;
      }
    } else {
      // Check Total Stock for simple products
      if ((product.totalStock || 0) >= quantity) {
        isAvailable = true;
      }
    }

    return res.status(200).json({ isStockAvailable: isAvailable });

  } catch (error) {
    console.error("Error checking stock:", error);
    return res.status(500).json({ message: "Error checking product stock." });
  }
};

// Helpers moved to orderHelper.js

// Helpers removed and replaced by orderHelper.js

const handleAddress = async (address, userId) => {
  if (address._id) {
    const existingAddress = await Address.findOne({ _id: address._id, userId });
    if (existingAddress) {
      return existingAddress._id;
    }
    throw new Error("Address not found for the provided ID.");
  } else {
    const newAddressRecord = new Address({ userId, ...address });
    const savedAddress = await newAddressRecord.save();
    return savedAddress._id;
  }
};

const createOrderRecord = async (
  userId,
  items,
  subtotal,
  couponDiscount,
  totalAmount,
  addressId,
  couponId,
  shippingAddress, // New parameter
  paymentMethod // New parameter
) => {
  const orderRecord = new Order({
    UserId: userId,
    items,
    Subtotal: subtotal,
    CouponDiscount: couponDiscount,
    TotalAmount: totalAmount,
    AddressId: addressId,
    CouponId: couponId,
    shippingAddress: shippingAddress, // Embed Snapshot
    paymentMethod: paymentMethod // Save payment method
  });

  const savedOrder = await orderRecord.save();

  return savedOrder;
};

const createPaymentRecord = async (
  userId,
  orderId,
  paymentMethod,
  totalAmount,
  razorpayTransactionId = null
) => {
  let paymentStatus = "Pending";
  let transactionId = null;

  // Convert to lowercase for consistent logic checks
  const method = paymentMethod.toLowerCase();

  console.log('🔵 [PAYMENT] Processing payment for order:', orderId, 'Method:', method);

  let razorpayOrderId = null;

  if (method === "card" || method === "wallet") {
    let wallet = await Wallet.findOne({ userId });
    console.log('💰 [WALLET] Wallet balance:', wallet?.balance || 0, 'Required:', totalAmount);

    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0, status: "Active" });
      await wallet.save();
    }

    if (wallet.balance < totalAmount) {
      const existingOrder = await Order.findById(orderId);
      if (existingOrder?.items?.length) {
        existingOrder.items.forEach((item) => { item.Status = "Payment Failed"; });
        existingOrder.paymentStatus = "Failed";
        existingOrder.markModified('items');
        await existingOrder.save();
      }

      const failedTransaction = new Transaction({
        walletId: wallet._id, userId, type: "Debit", amount: totalAmount,
        description: `Failed payment for order ${orderId} - Insufficient balance`,
        status: "Failed", orderId, paymentMethod: "wallet",
        transactionType: "Purchase",
      });
      await failedTransaction.save();
      paymentStatus = "Failed";
      transactionId = failedTransaction._id;
      throw new Error(`Insufficient wallet balance. Available: ₹${wallet.balance.toFixed(2)}, Required: ₹${totalAmount.toFixed(2)}`);
    }

    wallet.balance -= totalAmount;
    await wallet.save();

    const transaction = new Transaction({
      walletId: wallet._id, userId, type: "Debit", amount: totalAmount,
      description: `Payment for order ${orderId}`,
      status: "Successful", orderId, paymentMethod: "wallet",
      transactionType: "Purchase",
    });
    await transaction.save();
    transactionId = transaction._id;
    paymentStatus = "Successful";
    paymentMethod = "Wallet";

  } else if (method === "razorpay") {
    paymentStatus = "Pending";
    paymentMethod = "Razorpay";
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_order_${orderId}`,
    });
    razorpayOrderId = razorpayOrder.id;

  } else if (method === "cod") {
    paymentStatus = "Pending";
    paymentMethod = "COD";
  } else {
    throw new Error("Invalid payment method.");
  }

  // Ensure user has a wallet and create transaction record for history
  try {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    if (method !== "card" && method !== "wallet") {
      const transaction = new Transaction({
        walletId: wallet._id,
        userId,
        type: "Debit",
        amount: totalAmount,
        description: `Payment for order ${orderId} via ${paymentMethod}`,
        transactionType: "Purchase",
        status: "Pending", // Razorpay/COD start as Pending
        orderId: orderId,
        paymentMethod: method?.toLowerCase() === 'razorpay' ? 'razorpay' : (method?.toLowerCase() === 'cod' ? 'cod' : 'card'),
        transactionType: "Purchase"
      });
      await transaction.save();
      transactionId = transaction._id;
    } else {
      // Wallet/Card already handled above and set transactionId
    }
  } catch (txError) {
    console.error('⚠️ [PAYMENT] Failed to create wallet transaction record:', txError.message);
  }

  const paymentRecord = new Payment({
    userId,
    OrderId: orderId,
    status: paymentStatus,
    method: paymentMethod,
    amount: totalAmount,
    transactionId: transactionId || null,
  });

  const savedPayment = await paymentRecord.save();
  return { paymentRecord: savedPayment, razorpayOrderId };
};

exports.processPayment = async (req, res) => {
  try {
    const { address, order, payment } = req.body;
    const couponCode = req.body.couponCode || order?.couponCode;
    const userId = req.user;

    console.log('🚀 [PAYMENT START] Initiating payment process');
    console.log('📦 [PAYMENT START] Order structure:', JSON.stringify(order, null, 2));

    let items = [];
    let cart = null;
    let isCartOrder = false;

    // Prioritize Cart Order if cartItems are present
    if (order?.cartItems && order.cartItems.length > 0) {
      console.log('🛒 [PAYMENT MODE] Cart Order detected');

      // Inject top-level productId into items if they are missing it (common in some Buy Now flows)
      const sanitizedCartItems = order.cartItems.map(item => ({
        ...item,
        productId: item.productId || item.ProductId || order.productId
      }));

      const cartResult = await handleCartOrder(userId, sanitizedCartItems);
      items = cartResult.items;
      cart = cartResult.cart;
      isCartOrder = true;
    } else if (order?.productId) {
      console.log('🛍️ [PAYMENT MODE] Single Product Buy Now detected');

      // Extract variant details from top level or fallback to first cart item if it was mis-structured
      const color = order.color || order.cartItems?.[0]?.color;
      const size = order.size || order.cartItems?.[0]?.size;
      const gender = order.gender || order.cartItems?.[0]?.gender;
      const quantity = order.quantity || order.cartItems?.[0]?.quantity || 1;

      const variantDetails = { color, size, gender };

      console.log('📝 [PAYMENT MODE] Extracted variant details:', variantDetails);

      items.push(await handleSingleProductOrder(order.productId, quantity, variantDetails));
    } else {
      return res
        .status(400)
        .json({ message: "Either productId or cartItems are required." });
    }

    // Calculate actual subtotal from items (trusting DB prices only)
    const subtotal = items.reduce((acc, item) => acc + (item.itemTotal || 0), 0);
    console.log(`💰 [PAYMENT] Calculated Subtotal from items: ₹${subtotal.toFixed(2)}`);
    console.log(`🔍 [DEBUG] Extracted Coupon Code: "${couponCode}" for user ${userId}`);

    const { coupon, discountAmount } = await validateAndApplyCoupon(couponCode, userId, items);
    const couponDiscount = discountAmount;
    if (coupon) {
      console.log(`🎟️ [PAYMENT] Applied Coupon "${coupon.couponCode}": Discount ₹${couponDiscount.toFixed(2)}`);
    } else {
      console.log(`⚠️ [PAYMENT] No coupon applied (Code: ${couponCode})`);
    }

    const addressReference = await handleAddress(address, userId);

    // Create Address Snapshot
    const addressData = await Address.findById(addressReference);
    const userData = await User.findById(userId);

    const shippingAddressSnapshot = createShippingSnapshot(addressData, userData);

    const totalAmount = subtotal - couponDiscount;

    // Normalize payment method for Enum validation
    let normalizedPaymentMethod = payment.paymentMethod;
    if (normalizedPaymentMethod.toLowerCase() === 'razorpay') normalizedPaymentMethod = 'Razorpay';
    else if (normalizedPaymentMethod.toLowerCase() === 'cod') normalizedPaymentMethod = 'COD';
    else if (normalizedPaymentMethod.toLowerCase() === 'wallet') normalizedPaymentMethod = 'Wallet';
    else if (normalizedPaymentMethod.toLowerCase() === 'card') normalizedPaymentMethod = 'Card';

    const savedOrder = await createOrderRecord(
      userId,
      items,
      subtotal,
      couponDiscount,
      totalAmount,
      addressReference,
      coupon?._id,
      shippingAddressSnapshot,
      normalizedPaymentMethod // Pass normalized payment method
    );

    console.log('\ud83d\udce6 [ORDER] Order created with ID:', savedOrder._id);
    console.log('\ud83d\udcb3 [PAYMENT] Payment method:', payment.paymentMethod);

    let paymentRecord;
    let razorpayOrderId;
    let shouldDeductStock = false;

    try {
      const paymentResult = await createPaymentRecord(
        userId,
        savedOrder._id,
        normalizedPaymentMethod,
        totalAmount
      );
      paymentRecord = paymentResult.paymentRecord;
      razorpayOrderId = paymentResult.razorpayOrderId;

      // Only deduct stock if payment is successful or pending (not failed)
      shouldDeductStock = paymentRecord.status !== "Failed";

    } catch (paymentError) {
      console.log('❌ [CATCH] Payment error caught:', paymentError.message);

      const failedOrder = await Order.findById(savedOrder._id);
      if (failedOrder?.items?.length) {
        failedOrder.items.forEach((item) => { item.Status = "Payment Failed"; });
        failedOrder.paymentStatus = "Failed";
        failedOrder.markModified('items');
        await failedOrder.save();
      }

      return res.status(400).json({
        message: paymentError.message || "Payment failed",
        orderId: savedOrder._id,
        paymentStatus: "Failed",
        canRetry: true,
      });
    }

    // Decrease product stock quantities only for successful/pending payments
    if (shouldDeductStock) {
      await decreaseStockForOrder(items);

      // Only remove from cart if it was a true cart checkout (indicated by lack of order.productId)
      const isTrueCartCheckout = isCartOrder && !order?.productId;
      if (isTrueCartCheckout) {
        await removeOrderedItemsFromCart(userId, items);
      } else {
        console.log('🛍️ [BUY NOW] Skipping cart removal');
      }
    }

    res.status(200).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      paymentId: paymentRecord._id,
      paymentStatus: paymentRecord.status,
      razorpayOrderId: razorpayOrderId,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({
      message: error.message || "An error occurred while processing the order.",
    });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
      amount
    } = req.body;

    console.log('🔄 [RAZORPAY] Verifying payment for order:', orderId);

    // Verify the payment signature
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      console.log('❌ [RAZORPAY] Invalid payment signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find the existing order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update payment record with Razorpay details
    const paymentRecord = await Payment.findOne({ OrderId: orderId });
    if (paymentRecord) {
      paymentRecord.status = 'Successful';
      paymentRecord.razorpayPaymentId = razorpay_payment_id;
      paymentRecord.razorpayOrderId = razorpay_order_id;
      paymentRecord.paymentDate = new Date();
      await paymentRecord.save();
    }

    // Update order status and handle stock if it was cancelled
    let stockUpdated = false;

    // Check if we need to re-deduct stock
    const needsStockRededuction = order.items.some(item =>
      item.Status === 'Cancelled' || item.Status === 'Payment Failed'
    ) || order.orderStatus === 'Cancelled';

    if (needsStockRededuction) {
      await ensureStockAndDeductForOrder(order.items);
      // Re-consume coupon if it was restored
      if (order.CouponId) {
        await consumeCouponUsage(order.CouponId, order.UserId);
      }
      stockUpdated = true;
    }

    // Update all item statuses to Confirmed
    order.items = order.items.map(item => ({
      ...item.toObject?.() || item,
      Status: "Confirmed"
    }));

    order.paymentStatus = 'Completed';
    order.orderStatus = 'Confirmed';
    await order.save();

    // Ensure cart is cleared upon successful verification if this was a cart order
    // (Identifying cart order by checking if top-level order object exists or just checking matching items)
    await removeOrderedItemsFromCart(order.UserId, order.items);

    // Update Transaction record for history
    try {
      if (paymentRecord && paymentRecord.transactionId) {
        await Transaction.findByIdAndUpdate(paymentRecord.transactionId, {
          status: "Successful",
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          description: `Payment for order ${orderId} via Razorpay (Verified)`
        });
        console.log('📝 [RAZORPAY] Existing transaction record updated to Successful');
      } else {
        // Fallback: create if not found or not linked
        let wallet = await Wallet.findOne({ userId: order.UserId });
        if (!wallet) wallet = await Wallet.create({ userId: order.UserId, balance: 0 });

        await Transaction.create({
          walletId: wallet._id,
          userId: order.UserId,
          type: "Debit",
          amount: order.TotalAmount,
          description: `Payment for order ${orderId} via Razorpay`,
          transactionType: "Purchase",
          status: "Successful",
          orderId: order._id,
          paymentMethod: "razorpay",
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id
        });
        console.log('📝 [RAZORPAY] New transaction record created (Fallback)');
      }
    } catch (txError) {
      console.error('⚠️ [RAZORPAY] Failed to update/create transaction record:', txError.message);
    }

    console.log('✅ [RAZORPAY] Payment verified successfully, Stock Updated:', stockUpdated);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and order updated',
      paymentId: razorpay_payment_id,
      orderId: orderId
    });

  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

exports.primaryAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findById(addressId);

    if (!address) return res.status(404).json({ message: 'Address not found' });

    await Address.updateMany({ userId: address.userId }, { isPrimary: false });

    address.isPrimary = true;
    await address.save();

    res.json({ message: 'Primary address updated successfully', address });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}

// Cancel payment for pending orders
exports.cancelPayment = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.user;

    console.log('🚫 [CANCEL] Cancelling payment/order:', orderId, 'Reason:', reason);

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to user
    if (order.UserId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }

    // Find payment record
    const payment = await Payment.findOne({ OrderId: orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Only allow cancellation of pending/failed payments
    if (payment.status === "Successful") {
      return res.status(400).json({
        message: "Cannot cancel a successful payment. Please request a refund instead."
      });
    }

    // Only return stock if currently Pending (since we deduct on Pending)
    await restoreStockIfPending(order);

    // Update payment status to Failed
    payment.status = "Failed";
    await payment.save();
    console.log('✅ [CANCEL] Payment status updated to Failed');

    // Update order items status to Cancelled
    order.items = order.items.map((item) => ({
      ...item.toObject?.() || item,
      Status: "Cancelled",
      reason: reason || "Payment cancelled by user",
    }));
    order.paymentStatus = "Failed"; // Ensure payment status is no longer pending
    await order.save();
    console.log('✅ [CANCEL] Order items status updated to Cancelled');

    // Create transaction record for cancellation ONLY if payment method was wallet/card
    if (payment.method === "card") {
      const wallet = await Wallet.findOne({ userId });
      if (wallet) {
        const transaction = new Transaction({
          walletId: wallet._id,
          userId,
          type: "Debit",
          amount: order.TotalAmount,
          description: `Cancelled payment for order ${orderId} - ${reason || "User cancelled"}`,
          status: "Failed",
          orderId: orderId,
          paymentMethod: payment.method,
        });
        await transaction.save();
      }
    }

    return res.status(200).json({
      message: "Payment cancelled successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("❌ [CANCEL] Error cancelling payment:", error);
    res.status(500).json({
      message: error.message || "An error occurred while cancelling payment.",
    });
  }
};

// Retry payment for failed orders
exports.retryPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod: rawPaymentMethod } = req.body;
    const userId = req.user;

    // Normalize logic comparisons
    const paymentMethod = rawPaymentMethod?.toLowerCase();

    console.log('🔄 [RETRY] Retrying payment for order:', orderId, 'Method:', paymentMethod);

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order belongs to user
    if (order.UserId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }

    // Find existing payment record
    // Find existing payment record
    let existingPayment = await Payment.findOne({ OrderId: orderId });

    // If no payment record exists (edge case or data issue), create one
    if (!existingPayment) {
      console.log('⚠️ [RETRY] Payment record missing for order:', orderId, 'Creating new one.');
      existingPayment = await Payment.create({
        paymentId: `RETRY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        OrderId: order._id,
        userId: userId,
        amount: order.TotalAmount,
        currency: "INR",
        status: "Pending", // Default to pending
        method: paymentMethod || "Unknown",
        email: req.user.email || "user@example.com" // Assuming req.user has email or fallback
      });
    }

    // Check if payment is already successful
    if (existingPayment.status === "Successful") {
      return res.status(400).json({ message: "Payment already completed for this order" });
    }

    // Process retry payment based on method
    if (paymentMethod === "card" || paymentMethod === "wallet") {
      const wallet = await Wallet.findOne({ userId });

      if (!wallet) {
        return res.status(404).json({
          message: "Wallet not found. Please create a wallet first or choose a different payment method."
        });
      }

      if (wallet.balance < order.TotalAmount) {
        return res.status(400).json({
          message: `Insufficient wallet balance. Available: ₹${wallet.balance.toFixed(2)}, Required: ₹${order.TotalAmount.toFixed(2)}`
        });
      }

      // Deduct amount from wallet
      wallet.balance -= order.TotalAmount;
      await wallet.save();

      // Create successful transaction record
      const transaction = new Transaction({
        walletId: wallet._id,
        userId,
        type: "Debit",
        amount: order.TotalAmount,
        description: `Retry payment for order ${orderId}`,
        transactionType: "Purchase",
        status: "Successful",
        orderId: orderId,
        paymentMethod: "wallet", // ENUM is lowercase 'wallet'
      });
      await transaction.save();

      // Update order payment method
      order.paymentMethod = paymentMethod === 'wallet' ? 'Wallet' : 'Card';
      await order.save();

      // Update payment record
      existingPayment.status = "Successful";
      existingPayment.transactionId = transaction._id;
      existingPayment.method = paymentMethod;
      existingPayment.paymentDate = new Date();
      await existingPayment.save();

      // Update order items status
      const needsStockRededuction = order.items.some(item =>
        item.Status === 'Cancelled' || item.Status === 'Payment Failed'
      ) || order.orderStatus === 'Cancelled';

      if (needsStockRededuction) {
        await ensureStockAndDeductForOrder(order.items);
        if (order.CouponId) {
          await consumeCouponUsage(order.CouponId, order.UserId);
        }
      }

      order.items = order.items.map(item => ({
        ...item.toObject?.() || item,
        Status: "Confirmed",
      }));

      order.paymentStatus = 'Completed';
      order.orderStatus = 'Confirmed';
      await order.save();

      // Clear cart items matching this order
      await removeOrderedItemsFromCart(userId, order.items);

      return res.status(200).json({
        message: "Payment successful!",
        orderId: order._id,
        paymentId: existingPayment._id,
        paymentStatus: "Successful",
      });
    } else if (paymentMethod === "razorpay") {
      // Create Razorpay Order
      const options = {
        amount: Math.round(order.TotalAmount * 100),
        currency: "INR",
        receipt: `receipt_order_${order._id}`,
        notes: {
          order_id: order._id.toString()
        }
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Update payment method in order to match Enum
      order.paymentMethod = "Razorpay";
      await order.save();

      return res.status(200).json({
        message: "Proceed with Razorpay payment",
        orderId: order._id,
        amount: order.TotalAmount,
        paymentId: existingPayment._id,
        razorpayOrderId: razorpayOrder.id,
        key: process.env.RAZORPAY_KEY_ID
      });
    } else if (paymentMethod === "cod") {
      // Update to COD
      existingPayment.status = "Pending";
      existingPayment.method = "COD"; // Uppercase consistency
      await existingPayment.save();

      // Update order payment method
      order.paymentMethod = "COD"; // Enforce Enum for Order
      // Order saved in next block with items update

      // Update order items status
      const needsStockRededuction = order.items.some(item =>
        item.Status === 'Cancelled' || item.Status === 'Payment Failed'
      ) || order.orderStatus === 'Cancelled';

      if (needsStockRededuction) {
        await ensureStockAndDeductForOrder(order.items);
        if (order.CouponId) {
          await consumeCouponUsage(order.CouponId, order.UserId);
        }
      }

      order.items = order.items.map(item => ({
        ...item.toObject?.() || item,
        Status: "Confirmed",
      }));

      order.orderStatus = 'Confirmed'; // Explicitly set to Confirmed for COD
      await order.save();
      console.log('✅ [RETRY] Order items updated to Confirmed (COD)');

      return res.status(200).json({
        message: "Order updated to Cash on Delivery",
        orderId: order._id,
        paymentId: existingPayment._id,
        paymentStatus: "Pending",
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }
  } catch (error) {
    console.error("❌ [RETRY] Error retrying payment:", error);
    res.status(500).json({
      message: error.message || "An error occurred while retrying payment.",
    });
  }
};



// Mark payment as failed (for Razorpay cancellation/failure)
exports.markPaymentFailed = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.user;

    console.log('❌ [FAILED] Marking payment as failed for order:', orderId, 'Reason:', reason);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.UserId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }

    const payment = await Payment.findOne({ OrderId: orderId });
    if (payment) {
      payment.status = "Failed";
      await payment.save();
    }

    await restoreStockIfPending(order);

    if (order.items?.length) {
      order.items.forEach((item) => {
        item.Status = "Payment Failed";
      });
      order.paymentStatus = "Failed"; // Explicitly fail order pay status
      order.markModified("items");
      await order.save();
      console.log('✅ [FAILED] Order items marked as Payment Failed');
    }

    return res.status(200).json({
      message: "Payment marked as failed",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error marking payment as failed:", error);
    res.status(500).json({
      message: error.message || "An error occurred while marking payment as failed.",
    });
  }
};
