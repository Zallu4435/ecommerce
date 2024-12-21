const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to User model, assuming the cart is linked to a user
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',  // Reference to Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        color: {  // Make sure the color field exists
          type: String,
          required: true,
        },
        size: {  // Make sure the size field exists
          type: String,
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
    timestamps: true,  // Automatically adds createdAt and updatedAt
  }
);

// Update `updatedAt` only if the item is modified
cartSchema.pre('save', function (next) {
  if (this.isModified('items')) {
    this.items.forEach((item) => {
      item.updatedAt = Date.now();
    });
  }
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
