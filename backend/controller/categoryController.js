const Category = require("../model/Categories");
const ErrorHandler = require("../utils/ErrorHandler");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategoryDetails = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    if (!categoryName || categoryDescription === undefined) {
      return res
        .status(400)
        .json({ message: "Category name and product count are required" });
    }

    const existingCategory = await Category.findOne({
      categoryName: { $regex: `^${categoryName}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryName,
      categoryDescription,
    });

    await newCategory.save();

    res
      .status(201)
      .json({
        message: "Category created successfully",
        category: newCategory,
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

exports.updateCategory = async (req, res, next) => {
  console.log(req.body, "boooooodt");

  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    const normalizedCategoryName = req.body.categoryName.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      categoryName: { $regex: `^${normalizedCategoryName}$`, $options: "i" },
    });

    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return next(new ErrorHandler("Category name already exists", 400));
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, categoryName: normalizedCategoryName },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

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
