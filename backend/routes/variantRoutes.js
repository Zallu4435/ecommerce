const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncError");
const {
    getProductVariants,
    getVariantById,
    getVariantBySKU,
    createVariant,
    bulkCreateVariants,
    updateVariant,
    deleteVariant,
    updateVariantStock,
    getAvailableSizes,
    getAvailableColors,
} = require("../controller/variantController");

// Get all variants for a product
router.get("/product/:productId", catchAsyncErrors(getProductVariants));

// Get single variant by ID
router.get("/:id", catchAsyncErrors(getVariantById));

// Get variant by SKU
router.get("/sku/:sku", catchAsyncErrors(getVariantBySKU));

// Get available colors for a product
router.get("/colors/available", catchAsyncErrors(getAvailableColors));

// Get available sizes for a product (optionally filtered by color)
router.get("/sizes/available", catchAsyncErrors(getAvailableSizes));

// Create single variant
router.post("/create", catchAsyncErrors(createVariant));

// Bulk create variants
router.post("/bulk-create", catchAsyncErrors(bulkCreateVariants));

// Update variant
router.put("/update/:id", catchAsyncErrors(updateVariant));

// Update variant stock (for order processing)
router.patch("/stock/:sku", catchAsyncErrors(updateVariantStock));

// Delete variant
router.delete("/delete/:id", catchAsyncErrors(deleteVariant));

module.exports = router;
