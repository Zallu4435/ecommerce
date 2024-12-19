const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema(
    {
    categoryName: {
        type: String,
        required: true
    },
    productCount: {
        type: Number,
        default: 0
    }
    },
    {
        timestamps: true,
    }
);

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports = Categories;
