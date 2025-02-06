const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    createdBy: {
      type: String,
      required: false,
    },
    updatedBy: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
    returnPolicy: {
      type: String,
    },
    originalPrice: {
      type: Number,
    },
    status: {
      type: String,
    },
    colorOption: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
    },
    sizeOption: [
      {
        type: String,
      },
    ],
    stockQuantity: {
      type: Number,
    },
    offerPrice: {
      type: Number,
      required: false,
    },
    variantImages: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

ProductsSchema.index({ productName: "text", description: "text", category: "text" });

const Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;
