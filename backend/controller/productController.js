const Product = require('../model/Products');
const ErrorHandler = require('../utils/ErrorHandler');


// Get all products (User and Admin)
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find(); // Get all products from the database

    console.log(products, "products")
    // Send back the products array with desired fields
    res.status(200).json({
      success: true,
      products: products.map(product => ({
        id: product._id,
        productName: product.productName,
        category: product.category,
        brand: product.brand,
        originalPrice: product.originalPrice,
        offerPrice: product.offerPrice,
      })),
    });
  } catch (error) {
    next(error);
  }
};

    
  // Get single product details (User and Admin)
  exports.getProductDetails = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
  
      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Create new product (Admin only)
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
      console.log(req.body)
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
      const products = await Product.find()
        .sort({ rating: -1 }) 
        .limit(8);  
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  };