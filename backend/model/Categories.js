const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categoryDescription: {
      type: String,
    },
    categoryOffer: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    offerName: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isOfferActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model("Categories", CategoriesSchema);

module.exports = Categories;
