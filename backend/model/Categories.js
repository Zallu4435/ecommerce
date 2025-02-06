const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model("Categories", CategoriesSchema);

module.exports = Categories;
