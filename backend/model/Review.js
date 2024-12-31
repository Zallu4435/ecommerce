const mongoose = require('mongoose');

// Define the schema for the review
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500, // Limit the review length to 500 characters
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products', // Assuming you have a Product model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Add indexes to improve query performance
reviewSchema.index({ productId: 1 });  // Index for productId (fast lookup for product reviews)
reviewSchema.index({ userId: 1 });     // Index for userId (fast lookup for user reviews)
reviewSchema.index({ createdAt: -1 }); // Index for sorting reviews by createdAt in descending order

// Ensure a user can only submit one review per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Create the model from the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
