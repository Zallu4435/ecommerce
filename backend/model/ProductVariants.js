const mongoose = require("mongoose");

const ProductVariantSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
            required: true,
            index: true, // Index for faster queries
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        size: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        stockQuantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        price: {
            type: Number,
            required: false, // Optional: uses product's basePrice if not set
            min: 0,
        },
        offerPrice: {
            type: Number,
            required: false, // Optional: uses product's baseOfferPrice if not set
            min: 0,
        },
        image: {
            type: String,
            required: false, // Optional: uses product's main image if not set
        },
        imagePublicId: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Advanced features for future
        barcode: {
            type: String,
            required: false,
        },
        weight: {
            type: Number,
            required: false, // In grams
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Unisex"], // m and w mapping
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate color+size+gender combinations for same product
ProductVariantSchema.index({ productId: 1, color: 1, size: 1, gender: 1 }, { unique: true });

// Index for stock queries
ProductVariantSchema.index({ stockQuantity: 1 });

// Virtual to get effective price (variant price or product base price)
ProductVariantSchema.virtual("effectivePrice").get(function () {
    return this.price || this.productId?.basePrice || 0;
});

ProductVariantSchema.virtual("effectiveOfferPrice").get(function () {
    return this.offerPrice || this.productId?.baseOfferPrice || 0;
});

// Method to check if variant is in stock
ProductVariantSchema.methods.isInStock = function () {
    return this.isActive && this.stockQuantity > 0;
};

// Method to decrease stock
ProductVariantSchema.methods.decreaseStock = async function (quantity) {
    if (this.stockQuantity < quantity) {
        throw new Error(`Insufficient stock. Available: ${this.stockQuantity}`);
    }
    this.stockQuantity -= quantity;
    return await this.save();
};

// Method to increase stock
ProductVariantSchema.methods.increaseStock = async function (quantity) {
    this.stockQuantity += quantity;
    return await this.save();
};

// Static method to get all variants for a product
ProductVariantSchema.statics.getProductVariants = async function (productId) {
    return await this.find({ productId, isActive: true }).sort({ color: 1, size: 1 });
};

// Static method to get available colors for a product
ProductVariantSchema.statics.getAvailableColors = async function (productId) {
    const variants = await this.find({ productId, isActive: true, stockQuantity: { $gt: 0 } });
    return [...new Set(variants.map((v) => v.color))];
};

// Static method to get available sizes for a product and color
ProductVariantSchema.statics.getAvailableSizes = async function (productId, color = null) {
    const query = { productId, isActive: true, stockQuantity: { $gt: 0 } };
    if (color) query.color = color.toLowerCase();

    const variants = await this.find(query);
    return [...new Set(variants.map((v) => v.size))];
};

// Static method to calculate total stock for a product
ProductVariantSchema.statics.getTotalStock = async function (productId) {
    const result = await this.aggregate([
        { $match: { productId: mongoose.Types.ObjectId(productId), isActive: true } },
        { $group: { _id: null, totalStock: { $sum: "$stockQuantity" } } },
    ]);
    return result.length > 0 ? result[0].totalStock : 0;
};

const ProductVariant = mongoose.model("ProductVariant", ProductVariantSchema);

module.exports = ProductVariant;
