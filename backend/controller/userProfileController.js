const Address = require('../model/Address');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../model/User');  
const Order = require('../model/Orders');
const Coupon = require('../model/Coupon');
const Product = require('../model/Products')
const Cart = require('../model/Cart')
const mongoose = require('mongoose');
const Payment = require('../model/Payment')

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
exports.processPayment = async (req, res) => {

  try {
    const {  address, order, couponCode, newAddress, payment, quantity } = req.body;
    const userId = req.user;

    console.log(order?.productId, "address from from ")
   

    let items = [];

    if (order?.productId) {
      // Direct single product order
      const product = await Product.findById(order?.productId);
      if (!product) {
        return res.status(400).json({ message: "Product not found." });
      }
      items.push({
        ProductId: order?.productId,
        Price: product.price,
        Quantity: quantity, 
      });
    } else if (order && order.cartItems && order.cartItems.length > 0) {
      // Cart-based order
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(400).json({ message: "Cart not found for this user." });
      }
 
      for (let item of order.cartItems) {
        const { cartItemId, quantity, originalPrice } = item;
        const cartItem = cart.items.find(ci => ci._id.toString() === cartItemId);
        if (!cartItem) {
          return res.status(400).json({ message: `Cart item ${cartItemId} not found.` });
        }

        items.push({
          ProductId: cartItem.productId,
          Price: originalPrice,  
          Quantity: quantity,
          Color: cartItem.color,
          Size: cartItem.size
        });
      }
    } else {
      return res.status(400).json({ message: "Either productId or cartItems are required." });
    }

    // Step 3: Validate Coupon
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon code." });
      }
    }
    // Step 4: Create the Order
    const orderStatus = payment?.paymentMethod === "cod" ? "Pending" : "Confirmed";
    const orderRecord = new Order({
      UserId: userId,
      items: items,
      TotalAmount: order?.total,
      Address: address,
      Status: orderStatus,
      CouponId: coupon?._id || null,
    });

    await orderRecord.save();

    // console.log(orderRecord, "orderRecored ")
    // Step 5: Handle Payment
    let paymentRecord = null;

    if (payment?.paymentMethod === "cod") {
      paymentRecord = new Payment({
        userId: userId,
        OrderId: orderRecord._id,
        status: "Pending",
        method: payment?.paymentMethod,
        amount: order?.total,
        transactionId: null,
      });

      await paymentRecord.save();
      console.log("COD Payment recorded:", paymentRecord);
    }
    // } else {
    //   const paymentResult = await processPaymentGateway({
    //     amount: calculatedTotal,
    //     orderId: orderRecord._id,
    //   });

    //   if (!paymentResult.success) {
    //     // If payment fails, update order status and return error
    //     orderRecord.Status = "Failed";
    //     await orderRecord.save();
    //     return res.status(500).json({ message: "Payment failed.", orderId: orderRecord._id });
    //   }

    //   paymentRecord = new Payment({
    //     UserId: userId,
    //     OrderId: orderRecord._id,
    //     Status: "Success",
    //     Method: paymentMethod,
    //     Amount: calculatedTotal,
    //     TransactionId: paymentResult.transactionId,
    //   });

    //   await paymentRecord.save();
    //   console.log("Online Payment recorded:", paymentRecord);
    // }

    // Link payment to the order
    // orderRecord.PaymentId = paymentRecord._id;
    // await orderRecord.save();
    // console.log(object)
    // Step 6: Respond to Client


    res.status(200).json({
      message: "Order placed successfully",
      orderId: orderRecord._id,
      paymentId: paymentRecord?._id || null,
      status: orderStatus,
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ message: "An error occurred while processing the order." });
  }
};


