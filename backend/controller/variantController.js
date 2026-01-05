const ProductVariant = require("../model/ProductVariants");
const Product = require("../model/Products");
const ErrorHandler = require("../utils/ErrorHandler");
const {
    generateSKU,
    updateProductVariantCache,
    validateVariant,
    checkDuplicateVariant,
    getVariantBySKU,
    getProductVariantsWithStatus,
    bulkCreateVariants,
} = require("../utils/variantUtils");
const cloudinary = require("cloudinary").v2;

// Get all variants for a product
exports.getProductVariants = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const variants = await getProductVariantsWithStatus(productId);

        res.status(200).json({
            success: true,
            variants,
            totalVariants: variants.length,
            totalStock: product.totalStock,
            availableColors: product.availableColors,
            availableSizes: product.availableSizes,
        });
    } catch (error) {
        next(error);
    }
};

// Get single variant by ID
exports.getVariantById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const variant = await ProductVariant.findById(id).populate(
            "productId",
            "productName brand category basePrice baseOfferPrice image"
        );

        if (!variant) {
            return next(new ErrorHandler("Variant not found", 404));
        }

        res.status(200).json({
            success: true,
            variant,
        });
    } catch (error) {
        next(error);
    }
};

// Get variant by SKU
exports.getVariantBySKU = async (req, res, next) => {
    try {
        const { sku } = req.params;

        const variant = await getVariantBySKU(sku);

        if (!variant) {
            return next(new ErrorHandler("Variant not found", 404));
        }

        res.status(200).json({
            success: true,
            variant,
        });
    } catch (error) {
        next(error);
    }
};

// Create single variant
exports.createVariant = async (req, res, next) => {
    try {
        const { productId, color, size, stockQuantity, price, offerPrice, image, imagePublicId } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Validate variant data
        const validation = validateVariant({ color, size, stockQuantity, price, offerPrice });
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.errors,
            });
        }

        // Check for duplicate
        const isDuplicate = await checkDuplicateVariant(productId, color, size);
        if (isDuplicate) {
            return res.status(400).json({
                success: false,
                message: `Variant with color '${color}' and size '${size}' already exists for this product`,
            });
        }

        // Generate SKU
        const sku = generateSKU(product.productName, color, size);

        // Create variant
        const variant = await ProductVariant.create({
            productId,
            sku,
            color: color.toLowerCase().trim(),
            size: size.toUpperCase().trim(),
            stockQuantity: stockQuantity || 0,
            price,
            offerPrice,
            image,
            imagePublicId,
        });

        // Update product cache
        await updateProductVariantCache(productId);

        res.status(201).json({
            success: true,
            variant,
            message: "Variant created successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Bulk create variants
exports.bulkCreateVariants = async (req, res, next) => {
    try {
        const { productId, variants } = req.body;

        if (!variants || !Array.isArray(variants) || variants.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Variants array is required and must not be empty",
            });
        }

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        // Bulk create
        const result = await bulkCreateVariants(productId, variants, product.productName);

        res.status(201).json({
            success: true,
            message: `Created ${result.success} variants successfully`,
            created: result.created,
            errors: result.errors,
            summary: {
                total: variants.length,
                success: result.success,
                failed: result.failed,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update variant
exports.updateVariant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { color, size, stockQuantity, price, offerPrice, image, imagePublicId, isActive } = req.body;

        const variant = await ProductVariant.findById(id);
        if (!variant) {
            return next(new ErrorHandler("Variant not found", 404));
        }

        // If color or size is being changed, check for duplicates
        if ((color && color !== variant.color) || (size && size !== variant.size)) {
            const newColor = color || variant.color;
            const newSize = size || variant.size;

            const isDuplicate = await checkDuplicateVariant(variant.productId, newColor, newSize, id);
            if (isDuplicate) {
                return res.status(400).json({
                    success: false,
                    message: `Variant with color '${newColor}' and size '${newSize}' already exists`,
                });
            }
        }

        // Validate if provided
        if (color || size || stockQuantity !== undefined || price !== undefined || offerPrice !== undefined) {
            const validation = validateVariant({
                color: color || variant.color,
                size: size || variant.size,
                stockQuantity: stockQuantity !== undefined ? stockQuantity : variant.stockQuantity,
                price: price !== undefined ? price : variant.price,
                offerPrice: offerPrice !== undefined ? offerPrice : variant.offerPrice,
            });

            if (!validation.isValid) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validation.errors,
                });
            }
        }

        // Handle image update (delete old if new is provided)
        if (image && image !== variant.image && variant.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(variant.imagePublicId);
            } catch (clErr) {
                console.error("Cloudinary destroy failed:", clErr?.message || clErr);
            }
        }

        // Update variant
        if (color) variant.color = color.toLowerCase().trim();
        if (size) variant.size = size.toUpperCase().trim();
        if (stockQuantity !== undefined) variant.stockQuantity = stockQuantity;
        if (price !== undefined) variant.price = price;
        if (offerPrice !== undefined) variant.offerPrice = offerPrice;
        if (image !== undefined) variant.image = image;
        if (imagePublicId !== undefined) variant.imagePublicId = imagePublicId;
        if (isActive !== undefined) variant.isActive = isActive;

        await variant.save();

        // Update product cache
        await updateProductVariantCache(variant.productId);

        res.status(200).json({
            success: true,
            variant,
            message: "Variant updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Delete variant
exports.deleteVariant = async (req, res, next) => {
    try {
        const { id } = req.params;

        const variant = await ProductVariant.findById(id);
        if (!variant) {
            return next(new ErrorHandler("Variant not found", 404));
        }

        const productId = variant.productId;

        // Delete variant image from cloudinary if exists
        if (variant.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(variant.imagePublicId);
            } catch (clErr) {
                console.error("Cloudinary destroy failed:", clErr?.message || clErr);
            }
        }

        await variant.deleteOne();

        // Update product cache
        await updateProductVariantCache(productId);

        res.status(200).json({
            success: true,
            message: "Variant deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Update variant stock (for order processing)
exports.updateVariantStock = async (req, res, next) => {
    try {
        const { sku } = req.params;
        const { quantity, operation } = req.body; // operation: 'increase' or 'decrease'

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0",
            });
        }

        const variant = await getVariantBySKU(sku);
        if (!variant) {
            return next(new ErrorHandler("Variant not found", 404));
        }

        if (operation === "decrease") {
            await variant.decreaseStock(quantity);
        } else if (operation === "increase") {
            await variant.increaseStock(quantity);
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid operation. Use 'increase' or 'decrease'",
            });
        }

        // Update product cache
        await updateProductVariantCache(variant.productId);

        res.status(200).json({
            success: true,
            message: `Stock ${operation}d successfully`,
            variant: {
                sku: variant.sku,
                stockQuantity: variant.stockQuantity,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get available sizes for a color
exports.getAvailableSizes = async (req, res, next) => {
    try {
        const { productId, color } = req.query;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const sizes = await ProductVariant.getAvailableSizes(productId, color);

        res.status(200).json({
            success: true,
            sizes,
        });
    } catch (error) {
        next(error);
    }
};

// Get available colors for a product
exports.getAvailableColors = async (req, res, next) => {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const colors = await ProductVariant.getAvailableColors(productId);

        res.status(200).json({
            success: true,
            colors,
        });
    } catch (error) {
        next(error);
    }
};
