const Category = require("../model/Categories");
const Product = require("../model/Products");
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
    const { categoryName, categoryDescription, categoryOffer, offerName, startDate, endDate, isOfferActive } = req.body;

    if (!categoryName || categoryName.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }
    if (!categoryDescription || categoryDescription.trim() === "") {
      return res.status(400).json({ message: "Category description is required" });
    }

    if (
      categoryOffer !== undefined &&
      (isNaN(Number(categoryOffer)) || Number(categoryOffer) < 0 || Number(categoryOffer) > 100)
    ) {
      return res.status(400).json({ message: "Category offer must be between 0 and 100" });
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
      categoryOffer,
      offerName,
      startDate,
      endDate,
      isOfferActive,
    });

    try {
      await newCategory.save();
    } catch (err) {
      if (err && err.code === 11000) {
        return res.status(400).json({ message: "Category already exists" });
      }
      throw err;
    }

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    console.log("Updating category with body:", req.body);
    let category = await Category.findById(req.params.id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    const previousCategoryName = category.categoryName; // capture old name
    const normalizedCategoryName = req.body.categoryName.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      categoryName: { $regex: `^${normalizedCategoryName}$`, $options: "i" },
    });

    if (existingCategory && existingCategory._id.toString() !== req.params.id) {
      return next(new ErrorHandler("Category name already exists", 400));
    }

    // Validate optional fields if present
    if (req.body.categoryDescription !== undefined && req.body.categoryDescription.trim() === "") {
      return next(new ErrorHandler("Category description cannot be empty", 400));
    }
    if (req.body.categoryOffer !== undefined) {
      const offer = Number(req.body.categoryOffer);
      if (isNaN(offer) || offer < 0 || offer > 100) {
        return next(new ErrorHandler("Category offer must be between 0 and 100", 400));
      }
    }

    try {
      category = await Category.findByIdAndUpdate(
        req.params.id,
        { ...req.body, categoryName: normalizedCategoryName },
        {
          new: true,
          runValidators: true,
        }
      );

      // Cascade update: update all products that reference the old category name
      if (
        previousCategoryName &&
        previousCategoryName.toLowerCase() !== normalizedCategoryName
      ) {
        await Product.updateMany(
          { category: previousCategoryName }, // Use the exact old name stored in DB, or use Regex if needed. regex is safer for case insensitivity if data is messy. Keeping as is.
          { $set: { category: normalizedCategoryName } }
        );
      }
    } catch (err) {
      if (err && err.code === 11000) {
        return next(new ErrorHandler("Category name already exists", 400));
      }
      throw err;
    }

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

exports.getPopularCategories = async (req, res, next) => {
  try {
    // Fetch all categories
    const categories = await Category.find({}, { categoryName: 1 });

    // Fetch top products for each category and combine them in one array
    const allProducts = await Promise.all(
      categories.map(async (category) => {
        const topProducts = await Product.aggregate([
          {
            $match: {
              category: { $regex: category.categoryName, $options: "i" },
            },
          },
          { $sort: { originalPrice: -1 } },
          { $limit: 2 },
          { $project: { productName: 1, image: 1, _id: 1 } },
        ]);

        return topProducts; // Return products for this category
      })
    );

    // Flatten the array of arrays and return it in a single response
    const flattenedProducts = allProducts.flat();

    // Send response with all products
    res.status(200).json({
      success: true,
      products: flattenedProducts, // Array of all products from all categories
    });
  } catch (error) {
    next(error);
  }
};

