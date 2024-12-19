const Category = require('../model/Categories'); // Assuming you have a Category model
const ErrorHandler = require('../utils/ErrorHandler'); // Custom error handler utility

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get category details
exports.getCategoryDetails = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    console.log(req.body, "body")
      const { categoryName, productCount } = req.body;

      // Check if category name and product count are provided
      if (!categoryName || productCount === undefined) {
          return res.status(400).json({ message: 'Category name and product count are required' });
      }

      console.log("reached")


      // Create a new category with categoryName and productCount
      const newCategory = new Category({
          categoryName,
          productCount
      });

      // Save the new category to the database
      await newCategory.save();

      // Respond with the created category
      res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
      res.status(500).json({ message: 'Error creating category', error });
  }
};

// Update a category
exports.updateCategory = async (req, res, next) => {

  console.log(req.bosy , "boooooodt")
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    await category.deleteOne(category);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
