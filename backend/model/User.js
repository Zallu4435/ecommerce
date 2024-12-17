const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
      type: String
    },
    resetPasswordToken: String, // Token for password reset
    resetPasswordExpire: Date,  // Expiration time for the token
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', 
    },
    isBlocked: {
      type: String,
      default: false,
    },
    googleId: {
      type: String,
      unique: true, 
      sparse: true,
    },
    otp: {
      type: String,
      default: null
    },
    otpExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Hash Password before saving to the database
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
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
  console.log(this.password, 'entered passwoord')

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



function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp.toString()).digest("hex");
}

userSchema.methods.generateOTP = function () {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
  console.log('Generated OTP:', otp);

  this.otp = hashOTP(otp);
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  console.log('Stored hashed OTP:', this.otp);
  console.log('OTP expiration:', this.otpExpires);

  return otp;
};

userSchema.methods.verifyOTP = function (enteredOTP) {
  console.log('Verifying OTP:', enteredOTP);
  console.log('Current time:', new Date());
  console.log('OTP expiration:', this.otpExpires);

  const hashedEnteredOTP = hashOTP(enteredOTP);
  console.log('Hashed entered OTP:', hashedEnteredOTP);
  console.log('Stored hashed OTP:', this.otp);

  const isNotExpired = this.otpExpires > new Date();
  const isMatching = hashedEnteredOTP === this.otp;

  console.log('OTP not expired:', isNotExpired);
  console.log('OTP matches:', isMatching);

  return isMatching && isNotExpired;
};


module.exports = mongoose.model("User", userSchema);
