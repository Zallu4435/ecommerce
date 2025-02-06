const User = require("../model/User");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const { sendMail, sendOTPEmail } = require("../utils/sendMail");
const { sendToken } = require("../utils/jwtToken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

const createActivationOtp = (email) => {
  const arr = jwt.sign({ email }, process.env.OTP_SECRET, {
    expiresIn: process.env.OTP_EXPIRATION || "10m",
  });
  return arr;
};

exports.activateAccount = async (req, res, next) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_ACTIVATION_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new ErrorHandler("Invalid activation token or user not found", 400)
      );
    }

    if (user.isActive) {
      return next(new ErrorHandler("Account is already activated", 400));
    }

    user.isActive = true;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    console.error(err.message);
    return next(new ErrorHandler("Activation link expired or invalid", 400));
  }
};

exports.signupUser = async (req, res, next) => {
  const { username, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler("User already exists.", 400));
    }

    const newUser = new User({
      username,
      email,
      password,
      phone,
      isActive: false,
    });
    await newUser.save();

    const activationToken = createActivationToken({ id: newUser._id });
    const activationUrl = `${process.env.ORIGIN}/activation/${activationToken}`;

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
    if (newUser) {
      await User.deleteOne({ _id: newUser._id });
    }
    return next(new ErrorHandler(err.message, 500));
  }
};

exports.googleLogin = async (req, res, next) => {
  const token = req.body.credential;
  if (!token) {
    return next(new ErrorHandler("Google token is required", 400));
  }
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  
  const payload = ticket.getPayload();
  const { sub, email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      googleId: sub,
      email,
      username: name,
      avatar: picture,
    });
  }

  sendToken(user, 200, res);
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide all fields!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 400));
  }

  if (user.isBlocked) {
    return next(new ErrorHandler("User banned! Can't login"));
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return next(
      new ErrorHandler("Please provide the correct information", 400)
    );
  }

  sendToken(user, 201, res);
};

exports.otpLogin = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    const otp = user.generateOTP();
    await user.save();

    await sendOTPEmail({
      email: user.email,
      subject: "Activate your account",
      message: `Your otp is ${otp}`,
    });

    const token = jwt.sign({ email }, process.env.OTP_SECRET, {
      expiresIn: process.env.OTP_EXPIRATION || "10m",
    });

    res.status(200).json({ message: "OTP sent successfully", token });
  } catch (error) {
    console.error("Error during OTP login:", error);
    next(new ErrorHandler("OTP Login failed", 500));
  }
};

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

exports.updateUserInfo = async (req, res, next) => {
  const { email, nickname, phone, username, gender, oldEmail } = req.body;

  const user = await User.findOne({ email: oldEmail }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new ErrorHandler("Email is already in use by another user", 400)
      );
    }
  }

  if (username) user.username = username;
  if (phone) user.phone = phone;
  if (nickname) user.nickname = nickname;
  if (gender) user.gender = gender;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
};

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

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

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

exports.verifyResetPassword = async (req, res, next) => {
  const { token, otp } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = user.verifyOTP(otp);

    const resetToken = jwt.sign({ email: user.email }, process.env.OTP_SECRET, {
      expiresIn: "1h",
    });

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
  }

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = jwt.verify(token, process.env.OTP_SECRET);
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
};

exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Current password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const searchFilter = search
      ? { username: { $regex: search, $options: "i" } }
      : {};

    const users = await User.find(searchFilter)
      .select("id username avatar email role createdAt isBlocked")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalUsers = await User.countDocuments(searchFilter);

    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        users: [],
        totalUsers: 0,
        currentPage: pageNumber,
        totalPages: 0,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      users: users.map((user) => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        joinDate: user.createdAt,
        isBlocked: user.isBlocked,
        avatar: user.avatar,
      })),
      totalUsers,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalUsers / limitNumber),
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.user).select(
    "username nickname phone email gender address avatar"
  );
  if (!user) {
    return next(new ErrorHandler("User doesn't exist!", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        requireLogin: true,
      });
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(new ErrorHandler("Token refresh failed", 500));
  }
};

exports.verifyEmailOtp = async (req, res, next) => {
  const { token, otp } = req.body;

  if (!token || !otp) {
    return res.status(400).send("Token and OTP are required");
  }

  try {
    const decoded = jwt.verify(token, process.env.OTP_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = user.verifyOTP(otp);

    if (isMatch) {
      sendToken(user, 200, res);
    } else {
      res.status(400).send("Invalid or expired OTP");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    next(new ErrorHandler("OTP verification failed", 500));
  }
};
