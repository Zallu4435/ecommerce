const Product = require("../model/Products");
const ErrorHandler = require("../utils/ErrorHandler");
const Review = require("../model/Review");
const cloudinary = require("cloudinary").v2;
const Category = require("../model/Categories");
const { calculateBestPrice } = require("../utils/orderHelper");

// Configure Cloudinary from environment variables if present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

exports.getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const searchFilter = search
      ? { productName: { $regex: search, $options: "i" } }
      : {};

    const products = await Product.find(searchFilter)
      .select("productName category brand basePrice baseOfferPrice originalPrice offerPrice image")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalProducts = await Product.countDocuments(searchFilter);

    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
        totalProducts: 0,
        currentPage: pageNumber,
        totalPages: 0,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      products: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        basePrice: product.basePrice || product.originalPrice,
        baseOfferPrice: product.baseOfferPrice || product.offerPrice,
        originalPrice: product.basePrice || product.originalPrice,
        offerPrice: product.baseOfferPrice || product.offerPrice,
        image: product.image,
      })),
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllShopProducts = async (req, res, next) => {
  try {
    const products = await Product.find().lean();

    res.status(200).json({
      success: true,
      products: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        basePrice: product.basePrice || product.originalPrice,
        baseOfferPrice: product.baseOfferPrice || product.offerPrice,
        originalPrice: product.basePrice || product.originalPrice,
        offerPrice: product.baseOfferPrice || product.offerPrice,
        image: product.image,
        sizeOption: product.sizeOption,
        stockQuantity: product.stockQuantity,
        colorOption: product.colorOption,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Get variants
    const ProductVariant = require("../model/ProductVariants");
    const { includeInactive } = req.query;
    const variantQuery = { productId: product._id };

    // Only filter by isActive if includeInactive is not true
    if (includeInactive !== 'true') {
      variantQuery.isActive = true;
    }

    const variants = await ProductVariant.find(variantQuery).sort({ color: 1, size: 1 });

    const reviews = await Review.find({ productId: product._id }).populate(
      "userId",
      "username avatar"
    );

    console.log(`DEBUG: getProductDetails - ProductID: ${product._id}, Reviews Found: ${reviews.length}`);
    if (reviews.length > 0) {
      console.log("Sample Review ProductID:", reviews[0].productId);
    }

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    // Use calculateBestPrice to get consistent offer info
    const priceResult = await calculateBestPrice(product, null);

    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        averageRating,
        totalReviews,
        reviews,
        variants, // Include variants
        offerInfo: priceResult.offerInfo, // Use standardized offer info
        offerPrice: priceResult.price,
        originalPrice: product.basePrice,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const products = await Product.find({ category }).sort({ rating: -1 });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    const productIds = products.map((product) => product._id);
    const reviews = await Review.find({ productId: { $in: productIds } });

    const reviewsByProductId = reviews.reduce((acc, review) => {
      if (!acc[review.productId]) {
        acc[review.productId] = [];
      }
      acc[review.productId].push(review);
      return acc;
    }, {});

    const productsWithRatings = await Promise.all(products.map(async (product) => {
      const productReviews = reviewsByProductId[product._id] || [];
      const totalReviews = productReviews.length;
      const averageRating = totalReviews
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
        totalReviews
        : 0;

      const priceResult = await calculateBestPrice(product, null);

      return {
        ...product.toObject(),
        originalPrice: product.basePrice,
        offerPrice: priceResult.price,
        offerInfo: priceResult.offerInfo,
        averageRating,
        totalReviews,
      };
    }));

    res.status(200).json(productsWithRatings);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    let { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    q = q.replace(/[^a-zA-Z0-9\s]/g, "").trim();

    if (q.length === 0) {
      return res.status(400).json({
        message: "Search query is empty after removing special characters",
      });
    }

    const regexQuery = {
      productName: { $regex: q.split("").join(".*"), $options: "i" },
    };

    const products = await Product.find(regexQuery)
      .limit(10)
      .select({
        productName: 1,
        image: 1,
        category: 1,
        brand: 1,
        basePrice: 1,
        baseOfferPrice: 1,
        originalPrice: 1,
        offerPrice: 1
      });

    if (products.length === 0) {
      const fallbackRegexQuery = { productName: { $regex: q, $options: "i" } };
      const fallbackProducts = await Product.find(fallbackRegexQuery)
        .limit(10)
        .select({
          productName: 1,
          image: 1,
          category: 1,
          brand: 1,
          basePrice: 1,
          baseOfferPrice: 1,
          originalPrice: 1,
          offerPrice: 1
        });

      return res.json(fallbackProducts);
    }

    res.json(products);
  } catch (error) {
    console.error("Error occurred:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getFilteredProducts = async (req, res) => {
  try {
    let {
      sizes,
      colors,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10,
      category,
      brand,
      search,
    } = req.query;

    if (category.toLowerCase() === "childrens") {
      category = "child";
    } else if (category.toLowerCase() === "womens") {
      category = "women";
    } else if (category.toLowerCase() === "mens") {
      category = "men";
    }

    const query = {};

    if (sizes && sizes !== "") {
      query.availableSizes = { $in: sizes.split(",") };
    }

    if (colors && colors !== "") {
      query.availableColors = { $in: colors.split(",").map(c => new RegExp(c, 'i')) };
    }

    // Gender Filter
    const { gender } = req.query;
    if (gender && gender !== "") {
      query.availableGenders = { $in: gender.split(",").map(g => new RegExp("^" + g + "$", "i")) };
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (category && category !== "null" && category !== "") {
      query.category = { $regex: new RegExp("^" + category + "$", "i") };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    if (search) {
      query.productName = { $regex: search, $options: "i" };
    }

    const sortOptions = {
      priceLowToHigh: { basePrice: 1 },
      priceHighToLow: { basePrice: -1 },
      newArrivals: { createdAt: -1 },
      aToZ: { productName: 1 },
      zToA: { productName: -1 },
    };

    const products = await Product.find(query)
      .sort(sortOptions[sortBy] || {})
      .skip((page - 1) * limit)
      .limit(Number(limit));


    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviews = await Review.find({ productId: product._id });

        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            totalReviews
            : 0;

        const priceResult = await calculateBestPrice(product, null);

        return {
          ...product.toObject(),
          originalPrice: product.basePrice,
          offerPrice: priceResult.price,
          offerInfo: priceResult.offerInfo,
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews,
        };
      })
    );

    const total = await Product.countDocuments(query);

    res.json({
      products: productsWithReviews,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    console.error(error, "Error Fetching Products");
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { productName, basePrice, baseOfferPrice, brand, category, image, imagePublicId, variants } = req.body;

    // Validation
    if (!productName || productName.trim() === "") {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }
    if (!brand || brand.trim() === "") {
      return res.status(400).json({ success: false, message: "Brand is required" });
    }
    if (!category || String(category).trim() === "") {
      return res.status(400).json({ success: false, message: "Category is required" });
    }
    if (!image || String(image).trim() === "") {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    if (basePrice === undefined || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      return res.status(400).json({ success: false, message: "Base price must be a positive number" });
    }
    if (baseOfferPrice !== undefined && (isNaN(Number(baseOfferPrice)) || Number(baseOfferPrice) <= 0)) {
      return res.status(400).json({ success: false, message: "Base offer price must be a positive number" });
    }
    if (baseOfferPrice !== undefined && Number(baseOfferPrice) > Number(basePrice)) {
      return res.status(400).json({ success: false, message: "Base offer price cannot be greater than base price" });
    }
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ success: false, message: "At least one variant is required" });
    }

    const normalizedProductName = productName.trim().toLowerCase();

    // Validate category exists (case-insensitive) and normalize to stored categoryName
    const categoryDoc = await Category.findOne({
      categoryName: { $regex: `^${String(category).trim()}$`, $options: "i" },
    });
    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    // Check for existing product
    const existingProduct = await Product.findOne({
      productName: { $regex: `^${normalizedProductName}$`, $options: "i" },
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "A product with the same name already exists.",
      });
    }

    // Create product
    let product;
    try {
      product = await Product.create({
        productName: normalizedProductName,
        brand: brand.trim(),
        category: categoryDoc.categoryName,
        description: req.body.description,
        returnPolicy: req.body.returnPolicy,
        basePrice: Number(basePrice),
        baseOfferPrice: baseOfferPrice ? Number(baseOfferPrice) : undefined,
        image,
        imagePublicId,
        status: req.body.status || "active",
        createdBy: req.body.createdBy,
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(400).json({ success: false, message: "A product with the same name already exists" });
      }
      throw err;
    }

    // Create variants using bulk utility
    const { bulkCreateVariants } = require("../utils/variantUtils");
    const variantResult = await bulkCreateVariants(product._id, variants, product.productName);

    if (variantResult.failed > 0) {
      return res.status(400).json({
        success: false,
        message: "Product created but some variants failed",
        product,
        variantErrors: variantResult.errors,
        variantsCreated: variantResult.success,
        variantsFailed: variantResult.failed,
      });
    }

    res.status(201).json({
      success: true,
      product,
      variants: variantResult.created,
      message: `Product created with ${variantResult.success} variants`,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productName, basePrice, baseOfferPrice, brand, category, image, imagePublicId } = req.body;

    let product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Check for duplicate product name
    if (productName) {
      const normalizedProductName = productName.trim().toLowerCase();
      const existingProduct = await Product.findOne({
        productName: { $regex: `^${normalizedProductName}$`, $options: "i" },
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "A product with the same name already exists.",
        });
      }
    }

    // Validate optional fields if provided
    if (brand !== undefined && brand.trim() === "") {
      return res.status(400).json({ success: false, message: "Brand cannot be empty" });
    }
    if (category !== undefined && String(category).trim() === "") {
      return res.status(400).json({ success: false, message: "Category cannot be empty" });
    }
    if (image !== undefined && String(image).trim() === "") {
      return res.status(400).json({ success: false, message: "Image cannot be empty" });
    }
    if (basePrice !== undefined && (isNaN(Number(basePrice)) || Number(basePrice) <= 0)) {
      return res.status(400).json({ success: false, message: "Base price must be a positive number" });
    }
    if (baseOfferPrice !== undefined && (isNaN(Number(baseOfferPrice)) || Number(baseOfferPrice) <= 0)) {
      return res.status(400).json({ success: false, message: "Base offer price must be a positive number" });
    }
    if (
      baseOfferPrice !== undefined &&
      (basePrice !== undefined ? Number(baseOfferPrice) > Number(basePrice) : Number(baseOfferPrice) > Number(product.basePrice))
    ) {
      return res.status(400).json({ success: false, message: "Base offer price cannot be greater than base price" });
    }

    try {
      // If a new image is provided and different from the existing one, delete the old image from Cloudinary
      const isImageChanging = image !== undefined && image !== product.image;
      if (isImageChanging && product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(product.imagePublicId);
        } catch (clErr) {
          console.error("Cloudinary destroy failed:", clErr?.message || clErr);
        }
      }

      // Build update payload
      let updatePayload = {};
      if (productName) updatePayload.productName = productName.trim().toLowerCase();
      if (brand) updatePayload.brand = brand.trim();
      if (category) {
        // Validate and normalize category
        const categoryDoc = await Category.findOne({
          categoryName: { $regex: `^${String(category).trim()}$`, $options: "i" },
        });
        if (!categoryDoc) {
          return res.status(400).json({ success: false, message: "Invalid category" });
        }
        updatePayload.category = categoryDoc.categoryName;
      }
      if (req.body.description !== undefined) updatePayload.description = req.body.description;
      if (req.body.returnPolicy !== undefined) updatePayload.returnPolicy = req.body.returnPolicy;
      if (basePrice !== undefined) updatePayload.basePrice = Number(basePrice);
      if (baseOfferPrice !== undefined) updatePayload.baseOfferPrice = Number(baseOfferPrice);
      if (image !== undefined) updatePayload.image = image;
      if (imagePublicId !== undefined) updatePayload.imagePublicId = imagePublicId;
      if (req.body.status !== undefined) updatePayload.status = req.body.status;
      if (req.body.updatedBy !== undefined) updatePayload.updatedBy = req.body.updatedBy;

      product = await Product.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(400).json({ success: false, message: "A product with the same name already exists" });
      }
      throw err;
    }

    res.status(200).json({
      success: true,
      product,
      message: "Product updated successfully. Use variant endpoints to manage variants.",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Delete all variants and their images
    const ProductVariant = require("../model/ProductVariants");
    const variants = await ProductVariant.find({ productId: product._id });

    for (const variant of variants) {
      if (variant.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(variant.imagePublicId);
        } catch (clErr) {
          console.error("Cloudinary destroy failed for variant:", clErr?.message || clErr);
        }
      }
    }

    await ProductVariant.deleteMany({ productId: product._id });

    // Delete product main image from Cloudinary
    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (clErr) {
        console.error("Cloudinary destroy failed:", clErr?.message || clErr);
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product and all variants deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getPopularProducts = async (req, res) => {
  try {
    // Fetch active products with stock, sorted by newest first
    // Since we don't have a persistent 'rating' or 'popularity' field, we use createdAt as a proxy for trending
    const products = await Product.find({
      status: "active",
      totalStock: { $gt: 0 }
    })
      .sort({ createdAt: -1 })
      .limit(8);

    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviews = await Review.find({ productId: product._id });

        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
            totalReviews
            : 0;

        // Calculate best price with offer info
        const priceResult = await calculateBestPrice(product, null);

        // Ensure we handle price fields safely
        return {
          ...product.toObject(),
          originalPrice: product.basePrice,
          offerPrice: priceResult.price,
          offerInfo: priceResult.offerInfo,
          averageRating: Number(averageRating.toFixed(1)),
          totalReviews,
        };
      })
    );

    res.status(200).json(productsWithReviews);
  } catch (error) {
    console.error("Error in getPopularProducts:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular products",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
