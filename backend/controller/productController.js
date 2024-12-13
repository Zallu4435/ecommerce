// Get all products (User and Admin)
exports.getAllProducts = async (req, res, next) => {
    try {
      const products = await Product.find();
      res.status(200).json({
        success: true,
        products,
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
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
  
      await product.remove();
  
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  