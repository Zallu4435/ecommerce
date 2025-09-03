const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    nickname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    avatar: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.generateAdminToken = function () {
  return jwt.sign({ id: this._id, isAdmin: true }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 600000;

  return resetToken;
};

function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp.toString()).digest("hex");
}

userSchema.methods.generateOTP = function () {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  this.otp = hashOTP(otp);
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  return otp;
};

userSchema.methods.verifyOTP = function (enteredOTP) {
  const hashedEnteredOTP = hashOTP(enteredOTP);
  const isNotExpired = this.otpExpires > new Date();
  const isMatching = hashedEnteredOTP === this.otp;
  
  return isMatching && isNotExpired;
};

module.exports = mongoose.model("User", userSchema);
