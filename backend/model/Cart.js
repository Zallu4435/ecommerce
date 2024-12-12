const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
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
    timestamps: true, 
  }
);


cartSchema.pre('save', function (next) {
  this.items.forEach((item) => {
    item.updatedAt = Date.now();
  });
  next();
});


module.exports = mongoose.model('Cart', cartSchema);
