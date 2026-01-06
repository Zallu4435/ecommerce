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
const { sendMail } = require("../utils/email")


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
    const { country, state, city, zipCode, street } = req.body;

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
    const { _id, country, state, city, zipCode, street } = req.body;

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
    const { productId, quantity } = req.query;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "ProductId and quantity are required." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.stockQuantity >= quantity) {
      return res.status(200).json({ isStockAvailable: true });
    } else {
      return res.status(200).json({ isStockAvailable: false });
    }
  } catch (error) {
    console.error("Error checking stock:", error);
    return res.status(500).json({ message: "Error checking product stock." });
  }
};

const handleSingleProductOrder = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found.");

  // Use correct stock field (totalStock) and fallback
  if ((product.totalStock || 0) < quantity) {
    throw new Error("Not enough stock available.");
  }

  // Don't decrease stock here - only validate
  let price = product.baseOfferPrice > 0 ? product.baseOfferPrice : product.basePrice;

  return {
    ProductId: productId,
    Price: price,
    Quantity: quantity,
    Status: "Order Placed",
    itemTotal: price * quantity,
    productName: product.productName,
    productImage: product.image
  };
};

// Decrease stock quantity after successful payment
const decreaseStockForOrder = async (orderItems) => {
  for (let item of orderItems) {
    const product = await Product.findById(item.ProductId);
    if (product) {
      // Decrease Total Stock
      if (product.totalStock !== undefined) {
        product.totalStock -= item.Quantity;
      } else {
        product.totalStock = (product.totalStock || 0) - item.Quantity;
      }

      // Decrease Variant Stock if variant details exist
      if (item.color && item.size) {
        const variant = await ProductVariant.findOne({
          productId: product._id,
          color: item.color.toLowerCase(),
          size: item.size.toUpperCase()
        });

        if (variant) {
          variant.stockQuantity -= item.Quantity;
          await variant.save();
        }
      }
      await product.save();
    }
  }
};

const handleCartOrder = async (userId, cartItems) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found for this user.");

  const items = [];
  for (let item of cartItems) {
    const cartItem = cart.items.find((ci) => ci._id.toString() === item.cartItemId);

    if (!cartItem) throw new Error(`Cart item ${item.cartItemId} not found.`);

    const product = await Product.findById(cartItem.productId);
    if (!product) throw new Error("Product not found.");

    if (product.status !== 'active') {
      throw new Error(`Product ${product.productName} is currently unavailable`);
    }

    let price = product.baseOfferPrice > 0 ? product.baseOfferPrice : product.basePrice;

    if (cartItem.color && cartItem.size) {
      const variant = await ProductVariant.findOne({
        productId: product._id,
        color: cartItem.color.toLowerCase(),
        size: cartItem.size.toUpperCase()
      });

      if (!variant) throw new Error(`Variant ${cartItem.color}/${cartItem.size} not found`);

      if (variant.stockQuantity < item.quantity) {
        throw new Error(`Not enough stock for ${product.productName} (${cartItem.color}/${cartItem.size})`);
      }

      if (variant.offerPrice > 0) price = variant.offerPrice;
      else if (variant.price > 0) price = variant.price;

    } else {
      if ((product.totalStock || 0) < item.quantity) {
        throw new Error(`Not enough stock for ${product.productName}.`);
      }
    }

    items.push({
      ProductId: cartItem.productId,
      Price: price,
      Quantity: item.quantity,
      color: cartItem.color,
      size: cartItem.size,
      Status: "Order Placed",
      productName: product.productName,
      productImage: product.image,
      itemTotal: price * item.quantity
    });
  }
  return { items, cart };
};

const removeItemsFromCart = async (cart, cartItems) => {
  const cartItemIds = cartItems.map(item => item.cartItemId);
  cart.items = cart.items.filter(item => !cartItemIds.includes(item._id.toString()));
  await cart.save();
};

