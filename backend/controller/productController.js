const Product = require("../model/Products");
const ErrorHandler = require("../utils/ErrorHandler");
const Review = require("../model/Review");
const cloudinary = require("cloudinary").v2;
const Category = require("../model/Categories");

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
      .select("productName category brand originalPrice offerPrice image")
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

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
        originalPrice: product.originalPrice,
        offerPrice: product.offerPrice,
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
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        originalPrice: product.originalPrice,
        offerPrice: product.offerPrice,
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

    const reviews = await Review.find({ productId: product._id }).populate(
      "userId",
      "username avatar"
    );

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        averageRating,
        totalReviews,
        reviews,
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

    const productsWithRatings = products.map((product) => {
      const productReviews = reviewsByProductId[product._id] || [];
      const totalReviews = productReviews.length;
      const averageRating = totalReviews
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

      return {
        ...product.toObject(),
        averageRating,
        totalReviews,
      };
    });

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

    q = q.replace(/[^a-zA-Z0-9]/g, "").trim();

    if (q.length === 0) {
      return res.status(400).json({
        message: "Search query is empty after removing special characters",
      });
    }

    const regexQuery = {
      productName: { $regex: q.split("").join(".*"), $options: "i" },
    };

    const products = await Product.find(regexQuery).limit(10);

    if (products.length === 0) {
      const fallbackRegexQuery = { productName: { $regex: q, $options: "i" } };
      const fallbackProducts = await Product.find(fallbackRegexQuery).limit(10);

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
      query.sizeOption = { $in: sizes.split(",") };
    }

    if (colors && colors !== "") {
      query.colorOption = { $in: colors.split(",") };
    }

    if (minPrice || maxPrice) {
      query.originalPrice = {};
      if (minPrice) query.originalPrice.$gte = Number(minPrice);
      if (maxPrice) query.originalPrice.$lte = Number(maxPrice);
    }

    if (category && category !== "null" && category !== "") {
      query.category = { $regex: new RegExp("^" + category + "$", "i") };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    const sortOptions = {
      priceLowToHigh: { originalPrice: 1 },
      priceHighToLow: { originalPrice: -1 },
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

        return {
          ...product.toObject(),
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
    const { productName, originalPrice, offerPrice, stockQuantity, category, image, imagePublicId } = req.body;

    if (!productName || productName.trim() === "") {
      return res.status(400).json({ success: false, message: "Product name is required" });
    }
    if (!category || String(category).trim() === "") {
      return res.status(400).json({ success: false, message: "Category is required" });
    }
    if (!image || String(image).trim() === "") {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    if (originalPrice === undefined || isNaN(Number(originalPrice)) || Number(originalPrice) <= 0) {
      return res.status(400).json({ success: false, message: "Original price must be a positive number" });
    }
    if (offerPrice === undefined || isNaN(Number(offerPrice)) || Number(offerPrice) <= 0) {
      return res.status(400).json({ success: false, message: "Offer price must be a positive number" });
    }
    if (Number(offerPrice) > Number(originalPrice)) {
      return res.status(400).json({ success: false, message: "Offer price cannot be greater than original price" });
    }
    if (stockQuantity === undefined || isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) {
      return res.status(400).json({ success: false, message: "Stock quantity must be a non-negative integer" });
    }

    const normalizedProductName = productName.trim().toLowerCase();

    // Validate category exists (case-insensitive) and normalize to stored categoryName
    const categoryDoc = await Category.findOne({
      categoryName: { $regex: `^${String(category).trim()}$`, $options: "i" },
    });
    if (!categoryDoc) {
      return res.status(400).json({ success: false, message: "Invalid category" });
    }

    const existingProduct = await Product.findOne({
      productName: { $regex: `^${normalizedProductName}$`, $options: "i" },
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "A product with the same name already exists.",
      });
    }

    let product;
    try {
      product = await Product.create({
        ...req.body,
        image,
        imagePublicId,
        productName: normalizedProductName,
        category: categoryDoc.categoryName,
      });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(400).json({ success: false, message: "A product with the same name already exists" });
      }
      throw err;
    }

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productName, originalPrice, offerPrice, stockQuantity, category, image, imagePublicId } = req.body;

    const normalizedProductName = productName.trim().toLowerCase();

    let product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

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

    // Validate optional fields if provided
    if (category !== undefined && String(category).trim() === "") {
      return res.status(400).json({ success: false, message: "Category cannot be empty" });
    }
    if (image !== undefined && String(image).trim() === "") {
      return res.status(400).json({ success: false, message: "Image cannot be empty" });
    }
    if (originalPrice !== undefined) {
      if (isNaN(Number(originalPrice)) || Number(originalPrice) <= 0) {
        return res.status(400).json({ success: false, message: "Original price must be a positive number" });
      }
    }
    if (offerPrice !== undefined) {
      if (isNaN(Number(offerPrice)) || Number(offerPrice) <= 0) {
        return res.status(400).json({ success: false, message: "Offer price must be a positive number" });
      }
    }
    if (offerPrice !== undefined && (originalPrice !== undefined ? Number(offerPrice) > Number(originalPrice) : Number(offerPrice) > Number(product.originalPrice))) {
      return res.status(400).json({ success: false, message: "Offer price cannot be greater than original price" });
    }
    if (stockQuantity !== undefined && (isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0)) {
      return res.status(400).json({ success: false, message: "Stock quantity must be a non-negative integer" });
    }

    try {
      // If a new image is provided and different from the existing one, delete the old image from Cloudinary
      const isImageChanging = image !== undefined && image !== product.image;
      if (isImageChanging && product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(product.imagePublicId);
        } catch (clErr) {
          // Log and continue; failure to delete should not block the update
          console.error("Cloudinary destroy failed:", clErr?.message || clErr);
        }
      }

      // If category provided, validate and normalize
      let updatePayload = { ...req.body, image, imagePublicId, productName: normalizedProductName };
      if (category !== undefined) {
        const categoryDoc = await Category.findOne({
          categoryName: { $regex: `^${String(category).trim()}$`, $options: "i" },
        });
        if (!categoryDoc) {
          return res.status(400).json({ success: false, message: "Invalid category" });
        }
        updatePayload.category = categoryDoc.categoryName;
      }

      product = await Product.findByIdAndUpdate(
        id,
        updatePayload,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(400).json({ success: false, message: "A product with the same name already exists" });
      }
      throw err;
    }

    res.status(200).json({
      success: true,
      product,
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

    // Attempt to delete image from Cloudinary first
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
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getPopularProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ rating: -1 }).limit(8);

    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviews = await Review.find({ productId: product._id });

        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
              totalReviews
            : 0;

        return {
          ...product.toObject(),
          averageRating,
          totalReviews,
        };
      })
    );

    res.status(200).json(productsWithReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
