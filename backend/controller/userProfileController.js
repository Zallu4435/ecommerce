const Address = require('../model/Address');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../model/User');  
const Order = require('../model/Orders');
const Coupon = require('../model/Coupon');
const Product = require('../model/Products')
const Cart = require('../model/Cart')
const Payment = require('../model/Payment')
const mongoose = require("mongoose");
const Wallet = require("../model/Wallet"); // Import the Wallet model
const Transaction = require("../model/WalletTransaction"); // Import the Transaction model
const { ObjectId } = mongoose.Types;

// import { processPaymentGateway } from '../services/paymentGateway';

// Add Address

exports.getAddress = async (req, res) => {
  // console.log("Reached inside the address route for fetching addresses");

  try {
    // Find all addresses
    const addresses = await Address.find();

    // Return the addresses (empty array if no addresses exist)
    // console.log(addresses, "address from databse ")
    res.status(200).json(addresses);
  } catch (error) {
    // Handle error, send a meaningful message
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Failed to fetch addresses', error: error.message });
  }
};


exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.user; // Assuming userId is passed in `req.user`
    const { country, state, city, zipCode, street } = req.body;

    console.log(userId, "userId");

    // Check if an address with the same details already exists for the user
    const existingAddress = await Address.findOne({
      street,
    });

    if (existingAddress) {
      return next(
        new ErrorHandler("Address with these details already exists", 400)
      );
    }

    // Create a new address if no duplicate is found
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

  
  // Edit Address
  exports.editAddress = async (req, res, next) => {
    try {
      console.log("Reached for update address");
      const userId = req.user; // Assuming userId is passed in `req.user`
      const { _id, country, state, city, zipCode, street } = req.body;
  
      console.log(_id, country, state, city, zipCode, street, "from the user");
      console.log(userId, "UserId");
  
      // Find the address to be edited
      const address = await Address.findOne({ _id, userId });
      console.log(address, "found address");
      if (!address) {
        return next(new ErrorHandler("Address not found", 404));
      }
  
      // Check if an address with the same details already exists
      const existingAddress = await Address.findOne({
        userId,
        street,
        _id: { $ne: _id }, // Exclude the current address being edited
      });
  
      if (existingAddress) {
        return next(new ErrorHandler("Address with these details already exists", 400));
      }
  
      // Update address fields if the new values are provided
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
  
  // Remove Address
  exports.removeAddress = async (req, res, next) => {
    const userId = req.user;
    const  { id }  = req.params;
    console.log(userId, "id from the user ")
    console.log(id, "params with")
  
    const address = await Address.findOne({_id : id, userId});
    console.log(address, "finding address")
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
    const userId = req.user;  // Assuming `req.user` contains the authenticated user ID
    const { currentPassword, newPassword } = req.body;

    // 1. Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    // 2. Check if the current password is correct
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return next(new ErrorHandler('Current password is incorrect', 400));
    }

    // 5. Update the user's password in the database
    user.password = newPassword;
    await user.save();

    // 6. Send response
    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error(error);
    return next(new ErrorHandler('Failed to change password', 500));
  }
};



exports.checkoutAddress = async (req, res) => {
  console.log("reached inside the checkouoy")
  try {
    const addressWithUserDetails = await Address.aggregate([
      {
        $lookup: {
          from: 'users', // The name of the User collection in the database
          localField: 'userId', // The field in the Address collection
          foreignField: '_id', // The field in the User collection
          as: 'userDetails', // The resulting array field for user details
        },
      },
      {
        $unwind: '$userDetails', // Flatten the userDetails array
      },
      {
        $project: {
          _id: 1, // Include Address ID
          country: 1,
          state: 1,
          city: 1,
          zipCode: 1,
          street: 1,
          username: '$userDetails.username', // Include username from userDetails
          phone: '$userDetails.phone', // Include phone from userDetails
        },
      },
    ]);

    // console.log(addressWithUserDetails, "addressWithUserDetails")
    res.status(200).json(addressWithUserDetails);
  } catch (error) {
    console.error('Error fetching address and user details:', error);
    res.status(500).json({ message: 'Failed to fetch address and user details', error: error.message });
  }
};



// Assuming we have a payment gateway function to handle payment
// exports.processPayment = async (req, res) => {

//   try {
//     const {  address, order, couponCode, newAddress, payment, quantity } = req.body;
//     const userId = req.user;

//     console.log(order?.productId, "address from from ")
   

//     let items = [];

