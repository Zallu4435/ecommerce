const User = require('../model/User');
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken');
const { sendMail, sendOTPEmail } = require('../utils/sendMail');
const {sendToken} = require('../utils/jwtToken');
const { OAuth2Client } = require("google-auth-library");


// Create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Signup user
exports.signupUser = async (req, res, next) => {
  const { username, email, password, phone } = req.body;
  console.log(username, email, password, phone);

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) { 
      return next(new ErrorHandler("User already exists.", 400));
    }

    // Save user as inactive
    const newUser = new User({ username, email, password, phone, isActive: false });
    console.log(newUser, "newUser");
    await newUser.save();

    // Generate activation token
    const activationToken = createActivationToken({ id: newUser._id });
    console.log(activationToken, "activation ataok")
    const activationUrl = `http://localhost:5173/activation/${activationToken}`;

    console.log("Sending activation email...");
    await sendMail({
      email: newUser.email,
      subject: "Activate your account",
      message: `Hello ${newUser.username}, Please click on the link to activate your account: ${activationUrl}`,
    }); 

    res.status(201).json({
      success: true, 
      message: `Please check your email: ${newUser.email} to activate your account.`,
    });
  } catch (err) {
    console.error("Error sending email:", err.message);

    // Rollback: delete the user if email sending fails
    if (newUser) {
      await User.deleteOne({ _id: newUser._id });
    }

    return next(new ErrorHandler(err.message, 500));
  }
};

exports.activateAccount = async (req, res, next) => {
  try {
    console.log("hihih")
    console.log(req.params, "paerams")
    console.log(req.query, "query")
    console.log(req.body, "body")

    const  {token} = req.body; 
    console.log(token, "token from params");

    // Verify activation token
    const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET);

    // Find the user and activate their account
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorHandler("Invalid activation token or user not found", 400));
    }

    if (user.isActive) {
      return next(new ErrorHandler("Account is already activated", 400));
    }

    user.isActive = true;
    await user.save();

    // Generate and send access/refresh tokens
    sendToken(user, 200, res);
  } catch (err) {
    console.error(err.message);
    return next(new ErrorHandler("Activation link expired or invalid", 400));
  }
};




// Login user
exports.loginUser = async (req, res, next) => {

  const { email, password } = req.body;

  console.log(password, "password")
  
  if (!email || !password) {
    return next(new ErrorHandler("Please provide all fields!", 400));
  }
  
  const user = await User.findOne({ email }).select("+password");
 
  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 400));
  }

  console.log(user, "userlogin")
  if (user.isBlocked) {
    return next(new ErrorHandler("User banned! Can't login"))
  }
  console.log("hi i'm from the user login")
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    console.log(isPasswordValid, "reached here")
    return next(new ErrorHandler("Please provide the correct information", 400));
  }
  
  console.log("token sended", user)
  sendToken(user, 201, res);
};  

// Get user
exports.getUser = async (req, res, next) => {
  // console.log("reached here");
  // console.log("user requsted user ",req.user._id)
  // console.log(req, 'hahaha')
  const user = await User.findById(req.user).select('username nickname phone email gender address avatar');
  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 400));
  }
  console.log(user, "user")
  res.status(200).json({
    success: true,
    user,
  });
};

