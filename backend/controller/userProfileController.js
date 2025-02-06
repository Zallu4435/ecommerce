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
const { sendMail } = require("../utils/sendMail")


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
  if (!product) {
    throw new Error("Product not found.");
  }
  if (product.stockQuantity < quantity) {
    throw new Error("Not enough stock available.");
  }
  product.stockQuantity -= quantity;
  await product.save();
  return {
    ProductId: productId,
    Price: product.originalPrice,
    Quantity: quantity,
    Status: "Order Placed",
  };
};

const handleCartOrder = async (userId, cartItems) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found for this user.");
  }

  const items = [];
  for (let item of cartItems) {
    const { cartItemId, quantity, originalPrice } = item;
    const cartItem = cart.items.find((ci) => ci._id.toString() === cartItemId);
    if (!cartItem) {
      throw new Error(`Cart item ${cartItemId} not found.`);
    }

    const product = await Product.findById(cartItem.productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    if (product.stockQuantity < quantity) {
      throw new Error(`Not enough stock for ${product.productName}.`);
    }
    product.stockQuantity -= quantity;
    await product.save();

    items.push({
      ProductId: cartItem.productId,
      Price: originalPrice,
      Quantity: quantity,
      Color: cartItem.color,
      Size: cartItem.size,
      Status: "Order Placed",
    });
  }
  return items;
};

const validateAndApplyCoupon = async (couponCode, userId) => {
  if (!couponCode) return null;

  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon) {
    throw new Error("Invalid coupon code.");
  }

  if (coupon.appliedUsers.includes(userId)) {
    throw new Error("Coupon already applied by this user.");
  }

  coupon.appliedUsers.push(userId);
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
  couponId
) => {
  const orderRecord = new Order({
    UserId: userId,
    items,
    Subtotal: subtotal,
    CouponDiscount: couponDiscount,
    TotalAmount: totalAmount,
    AddressId: addressId,
    CouponId: couponId,
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
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      throw new Error("User does not have a wallet.");
    }

    if (wallet.balance >= totalAmount) {
      wallet.balance -= totalAmount;
      await wallet.save();

      const transaction = new Transaction({
        walletId: wallet._id,
        userId,
        type: "Debit",
        amount: totalAmount,
        description: `Payment for order ${orderId}`,
        status: "Successful",
      });
      await transaction.save();

      transactionId = transaction._id;
      paymentStatus = "Successful";
    } else {
      const ba = await Order.findById({ _id: orderId });
      ba?.items?.map((val) => (val.Status = "Failed"));
      await ba.save();
      throw new Error("Insufficient balance in the wallet.");
    }
  } else if (paymentMethod === "razorpay") {
    paymentStatus = "Successful";
    transactionId = razorpayTransactionId;
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

    if (order?.productId) {
      items.push(await handleSingleProductOrder(order?.productId, 1));
    } else if (order && order.cartItems && order.cartItems.length > 0) {
      items = await handleCartOrder(userId, order.cartItems);
    } else {
      return res
        .status(400)
        .json({ message: "Either productId or cartItems are required." });
    }

    const coupon = await validateAndApplyCoupon(couponCode, userId);
    const couponDiscount = coupon ? (order.total * coupon.discount) / 100 : 0;

    const addressReference = await handleAddress(address, userId);

    const totalAmount = order.total - couponDiscount;

    const savedOrder = await createOrderRecord(
      userId,
      items,
      order.total,
      couponDiscount,
      totalAmount,
      addressReference,
      coupon?._id
    );

    const paymentRecord = await createPaymentRecord(
      userId,
      savedOrder._id,
      payment.paymentMethod,
      totalAmount
    );

    res.status(200).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      paymentId: paymentRecord._id,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({
      message: error.message || "An error occurred while processing the order.",
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

