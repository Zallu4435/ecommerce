const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  minAmount: {
    type: Number,
    required: true,
    min: 0
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 0
  },
  expiry: {
    type: Date,
    required: true,
  },
  applicableUsers: {
    type: [String],
    default: [],
  },
  applicableProducts: {
    type: [String],
    default: [],
  },
  appliedUsers: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt at the document level
}
);

// Virtual field for expiry status
couponSchema.virtual("isExpired").get(function () {
  return this.expiry < Date.now();
});

// Middleware to update the updatedAt field and check expiry
couponSchema.pre("save", function (next) {
  if (this.expiry < Date.now()) {
    return next(new Error("Cannot save or update an expired coupon."));
  }
  this.updatedAt = Date.now();
  next();
});

// Ensure virtual fields are included when converting document to JSON
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;

