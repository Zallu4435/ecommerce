const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    returnPolicy: {
      type: String,
    },
    // Base prices - variants can override these
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    baseOfferPrice: {
      type: Number,
      required: false,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    // Main product image
    image: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
    // Cached fields - updated when variants change
    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableColors: [
      {
        type: String,
      },
    ],
    availableSizes: [
      {
        type: String,
      },
    ],
    availableGenders: [
      {
        type: String,
      },
    ],
    // Metadata
    hasVariants: {
      type: Boolean,
      default: false,
    },
    variantCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductsSchema.virtual('originalPrice').get(function () {
  return this.basePrice;
});

ProductsSchema.virtual('offerPrice').get(function () {
  return this.baseOfferPrice;
});

ProductsSchema.index({ productName: "text", description: "text", category: "text" });

const Products = mongoose.model("Products", ProductsSchema);

module.exports = Products;
