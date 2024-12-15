const User = require('../model/User');
const Address = require('../model/Address');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const sendToken = require('../utils/jwtToken');

// Create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, {
    expiresIn: "5m",
  });
};

// Signup user
exports.signupUser = async (req, res, next) => {
  const { username, email, password, phone } = req.body;

  const userEmail = await User.findOne({ email });
  if (userEmail) {
    return next(new ErrorHandler("User already exists.", 400));
  }

  const user = { username, email, password, phone };
  const activationToken = createActivationToken(user);
  const activationUrl = `http://localhost:5173/activation/${activationToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Activate your account",
      message: `Hello ${user.username}, Please click on the link to activate your account: ${activationUrl}`,
    });
    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account.`,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
};

// Activate user
exports.activateUser = async (req, res, next) => {
  const { activation_token } = req.body;

  const newUser = jwt.verify(activation_token, process.env.JWT_SECRET_KEY);
  if (!newUser) {
    return next(new ErrorHandler("Invalid user", 400));
  }

  const { username, email, password, phone } = newUser;
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  user = await User.create({ username, email, password, phone });
  sendToken(user, 201, res);
};

// Login user
exports.loginUser = async (req, res, next) => {

  const { email, password } = req.body;


  if (!email || !password) {
    return next(new ErrorHandler("Please provide all fields!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 400));
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Please provide the correct information", 400));
  }

  sendToken(user, 201, res);
};

// Get user
exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('username nickname phone email gender address avatar');
  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
};

// Logout user
exports.logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(201).json({
    success: true,
    message: "Logout successful",
  });
};

// Update user info
exports.updateUserInfo = async (req, res, next) => {
  const { email, nickname, phone, username, gender } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  if (username) user.username = username;
  if (phone) user.phone = phone;
  if (nickname) user.nickname = nickname;
  if (gender) user.gender = gender;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
};

// Update avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const { avatar } = req.body;
    if (avatar) {
      user.avatar = avatar; // Assign the new avatar URL to the user object
      await user.save(); // Save the updated user object to the database
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};






// Address Section ========================>>>>>>>>>

// Add Address
exports.addAddress = async (req, res, next) => {
  const userId = req.user.id;
  const { country, state, city, zipCode, street } = req.body;

  const address = await Address.create({
    user: userId,
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
};

// Edit Address
exports.editAddress = async (req, res, next) => {
  const userId = req.user.id;
  const { _id, country, state, city, zipCode, street } = req.body;

  const address = await Address.findOne({ _id, user: userId });
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
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
};

// Remove Address
exports.removeAddress = async (req, res, next) => {
  const userId = req.user.id;
  const { _id } = req.body;

  const address = await Address.findOne({ _id, user: userId });
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }

  await address.remove();

  res.status(200).json({
    success: true,
    message: "Address removed successfully",
  });
};







// password Section ================>>>>>>>

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Password Reset Request",
      message: `You requested a password reset. Please click the link below to reset your password: \n\n ${resetUrl}`,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} with password reset link.`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent.", 500));
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  const resetToken = req.params.token;
  
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired reset token", 400));
  }

  const { password } = req.body;

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
};

// Update Password (Authenticated)
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if the current password is correct
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Current password is incorrect", 400));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('username email role createdAt');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      success: true,
      users: users.map(user => ({
        name: user.username,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