const validateAndApplyCoupon = async (couponCode, userId, purchaseAmount = 0, productIds = []) => {
  if (!couponCode) return null;

  const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
  if (!coupon) {
    throw new Error("Invalid coupon code.");
  }

  // Check if coupon has expired
  const currentDate = new Date();
  if (currentDate > coupon.expiry) {
    throw new Error("This coupon has expired.");
  }

  // Check if coupon usage limit has been reached
  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("This coupon has reached its usage limit.");
  }

  // Check per-user usage limit
  const userUsageCount = coupon.appliedUsers.filter(id => id.toString() === userId.toString()).length;
  if (userUsageCount >= coupon.perUserLimit) {
    throw new Error(`You have already used this coupon ${coupon.perUserLimit} time(s). Maximum usage limit reached.`);
  }

  // Check if user is eligible (if applicable users list is not empty)
  if (coupon.applicableUsers.length > 0) {
    const isUserEligible = coupon.applicableUsers.some(id => id.toString() === userId.toString());
    if (!isUserEligible) {
      throw new Error("This coupon is not applicable for your account.");
    }
  }

  // Check minimum purchase amount
  if (purchaseAmount < coupon.minAmount) {
    throw new Error(`Minimum purchase amount of ₹${coupon.minAmount} is required to use this coupon.`);
  }

  // Check product applicability (if applicable products list is not empty)
  if (coupon.applicableProducts.length > 0 && productIds.length > 0) {
    const hasApplicableProduct = productIds.some(pid =>
      coupon.applicableProducts.some(apid => apid.toString() === pid.toString())
    );
    if (!hasApplicableProduct) {
      throw new Error("This coupon is not applicable for the selected products.");
    }
  }

  // All validations passed - apply the coupon
  coupon.appliedUsers.push(userId);
  coupon.usageCount += 1;
  await coupon.save();

  return coupon;
};

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
  shippingAddress // New parameter
) => {
  const orderRecord = new Order({
    UserId: userId,
    items,
    Subtotal: subtotal,
    CouponDiscount: couponDiscount,
    TotalAmount: totalAmount,
    AddressId: addressId,
    CouponId: couponId,
    shippingAddress: shippingAddress // Embed Snapshot
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

  if (paymentMethod === "card") {
    let wallet = await Wallet.findOne({ userId });

    // Auto-create wallet if it doesn't exist
    if (!wallet) {
      wallet = new Wallet({
        userId,
        balance: 0,
        status: "Active",
      });
      await wallet.save();
    }

    if (wallet.balance < totalAmount) {
      // Mark order items as failed but keep the order
      const existingOrder = await Order.findById(orderId);
      if (existingOrder?.items?.length) {
        existingOrder.items = existingOrder.items.map((item) => ({
          ...item.toObject?.() || item,
          Status: "Payment Failed",
        }));
        await existingOrder.save();
      }

      // Create failed transaction record
      const failedTransaction = new Transaction({
        walletId: wallet._id,
        userId,
        type: "Debit",
        amount: totalAmount,
        description: `Failed payment for order ${orderId} - Insufficient balance`,
        status: "Failed",
        orderId: orderId,
        paymentMethod: "card",
      });
      await failedTransaction.save();

      paymentStatus = "Failed";
      transactionId = failedTransaction._id;

      throw new Error(`Insufficient wallet balance. Available: ₹${wallet.balance.toFixed(2)}, Required: ₹${totalAmount.toFixed(2)}`);
    }

    // Deduct amount from wallet
    wallet.balance -= totalAmount;
    await wallet.save();

    // Create successful transaction record
    const transaction = new Transaction({
      walletId: wallet._id,
      userId,
      type: "Debit",
      amount: totalAmount,
      description: `Payment for order ${orderId}`,
      status: "Successful",
      orderId: orderId,
      paymentMethod: "card",
    });
    await transaction.save();

    transactionId = transaction._id;
    paymentStatus = "Successful";
  } else if (paymentMethod === "razorpay") {
    paymentStatus = "Pending"; // Razorpay payment is handled separately
    transactionId = null; // Transaction ID will be set after verification
  } else if (paymentMethod === "cod") {
    paymentStatus = "Pending";
  } else {
    throw new Error("Invalid payment method.");
  }

  const paymentRecord = new Payment({
    userId,
    OrderId: orderId,
    status: paymentStatus,
    method: paymentMethod,
    amount: totalAmount,
    transactionId: transactionId,
  });

  return await paymentRecord.save();
};

exports.processPayment = async (req, res) => {
  try {
    const { address, order, couponCode, payment } = req.body;
    const userId = req.user;

    let items = [];
    let cart = null;
    let isCartOrder = false;

    if (order?.productId) {
      items.push(await handleSingleProductOrder(order?.productId, 1));
    } else if (order && order.cartItems && order.cartItems.length > 0) {
      const cartResult = await handleCartOrder(userId, order.cartItems);
      items = cartResult.items;
      cart = cartResult.cart;
      isCartOrder = true;
    } else {
      return res
        .status(400)
        .json({ message: "Either productId or cartItems are required." });
    }

    // Extract product IDs from items (Fix: items have ProductId Capitalized)
    const productIds = items.map(item => item.ProductId);

    const coupon = await validateAndApplyCoupon(couponCode, userId, order.total, productIds);

    // Calculate discount with max cap
    let couponDiscount = 0;
    if (coupon) {
      const calculatedDiscount = (order.total * coupon.discount) / 100;
      couponDiscount = Math.min(calculatedDiscount, coupon.maxAmount);
    }

    const addressReference = await handleAddress(address, userId);

    // Create Address Snapshot
    const addressData = await Address.findById(addressReference);
    const userData = await User.findById(userId);

    const shippingAddressSnapshot = {
      name: userData ? userData.name : "Unknown",
      phone: userData ? (userData.mobile || userData.phone || "") : "",
      addressLine1: addressData.street,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      pincode: addressData.zipCode
    };

    const totalAmount = order.total - couponDiscount;

    const savedOrder = await createOrderRecord(
      userId,
      items,
      order.total,
      couponDiscount,
      totalAmount,
      addressReference,
      coupon?._id,
      shippingAddressSnapshot
    );

    const paymentRecord = await createPaymentRecord(
      userId,
      savedOrder._id,
      payment.paymentMethod,
      totalAmount
    );

    // Only decrease stock and remove cart items if payment is successful
    if (paymentRecord.status === "Successful") {
      // Decrease product stock quantities
      await decreaseStockForOrder(items);

      // Remove items from cart if it was a cart order
      if (isCartOrder && cart) {
        await removeItemsFromCart(cart, order.cartItems);
      }
    }

    res.status(200).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      paymentId: paymentRecord._id,
      paymentStatus: paymentRecord.status,
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

    // Verify the payment signature
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
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

    // Decrease Stock for the now-successful order
    if (order.items && order.items.length > 0) {
      await decreaseStockForOrder(order.items);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
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

    // Update payment status to Failed
    payment.status = "Failed";
    await payment.save();

    // Update order items status to Cancelled
    order.items = order.items.map((item) => ({
      ...item.toObject?.() || item,
      Status: "Cancelled",
      reason: reason || "Payment cancelled by user",
    }));
    await order.save();

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
    console.error("Error cancelling payment:", error);
    res.status(500).json({
      message: error.message || "An error occurred while cancelling payment.",
    });
  }
};

// Retry payment for failed orders
exports.retryPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const userId = req.user;

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
    const existingPayment = await Payment.findOne({ OrderId: orderId });
    if (!existingPayment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Check if payment is already successful
    if (existingPayment.status === "Successful") {
      return res.status(400).json({ message: "Payment already completed for this order" });
    }

    // Process retry payment based on method
    if (paymentMethod === "card") {
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
        status: "Successful",
        orderId: orderId,
        paymentMethod: "card",
      });
      await transaction.save();

      // Update payment record
      existingPayment.status = "Successful";
      existingPayment.transactionId = transaction._id;
      existingPayment.method = paymentMethod;
      existingPayment.paymentDate = new Date();
      await existingPayment.save();

      // Update order items status
      order.items = order.items.map((item) => ({
        ...item.toObject?.() || item,
        Status: "Pending",
      }));
      await order.save();

      return res.status(200).json({
        message: "Payment successful!",
        orderId: order._id,
        paymentId: existingPayment._id,
        paymentStatus: "Successful",
      });
    } else if (paymentMethod === "razorpay") {
      // For Razorpay, just return order details for frontend to initiate payment
      return res.status(200).json({
        message: "Proceed with Razorpay payment",
        orderId: order._id,
        amount: order.TotalAmount,
        paymentId: existingPayment._id,
      });
    } else if (paymentMethod === "cod") {
      // Update to COD
      existingPayment.status = "Pending";
      existingPayment.method = "cod";
      await existingPayment.save();

      // Update order items status
      order.items = order.items.map((item) => ({
        ...item.toObject?.() || item,
        Status: "Pending",
      }));
      await order.save();

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
    console.error("Error retrying payment:", error);
    res.status(500).json({
      message: error.message || "An error occurred while retrying payment.",
    });
  }
};

