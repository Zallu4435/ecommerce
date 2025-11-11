const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [3, 'Coupon code must be at least 3 characters'],
    maxlength: [50, 'Coupon code cannot exceed 50 characters'],
    validate: {
      validator: function(v) {
        return /^[A-Z0-9_-]+$/.test(v);
      },
      message: 'Coupon code can only contain uppercase letters, numbers, hyphens, and underscores'
    }
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
    min: [1, 'Discount must be at least 1%'],
    max: [70, 'Discount cannot exceed 70%']
  },
  minAmount: {
    type: Number,
    required: [true, 'Minimum purchase amount is required'],
    min: [500, 'Minimum purchase amount must be at least ₹500'],
    max: [100000, 'Minimum purchase amount cannot exceed ₹1,00,000'],
    validate: {
      validator: function(v) {
        return v >= 500 && v <= 100000;
      },
      message: 'Minimum amount must be between ₹500 and ₹1,00,000'
    }
  },
  maxAmount: {
    type: Number,
    required: [true, 'Maximum discount amount is required'],
    min: [1, 'Maximum discount cannot be less than 1'],
    max: [5000, 'Maximum discount cannot exceed ₹5,000'],
    validate: {
      validator: function(v) {
        return v > 0 && v <= 5000;
      },
      message: 'Maximum discount must be between ₹1 and ₹5,000'
    }
  },
  usageLimit: {
    type: Number,
    default: null,
    min: [1, 'Usage limit must be at least 1'],
    validate: {
      validator: function(v) {
        return v === null || (Number.isInteger(v) && v > 0);
      },
      message: 'Usage limit must be a positive integer or null for unlimited'
    }
  },
  usageCount: {
    type: Number,
    default: 0,
    min: [0, 'Usage count cannot be negative']
  },
  perUserLimit: {
    type: Number,
    default: 1,
    min: [1, 'Per user limit must be at least 1'],
    max: [5, 'Per user limit cannot exceed 5 uses'],
    validate: {
      validator: function(v) {
        return Number.isInteger(v) && v > 0 && v <= 5;
      },
      message: 'Per user limit must be between 1 and 5'
    }
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
  timestamps: true,  
}
);

couponSchema.virtual("isExpired").get(function () {
  return this.expiry < Date.now();
});

couponSchema.pre("save", function (next) {
  if (this.expiry < Date.now()) {
    return next(new Error("Cannot save or update an expired coupon."));
  }
  
  // Validate minAmount is reasonable compared to maxAmount
  // Ensure minimum purchase is at least 5x the max discount to prevent abuse
  if (this.minAmount < this.maxAmount * 5) {
    return next(new Error("Minimum purchase amount must be at least 5 times the maximum discount amount."));
  }
  
  // Validate usage limit
  if (this.usageLimit !== null && this.usageCount > this.usageLimit) {
    return next(new Error("Usage count cannot exceed usage limit."));
  }
  
  // Ensure couponCode is uppercase
  if (this.couponCode) {
    this.couponCode = this.couponCode.toUpperCase();
  }
  
  this.updatedAt = Date.now();
  next();
});

// Add method to check if coupon is still available
couponSchema.methods.isAvailable = function() {
  if (this.expiry < Date.now()) return false;
  if (this.usageLimit !== null && this.usageCount >= this.usageLimit) return false;
  return true;
};

// Add method to check if user can use coupon
couponSchema.methods.canUserApply = function(userId) {
  if (!this.isAvailable()) return false;
  
  // Check if user has already used the coupon
  const userUsageCount = this.appliedUsers.filter(id => id === userId).length;
  if (userUsageCount >= this.perUserLimit) return false;
  
  // Check if user is in applicable users list (if list is not empty)
  if (this.applicableUsers.length > 0 && !this.applicableUsers.includes(userId)) {
    return false;
  }
  
  return true;
};

couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;

