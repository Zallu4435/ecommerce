const ProductVariant = require("../model/ProductVariants");
const Product = require("../model/Products");

/**
 * Generate unique SKU for a variant
 * Format: PRODUCTNAME-COLOR-SIZE-TIMESTAMP
 * Example: NIKE-TSHIRT-BLK-M-1704461234
 */
const generateSKU = (productName, color, size) => {
    const cleanProductName = productName
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .substring(0, 20);

    const cleanColor = color.substring(0, 3).toUpperCase();
    const cleanSize = size.toUpperCase();
    const timestamp = Date.now().toString().substring(7); // Last 6 digits

    return `${cleanProductName}-${cleanColor}-${cleanSize}-${timestamp}`;
};

/**
 * Update product's cached variant data
 * Updates: totalStock, availableColors, availableSizes, hasVariants, variantCount
 */
const updateProductVariantCache = async (productId) => {
    try {
        const variants = await ProductVariant.find({
            productId,
            isActive: true
        });

        // Calculate total stock
        const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0);

        // Get unique colors (only from in-stock variants)
        const availableColors = [
            ...new Set(
                variants
                    .filter((v) => v.stockQuantity > 0)
                    .map((v) => v.color)
            ),
        ];

        // Get unique sizes (only from in-stock variants)
        const availableSizes = [
            ...new Set(
                variants
                    .filter((v) => v.stockQuantity > 0)
                    .map((v) => v.size)
            ),
        ];

        // Update product
        await Product.findByIdAndUpdate(productId, {
            totalStock,
            availableColors,
            availableSizes,
            hasVariants: variants.length > 0,
            variantCount: variants.length,
        });

        return {
            totalStock,
            availableColors,
            availableSizes,
            variantCount: variants.length,
        };
    } catch (error) {
        console.error("Error updating product variant cache:", error);
        throw error;
    }
};

/**
 * Validate variant data
 */
const validateVariant = (variantData) => {
    const errors = [];

    if (!variantData.color || variantData.color.trim() === "") {
        errors.push("Color is required");
    }

    if (!variantData.size || variantData.size.trim() === "") {
        errors.push("Size is required");
    }

    if (variantData.stockQuantity === undefined || variantData.stockQuantity < 0) {
        errors.push("Stock quantity must be 0 or greater");
    }

    if (variantData.price !== undefined && variantData.price < 0) {
        errors.push("Price must be 0 or greater");
    }

    if (variantData.offerPrice !== undefined && variantData.offerPrice < 0) {
        errors.push("Offer price must be 0 or greater");
    }

    if (
        variantData.offerPrice !== undefined &&
        variantData.price !== undefined &&
        variantData.offerPrice > variantData.price
    ) {
        errors.push("Offer price cannot be greater than price");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Check if variant combination already exists for a product
 */
const checkDuplicateVariant = async (productId, color, size, excludeVariantId = null) => {
    const query = {
        productId,
        color: color.toLowerCase().trim(),
        size: size.toUpperCase().trim(),
    };

    if (excludeVariantId) {
        query._id = { $ne: excludeVariantId };
    }

    const existing = await ProductVariant.findOne(query);
    return existing !== null;
};

/**
 * Get variant by SKU
 */
const getVariantBySKU = async (sku) => {
    return await ProductVariant.findOne({ sku: sku.toUpperCase() }).populate("productId");
};

/**
 * Get all variants for a product with stock status
 */
const getProductVariantsWithStatus = async (productId) => {
    const variants = await ProductVariant.find({ productId }).sort({ color: 1, size: 1 });

    return variants.map((variant) => ({
        ...variant.toObject(),
        inStock: variant.stockQuantity > 0,
        lowStock: variant.stockQuantity > 0 && variant.stockQuantity <= 10,
    }));
};

/**
 * Bulk create variants for a product
 */
const bulkCreateVariants = async (productId, variantsData, productName) => {
    const createdVariants = [];
    const errors = [];

    for (let i = 0; i < variantsData.length; i++) {
        const variantData = variantsData[i];

        // Validate
        const validation = validateVariant(variantData);
        if (!validation.isValid) {
            errors.push({
                index: i,
                data: variantData,
                errors: validation.errors,
            });
            continue;
        }

        // Check duplicate
        const isDuplicate = await checkDuplicateVariant(
            productId,
            variantData.color,
            variantData.size
        );

        if (isDuplicate) {
            errors.push({
                index: i,
                data: variantData,
                errors: [`Variant with color '${variantData.color}' and size '${variantData.size}' already exists`],
            });
            continue;
        }

        // Generate SKU
        const sku = generateSKU(productName, variantData.color, variantData.size);

        // Create variant
        try {
            const variant = await ProductVariant.create({
                productId,
                sku,
                color: variantData.color.toLowerCase().trim(),
                size: variantData.size.toUpperCase().trim(),
                stockQuantity: variantData.stockQuantity || 0,
                price: variantData.price,
                offerPrice: variantData.offerPrice,
                image: variantData.image,
                imagePublicId: variantData.imagePublicId,
                isActive: variantData.isActive !== undefined ? variantData.isActive : true,
            });

            createdVariants.push(variant);
        } catch (error) {
            errors.push({
                index: i,
                data: variantData,
                errors: [error.message],
            });
        }
    }

    // Update product cache
    if (createdVariants.length > 0) {
        await updateProductVariantCache(productId);
    }

    return {
        created: createdVariants,
        errors,
        success: createdVariants.length,
        failed: errors.length,
    };
};

/**
 * Delete all variants for a product
 */
const deleteProductVariants = async (productId) => {
    const result = await ProductVariant.deleteMany({ productId });
    await updateProductVariantCache(productId);
    return result;
};

module.exports = {
    generateSKU,
    updateProductVariantCache,
    validateVariant,
    checkDuplicateVariant,
    getVariantBySKU,
    getProductVariantsWithStatus,
    bulkCreateVariants,
    deleteProductVariants,
};