//     if (order?.productId) {
//       // Direct single product order
//       const product = await Product.findById(order?.productId);
//       if (!product) {
//         return res.status(400).json({ message: "Product not found." });
//       }
//       items.push({
//         ProductId: order?.productId,
//         Price: product.price,
//         Quantity: quantity, 
//       });
//     } else if (order && order.cartItems && order.cartItems.length > 0) {
//       // Cart-based order
//       const cart = await Cart.findOne({ userId });
//       if (!cart) {
//         return res.status(400).json({ message: "Cart not found for this user." });
//       }
 
//       for (let item of order.cartItems) {
//         const { cartItemId, quantity, originalPrice } = item;
//         const cartItem = cart.items.find(ci => ci._id.toString() === cartItemId);
//         if (!cartItem) {
//           return res.status(400).json({ message: `Cart item ${cartItemId} not found.` });
//         }

//         items.push({
//           ProductId: cartItem.productId,
//           Price: originalPrice,  
//           Quantity: quantity,
//           Color: cartItem.color,
//           Size: cartItem.size
//         });
//       }
//     } else {
//       return res.status(400).json({ message: "Either productId or cartItems are required." });
//     }

//     // Step 3: Validate Coupon
//     let coupon = null;
//     if (couponCode) {
//       coupon = await Coupon.findOne({ code: couponCode });
//       if (!coupon) {
//         return res.status(400).json({ message: "Invalid coupon code." });
//       }
//     }
//     // Step 4: Create the Order
//     const orderStatus = payment?.paymentMethod === "cod" ? "Order Placed" : "Confirmed";
//     const orderRecord = new Order({
//       UserId: userId,
//       items: items,
//       TotalAmount: order?.total,
//       Address: address,
//       Status: orderStatus,
//       CouponId: coupon?._id || null,
//     });

//     await orderRecord.save();

//     // console.log(orderRecord, "orderRecored ")
//     // Step 5: Handle Payment
//     let paymentRecord = null;

//     if (payment?.paymentMethod === "cod") {
//       paymentRecord = new Payment({
//         userId: userId,
//         OrderId: orderRecord._id,
//         status: "Pending",
//         method: payment?.paymentMethod,
//         amount: order?.total,
//         transactionId: null,
//       });

//       await paymentRecord.save();
//       console.log("COD Payment recorded:", paymentRecord);
//     }
//     // } else {
//     //   const paymentResult = await processPaymentGateway({
//     //     amount: calculatedTotal,
//     //     orderId: orderRecord._id,
//     //   });

//     //   if (!paymentResult.success) {
//     //     // If payment fails, update order status and return error
//     //     orderRecord.Status = "Failed";
//     //     await orderRecord.save();
//     //     return res.status(500).json({ message: "Payment failed.", orderId: orderRecord._id });
//     //   }

//     //   paymentRecord = new Payment({
//     //     UserId: userId,
//     //     OrderId: orderRecord._id,
//     //     Status: "Success",
//     //     Method: paymentMethod,
//     //     Amount: calculatedTotal,
//     //     TransactionId: paymentResult.transactionId,
//     //   });

//     //   await paymentRecord.save();
//     //   console.log("Online Payment recorded:", paymentRecord);
//     // }

//     // Link payment to the order
//     // orderRecord.PaymentId = paymentRecord._id;
//     // await orderRecord.save();
//     // console.log(object)
//     // Step 6: Respond to Client


//     res.status(200).json({
//       message: "Order placed successfully",
//       orderId: orderRecord._id,
//       paymentId: paymentRecord?._id || null,
//       status: orderStatus,
//     });
//   } catch (error) {
//     console.error("Error processing order:", error);
//     res.status(500).json({ message: "An error occurred while processing the order." });
//   }
// };

