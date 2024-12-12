const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,  // To ensure the email is unique
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    resetPasswordToken: String, // Token for password reset
    resetPasswordExpire: Date,  // Expiration time for the token
  },
  {
    timestamps: true
  }
);

// Hash Password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT Token generation
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Compare Passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate a reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the reset token and save it to the database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set the expiration time (1 hour)
  this.resetPasswordExpire = Date.now() + 600000;  // 10 minutes in milliseconds

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
