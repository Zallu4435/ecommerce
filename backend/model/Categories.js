const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema(
    {
    categoryName: {
        type: String,
        required: true
    },
      categoryDescription: {
        type: String,
    }
    },
    {
        timestamps: true,
    }
);

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports = Categories;