exports.checkProductStock = async (req, res) => {

  console.log("reached inside the checkproduct ")
  try {
    const { productId, quantity } = req.query; // Get productId and quantity from query params

    if (!productId || !quantity) {
      return res.status(400).json({ message: "ProductId and quantity are required." });
    }

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if the quantity in stock is enough
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

// exports.processPayment = async (req, res) => {
//   try {
//     const { address, order, couponCode, payment, quantity, productId } = req.body;
//     const userId = req.user;

//     // console.log(order);
//     let items = [];

//     if (productId) {
//       // Direct single product order
//       const product = await Product.findById(productId);

//       if (!product) {
//         return res.status(400).json({ message: "Product not found." });
//       }
      
//       // Decrease stock quantity based on the ordered quantity
//       if (product.stockQuantity < quantity) {
//         return res.status(400).json({ message: "Not enough stock available." });
//       }

//       product.stockQuantity -= order.cartItems[0]?.quantity;
//       await product.save(); // Update the product's stock quantity

//       items.push({
//         ProductId: productId,
//         Price: product.price,
//         Quantity: order.cartItems[0]?.quantity,
//         Status: "Order Placed", // Status for this item
//       });

//     } else if (order && order.cartItems && order.cartItems.length > 0) {
//       // Cart-based order
//       const cart = await Cart.findOne({ userId });
//       if (!cart) {
//         return res.status(400).json({ message: "Cart not found for this user." });
//       }

//       for (let item of order.cartItems) {
//         const { cartItemId, quantity, originalPrice } = item;
//         const cartItem = cart.items.find(ci => ci._id.toString() === cartItemId);
//         if (!cartItem) {
//           return res.status(400).json({ message: `Cart item ${cartItemId} not found.` });
//         }

//         const product = await Product.findById(cartItem.productId);
//         if (!product) {
//           return res.status(400).json({ message: "Product not found." });
//         }

//         // Decrease stock quantity based on the ordered quantity
//         if (product.stockQuantity < quantity) {
//           return res.status(400).json({ message: `Not enough stock for ${product.productName}.` });
//         }
//         product.stockQuantity -= quantity;
//         await product.save(); // Update the product's stock quantity

//         items.push({
//           ProductId: cartItem.productId,
//           Price: originalPrice,
//           Quantity: quantity,
//           Color: cartItem.color,
//           Size: cartItem.size,
//           Status: "Order Placed", // Status for this item
//         });
//       }
//     } else {
//       return res.status(400).json({ message: "Either productId or cartItems are required." });
//     }

//     // Step 3: Validate Coupon
//     let coupon = null;
//     if (couponCode) {
//       coupon = await Coupon.findOne({ code: couponCode });
//       if (!coupon) {
//         return res.status(400).json({ message: "Invalid coupon code." });
//       }
//     }

//     // Step 4: Handle Address
//     let addressReference = null;
    
//     // Check if the address already exists for the user
//     // console.log(address, "address from address")
//     const existingAddress = await Address.findOne({ _id: address._id, userId });
//     // console.log(existingAddress, "existing address")
    
//     if (existingAddress) {
//       addressReference = existingAddress._id; // Use the existing address
//     } else {
//       // Create a new address if not found
//       const newAddressRecord = new Address({
//         userId: userId,
//         ...address, // Use the address data passed from the request body
//       });

//       const savedAddress = await newAddressRecord.save();
//       addressReference = savedAddress._id; // Use the newly created address's _id
//     }
//     // console.log(addressReference, "addressReference")

  
//     // Step 5: Create the Order
//     const orderRecord = new Order({
//       UserId: userId,
//       items: items,
//       TotalAmount: order?.total,
//       AddressId: addressReference, // Reference to the address document
//       CouponId: coupon?._id || null,
//     });

//     console.log(orderRecord, "orderRecord")
//     await orderRecord.save();

//     // Step 6: Handle Payment
//     const paymentRecord = new Payment({
//       userId: userId,
//        OrderId: orderRecord._id,
//       status: "Order Placed",
//       method: payment?.paymentMethod,
//       amount: order?.total,
//       transactionId: null,
//     });

//     await paymentRecord.save();
//     console.log("Payment recorded:", paymentRecord);

//     // Step 7: Respond to Client
//     res.status(200).json({
//       message: "Order placed successfully",
//       orderId: orderRecord._id,
//       paymentId: paymentRecord._id,
//     });
//   } catch (error) {
//     console.error("Error processing order:", error);
//     res.status(500).json({ message: "An error occurred while processing the order." });
//   }
// };


// exports.processPayment = async (req, res) => {
//   try {
//     const { address, order, couponCode, payment, productId, quantity } = req.body;
//     const userId = req.user;

//     let items = [];

//     // Step 1: Handle the Product or Cart Items
//     if (productId) {
//       // Single product order
//       const product = await Product.findById(productId);

//       if (!product) {
//         return res.status(400).json({ message: "Product not found." });
//       }

//       // Decrease stock quantity based on the ordered quantity
//       if (product.stockQuantity < quantity) {
//         return res.status(400).json({ message: "Not enough stock available." });
//       }

//       product.stockQuantity -= order.cartItems[0]?.quantity;
//       await product.save(); // Update the product's stock quantity

//       items.push({
//         ProductId: productId,
//         Price: product.price,
//         Quantity: order.cartItems[0]?.quantity,
//         Status: "Order Placed", // Status for this item
//       });

//     } else if (order && order.cartItems && order.cartItems.length > 0) {
//       // Cart-based order
//       const cart = await Cart.findOne({ userId });
//       if (!cart) {
//         return res.status(400).json({ message: "Cart not found for this user." });
//       }

//       for (let item of order.cartItems) {
//         const { cartItemId, quantity, originalPrice } = item;
//         const cartItem = cart.items.find(ci => ci._id.toString() === cartItemId);
//         if (!cartItem) {
//           return res.status(400).json({ message: `Cart item ${cartItemId} not found.` });
//         }

//         const product = await Product.findById(cartItem.productId);
//         if (!product) {
//           return res.status(400).json({ message: "Product not found." });
//         }

//         // Decrease stock quantity based on the ordered quantity
//         if (product.stockQuantity < quantity) {
//           return res.status(400).json({ message: `Not enough stock for ${product.productName}.` });
//         }
//         product.stockQuantity -= quantity;
//         await product.save(); // Update the product's stock quantity

//         items.push({
//           ProductId: cartItem.productId,
//           Price: originalPrice,
//           Quantity: quantity,
//           Color: cartItem.color,
//           Size: cartItem.size,
//           Status: "Order Placed", // Status for this item
//         });
//       }
//     } else {
//       return res.status(400).json({ message: "Either productId or cartItems are required." });
//     }

//     // Step 2: Validate and Apply Coupon
//     let coupon = null;
//     if (couponCode) {
//       coupon = await Coupon.findOne({ couponCode });
//       if (!coupon) {
//         return res.status(400).json({ message: "Invalid coupon code." });
//       }

//       // Ensure coupon is not applied by the same user again
//       if (coupon.appliedUsers.includes(userId)) {
//         return res.status(400).json({ message: "Coupon already applied by this user." });
//       }

//       // Add userId to the appliedUsers array of the coupon
//       coupon.appliedUsers.push(userId);
//       await coupon.save();
//     }

//     // Step 3: Handle Address Reference
//     let addressReference = null;

//     if (address._id) {
//       // If address ID is provided, check if the address exists
//       const existingAddress = await Address.findOne({ _id: address._id, userId });

//       if (existingAddress) {
//         addressReference = existingAddress._id; // Use the existing address
//       } else {
//         return res.status(400).json({ message: "Address not found for the provided ID." });
//       }
//     } else {
//       // If no address ID, create a new address
//       const newAddressRecord = new Address({
//         userId: userId,
//         ...address, // Use the address data passed from the request body
//       });

//       const savedAddress = await newAddressRecord.save();
//       addressReference = savedAddress._id; // Use the newly created address's _id
//     }

//     // Step 4: Create the Order Record
//     const orderRecord = new Order({
//       UserId: userId,
//       items: items,
//       TotalAmount: order?.total,
//       AddressId: addressReference, // Reference to the address document
//       CouponId: coupon?._id || null,
//     });

//     const savedOrder = await orderRecord.save();

//     // Step 5: Handle Payment
//     const paymentRecord = new Payment({
//       userId: userId,
//       OrderId: savedOrder._id,
//       status: "Order Placed",
//       method: payment?.paymentMethod,
//       amount: order?.total,
//       transactionId: null,
//     });

//     await paymentRecord.save();

//     // Step 6: Respond to Client
//     res.status(200).json({
//       message: "Order placed successfully",
//       orderId: savedOrder._id,
//       paymentId: paymentRecord._id,
//     });

//   } catch (error) {
//     console.error("Error processing order:", error);
//     res.status(500).json({ message: "An error occurred while processing the order." });
//   }
// };



// Helper function to handle single product order
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

// Helper function to handle cart-based order
const handleCartOrder = async (userId, cartItems) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found for this user.");
  }
  
  const items = [];
  for (let item of cartItems) {
    const { cartItemId, quantity, originalPrice } = item;
    const cartItem = cart.items.find(ci => ci._id.toString() === cartItemId);
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

// Helper function to validate and apply coupon
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

// Helper function to handle address
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

// Updated helper function to create order record
const createOrderRecord = async (userId, items, subtotal, couponDiscount, totalAmount, addressId, couponId) => {
  console.log('Creating order record with:', { userId, items, subtotal, couponDiscount, totalAmount, addressId, couponId });

  // Create a new order with the additional fields
  const orderRecord = new Order({
    UserId: userId,
    items,
    Subtotal: subtotal, // Total before any discounts
    CouponDiscount: couponDiscount, // Discount applied from the coupon
    TotalAmount: totalAmount, // Final total after applying the discount
    AddressId: addressId,
    CouponId: couponId,
  });

  // Save the order to the database
  const savedOrder = await orderRecord.save();
  console.log('Order saved successfully:', savedOrder);

  return savedOrder;
};


// Helper function to create payment record


const createPaymentRecord = async (userId, orderId, paymentMethod, totalAmount, razorpayTransactionId = null) => {
  // Initialize the payment status and transactionId
  let paymentStatus = "Pending";  // Default status
  let transactionId = null;

  if (paymentMethod === "card") {
    // Check if the user has a wallet and enough balance
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      throw new Error("User does not have a wallet.");
    }

    if (wallet.balance >= totalAmount) {
      // Deduct the balance from the wallet
      wallet.balance -= totalAmount;
      await wallet.save();

      // Create a successful transaction record for debit
      const transaction = new Transaction({
        walletId: wallet._id,
        userId,
        type: "Debit",
        amount: totalAmount,
        description: `Payment for order ${orderId}`,
        status: "Successful"
      });
      await transaction.save();

      // Set the transaction ID and update payment status
      transactionId = transaction._id;
      paymentStatus = "Successful";
    } else {
      throw new Error("Insufficient balance in the wallet.");
    }
  } else if (paymentMethod === "razorpay") {
    // For Razorpay, simply store the transaction ID and mark the payment as successful
    paymentStatus = "Successful";
    transactionId = razorpayTransactionId; // Store the Razorpay transaction ID
  } else if (paymentMethod === "cod") {
    // For COD, set the payment status to "Pending"
    paymentStatus = "Pending";
  } else {
    throw new Error("Invalid payment method.");
  }

  // Create a payment record in the Payment collection
  const paymentRecord = new Payment({
    userId,
    OrderId: orderId,
    status: paymentStatus,
    method: paymentMethod,
    amount: totalAmount,
    transactionId: transactionId,
  });

  // Save the payment record
  return await paymentRecord.save();
};

// Updated processPayment function
exports.processPayment = async (req, res) => {
  try {
    console.log('Processing payment. Request body:', req.body);
    const { address, order, couponCode, payment,} = req.body;
    const userId = req.user;
    console.log('User ID:', userId);

    let items = [];

    // Step 1: Handle the Product or Cart Items
    if (order?.productId) {
      console.log('Processing single product order');
      items.push(await handleSingleProductOrder(order?.productId, 1));
    } else if (order && order.cartItems && order.cartItems.length > 0) {
      console.log('Processing cart-based order');
      items = await handleCartOrder(userId, order.cartItems);
    } else {
      console.log('Invalid order: missing productId or cartItems');
      return res.status(400).json({ message: "Either productId or cartItems are required." });
    }
    console.log('Processed items:', items);

    // Step 2: Validate and Apply Coupon
    const coupon = await validateAndApplyCoupon(couponCode, userId);
    const couponDiscount = coupon ? (order.total * coupon.discount) / 100 : 0; // Assuming the coupon has a 'discount' property
    console.log('Coupon applied:', coupon, 'Coupon discount:', couponDiscount)

    // Step 3: Handle Address Reference
    const addressReference = await handleAddress(address, userId);
    console.log('Address reference:', addressReference);

    const totalAmount = order.total - couponDiscount;
    console.log(totalAmount, 'totalAmount')

    // Step 4: Create the Order Record
    console.log('Creating order record');
    const savedOrder = await createOrderRecord(userId, items, order.total, couponDiscount, totalAmount,  addressReference, coupon?._id);
    console.log('Order created:', savedOrder);
          
    // Step 5: Handle Payment
    console.log('Creating payment record');
    const paymentRecord = await createPaymentRecord(userId, savedOrder._id, payment.paymentMethod, totalAmount);
    console.log('Payment record created:', paymentRecord);

    // Step 6: Respond to Client
    console.log('Sending success response to client');
    res.status(200).json({
      message: "Order placed successfully",
      orderId: savedOrder._id,
      paymentId: paymentRecord._id,
    });

  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ message: error.message || "An error occurred while processing the order." });
  }
};