// Logout user
exports.logoutUser = async (req, res, next) => {
  res.cookie("refreshToken", null, {
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
  const { email, nickname, phone, username, gender, oldEmail } = req.body;

  // console.log(oldEmail, "old")
  // Find the user using the oldEmail
  const user = await User.findOne({ email: oldEmail }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  // Check if the email is being changed and if it is already in use by another user
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already in use by another user", 400));
    }
  }

  // Proceed with updating user information
  if (username) user.username = username;
  if (phone) user.phone = phone;
  if (nickname) user.nickname = nickname;
  if (gender) user.gender = gender;
  if (email) user.email = email;  // Update the email if provided

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
};


// Update avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    let user = await User.findById(req.user);
    
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const { avatar } = req.body;
    if (avatar) {
      user.avatar = avatar; 
      await user.save();
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
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
exports.verifyResetPassword = async (req, res, next) => {
  const { token, otp } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
 
    const isMatch = user.verifyOTP(otp);
    console.log('OTP verification result:', isMatch);

    // Generate a reset token (valid for a longer period)
    const resetToken = jwt.sign({ email: user.email }, process.env.OTP_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: "OTP verified successfully!",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }

};


exports.resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).send("Token and OTP are required");
  };

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      console.log('User not found for email:', decoded.email);
      return res.status(404).send("User not found");
    }


    const isMatch = jwt.verify(token, process.env.OTP_SECRET);
    console.log('OTP verification result:', isMatch);
    user.password = newPassword;
    await user.save();
    if (isMatch) {
      res.status(200).json("Password reset successfully");
    } else {
      res.status(400).send("Invalid or expired OTP");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    next(new ErrorHandler("OTP verification failed", 500));
  }

}

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
    const users = await User.find().select('id username avatar email role createdAt isBlocked');

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      success: true,
      users: users.map(user => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
        isBlocked: user.isBlocked,
        avatar: user.avatar
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res, next) => {
  const token = req.body.credential;
  if (!token) {
    return next(new ErrorHandler("Google token is required", 400));
  }

  // Verify Google token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub, email, name, picture } = payload; 

  let user = await User.findOne({ email });

  if (!user) {
    // If user doesn't exist, create a new one
    console.log("not user is in")
    user = await User.create({
      googleId: sub,
      email,
      username: name,
      avatar: picture,
    });
  }

  sendToken(user, 200, res)

};

 

exports.refreshToken = async (req, res, next) => {
  try {
    // console.log("reachded inside the refresh token ")
      // Find user by ID from verified refresh token
      const user = await User.findById(req.user);
      
      if (!user) {
          return res.status(404).json({ 
              message: 'User not found',
              requireLogin: true 
          });
      }

      sendToken(user, 200, res);

  } catch (error) {
      next(new ErrorHandler('Token refresh failed', 500));
  }
};


// Generate a JWT for OTP
const createActivationOtp = (email) => {
  const arr =  jwt.sign({ email }, process.env.OTP_SECRET, {
    expiresIn: process.env.OTP_EXPIRATION || "10m",
  });
  console.log(arr, "arr")
  return arr;
};


exports.otpLogin = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }
  console.log("OTP login request for email:", email);

  try {
    let user = await User.findOne({ email });
    if (!user) {
      console.log('User not found, creating new user');
      user = new User({ email });
    }

    const otp = user.generateOTP();
    await user.save();
    console.log('User saved with new OTP');

    // For debugging purposes only, remove in production
    await sendOTPEmail({
      email: user.email,
      subject: "Activate your account",
      message: `Your otp is ${otp}`
    })
    console.log('Generated OTP:', otp);

    const token = jwt.sign({ email }, process.env.OTP_SECRET, {
      expiresIn: process.env.OTP_EXPIRATION || "10m",
    });

    res.status(200).json({ message: "OTP sent successfully", token });
  } catch (error) {
    console.error("Error during OTP login:", error);
    next(new ErrorHandler("OTP Login failed", 500));
  }
};



exports.verifyEmailOtp = async (req, res, next) => {
  const { token, otp } = req.body;

  if (!token || !otp) {
    return res.status(400).send("Token and OTP are required");
  }

  console.log('Verifying email OTP. Token:', token, 'OTP:', otp);

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      console.log('User not found for email:', decoded.email);
      return res.status(404).send("User not found");
    }

    console.log('Found user:', user.email);
    console.log('Stored OTP hash:', user.otp);
    console.log('OTP expiration:', user.otpExpires);

    const isMatch = user.verifyOTP(otp);
    console.log('OTP verification result:', isMatch);

    if (isMatch) {
      sendToken(user, 200, res)
    } else {
      res.status(400).send("Invalid or expired OTP");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    next(new ErrorHandler("OTP verification failed", 500));
  }
};
