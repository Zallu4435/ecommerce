const mongoose = require('mongoose');

const comparisonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt at the root level
  }
);

// Pre-save hook to update the updatedAt field for each item
comparisonSchema.pre('save', function (next) {
  this.items.forEach((item) => {
    item.updatedAt = Date.now();
  });
  next();
});

module.exports = mongoose.model('Comparison', comparisonSchema);