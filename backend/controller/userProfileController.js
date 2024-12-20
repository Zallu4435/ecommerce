const Address = require('../model/Address');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../model/User');

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
