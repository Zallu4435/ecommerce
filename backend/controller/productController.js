const Product = require("../model/Products");
const ErrorHandler = require("../utils/ErrorHandler");
const Review = require('../model/Review');

// Get all products (User and Admin)
// exports.getAllProducts = async (req, res, next) => {
//   try {
//     const products = await Product.find(); // Get all products from the database

//     // Send back the products array with desired fields
//     res.status(200).json({
//       success: true,
//       products: products.map((product) => ({
//         id: product._id,
//         productName: product.productName,
//         category: product.category,
//         brand: product.brand,
//         originalPrice: product.originalPrice,
//         offerPrice: product.offerPrice,
//       })),
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getAllProducts = async (req, res, next) => {
  try {
    // Get page, limit, and search from query params
    const { page, limit, search } = req.query;

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = parseInt(limit) > 0 ? parseInt(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Search filter
    const searchFilter = search
      ? { productName: { $regex: search, $options: 'i' } } // Case-insensitive search by product name
      : {};

    // Find products with pagination and search filter
    const products = await Product.find(searchFilter)
      .select('productName category brand originalPrice offerPrice image') // Select fields you want to return
      .skip(skip)
      .limit(limitNumber);

    // Get the total count of products for pagination metadata
    const totalProducts = await Product.countDocuments(searchFilter);

    // Check if there are any products in the database
    if (!products || products.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
        totalProducts: 0,
        currentPage: pageNumber,
        totalPages: 0,
        message: 'No products found',
      });
    }

    // Send paginated data
    res.status(200).json({
      success: true,
      products: products.map((product) => ({
        id: product._id,
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        originalPrice: product.originalPrice,
        offerPrice: product.offerPrice,
        image: product.image, // Include image field if necessary
      })),
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getAllShopProducts = async (req, res, next) => {
  try {
    const products = await Product.find(); // Get all products from the database

    // console.log(products, "products")
    // Send back the products array with desired fields
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
    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Fetch reviews for this product
    const reviews = await Review.find({ productId: product._id }).populate('userId', 'username avatar'); // Populate user details (optional)

    // Calculate average rating and total reviews
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : 0;

    // Send product details and reviews
    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        averageRating,   // Add average rating
        totalReviews,    // Add total reviews count
        reviews,         // Add reviews array
      },
    });
  } catch (error) {
    next(error);
  }
};


exports.getRelatedProducts = async (req, res) => {
  try {
    const { category } = req.query; // Get the category from query parameters

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Fetch products based on the category
    const products = await Product.find({ category }).sort({ rating: -1 }); // Adjust sorting as needed

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    // Fetch reviews for these products from the Review collection
    const productIds = products.map((product) => product._id); // Get product IDs
    const reviews = await Review.find({ productId: { $in: productIds } }); // Get reviews for products

    // Index reviews by productId for easy lookup
    const reviewsByProductId = reviews.reduce((acc, review) => {
      if (!acc[review.productId]) {
        acc[review.productId] = [];
      }
      acc[review.productId].push(review); // Add review to the array of its corresponding productId
      return acc;
    }, {});

    // Map over products and calculate the average rating and number of reviews
    const productsWithRatings = products.map((product) => {
      const productReviews = reviewsByProductId[product._id] || []; // Get reviews for this product
      const totalReviews = productReviews.length; // Total number of reviews
      const averageRating = totalReviews
        ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0; // Calculate average rating if there are reviews

      return {
        ...product.toObject(), // Convert the product document to plain object
        averageRating, // Add average rating field
        totalReviews,   // Add total number of reviews field
      };
    });

    res.status(200).json(productsWithRatings); // Send products with average rating and total reviews
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.searchProducts = async (req, res) => {
  try {
    let { q } = req.query;

    // Validate search query
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Remove special characters from the query
    q = q.replace(/[^a-zA-Z0-9]/g, '').trim(); // Removes all non-alphanumeric characters

    if (q.length === 0) {
      return res.status(400).json({ message: "Search query is empty after removing special characters" });
    }

    // Use regex to match the query, including words with special characters
    const regexQuery = { productName: { $regex: q.split('').join('.*'), $options: "i" } };

    // Find products using the regex search
    const products = await Product.find(regexQuery).limit(10);

    // If no products found, try a fallback search
    if (products.length === 0) {
      const fallbackRegexQuery = { productName: { $regex: q, $options: "i" } };
      const fallbackProducts = await Product.find(fallbackRegexQuery).limit(10);

      // Return fallback results or an empty array if no matches found
      return res.json(fallbackProducts);
    }

    // Respond with the results
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
      brand
    } = req.query;

    if(category.toLowerCase() === 'childrens') {
      category = 'child'
    }else  if(category.toLowerCase() === 'womens') {
      category = 'women'
    }else  if(category.toLowerCase() === 'mens') {
      category = 'men'
    }

    // Initialize the query object
    const query = {};

    // Apply size filter if provided
    if (sizes && sizes !== '') {
      query.sizeOption = { $in: sizes.split(',') };
    }

    // Apply color filter if provided
    if (colors && colors !== '') {
      query.colorOption = { $in: colors.split(',') };
    }

    // Apply price range filter if provided
    if (minPrice || maxPrice) {
      query.originalPrice = {};
      if (minPrice) query.originalPrice.$gte = Number(minPrice);
      if (maxPrice) query.originalPrice.$lte = Number(maxPrice);
    }

    // Apply category filter if provided (handle 'null' or empty string)
    if (category && category !== 'null' && category !== '') {
      query.category = { $regex: new RegExp('^' + category + '$', 'i') }; // Case-insensitive regex
    }

    // Apply brand filter if provided
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' }; // Case-insensitive search for brand
    }

    console.log(query, 'Generated Query');

    // Define sorting options
    const sortOptions = {
      priceLowToHigh: { originalPrice: 1 },
      priceHighToLow: { originalPrice: -1 },
      newArrivals: { createdAt: -1 },
      aToZ: { productName: 1 },
      zToA: { productName: -1 }
    };

    // Fetch filtered or all products with pagination and sorting
    const products = await Product.find(query)
      .sort(sortOptions[sortBy] || {}) // Default to no sorting if `sortBy` is undefined
      .skip((page - 1) * limit) // Skip documents for pagination
      .limit(Number(limit)); // Limit the number of documents per page

    // Fetch reviews for each product and calculate average rating and total reviews
    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviews = await Review.find({ productId: product._id });

        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
            : 0;

        return {
          ...product.toObject(),
          averageRating: Number(averageRating.toFixed(1)), // Include average rating
          totalReviews // Include total review count
        };
      })
    );

    console.log(productsWithReviews, 'Products with Reviews');

    // Calculate total number of matching products
    const total = await Product.countDocuments(query);

    // Respond with the results
    res.json({
      products: productsWithReviews,
      totalPages: Math.ceil(total / limit), // Calculate total pages
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error(error, 'Error Fetching Products');
    res.status(500).json({ message: error.message });
  }
};


exports.createProduct = async (req, res, next) => {
  try {
    // console.log(req.body, "body from the products ")
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    console.log("reached fotr update");
    console.log(req.body);
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  console.log("deleting route");
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne(); // Use deleteOne() instead of remove()

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
    // Fetch popular products sorted by rating
    const products = await Product.find().sort({ rating: -1 }).limit(8);

    // Fetch reviews for each product and calculate average rating and review count
    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        // Get reviews for the current product
        const reviews = await Review.find({ productId: product._id });

        // Calculate the average rating and total review count
        const totalReviews = reviews.length;
        const averageRating =
          totalReviews > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
            : 0;

        // Add the reviews information to the product object
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
