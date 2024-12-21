const Comparison = require('../model/Comparison'); // Adjust the path if necessary
const mongoose = require('mongoose');

// Add product to comparison
exports.addToComparison = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user;

    // Check if the user already has a comparison list
    const existingComparison = await Comparison.findOne({ userId });

    if (existingComparison) {
      // Check if the product is already in the comparison list
      const productExists = existingComparison.items.some(
        (item) => item.productId.toString() === productId
      );
      if (productExists) {
        return res.status(400).json({ message: 'Product already in comparison list' });
      }

      // Add new product to the items array (limit to 3 items)
      if (existingComparison.items.length >= 3) {
        return res.status(400).json({ message: 'Comparison list can only contain 3 products' });
      }

      existingComparison.items.push({
        productId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await existingComparison.save();
      return res.status(200).json({ message: 'Product added to comparison', comparison: existingComparison });
    } else {
      // If no comparison list, create one
      const newComparison = new Comparison({
        userId,
        items: [
          {
            productId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      });

      await newComparison.save();
      return res.status(201).json({ message: 'Comparison list created and product added', comparison: newComparison });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Remove product from comparison
exports.removeFromComparison = async (req, res) => {
  const { id } = req.params; // Item ID passed as parameter in the URL

  try {
    // Find and remove the item from the user's comparison list
    const result = await Comparison.findOneAndUpdate(
      { userId: req.user },
      { $pull: { items: { productId: id } } }, // Pull the item with the given ID from the comparison's items array
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Item not found in comparison list' });
    }

    return res.status(200).json({ message: 'Item removed successfully', comparison: result });
  } catch (error) {
    console.error('Error removing item from comparison list:', error);
    return res.status(500).json({ message: 'Error removing item from comparison list' });
  }
};

// Get user's comparison list
exports.getComparisonList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    // Aggregation pipeline to get comparison list with populated product details
    const comparisonItems = await Comparison.aggregate([
      {
        $match: { userId: userId }, // Match comparison items for the specific user
      },
      {
        $unwind: '$items', // Unwind the items array in the comparison
      },
      {
        $lookup: {
          from: 'products', // Your Product collection name
          localField: 'items.productId', // Field in Comparison referencing Product
          foreignField: '_id', // Field in Product collection
          as: 'productDetails', // Alias for the joined data
        },
      },
      {
        $unwind: '$productDetails', // Flatten productDetails array
      },
      {
        $project: {
          _id: 0, // Exclude _id from the final result
          productId: { $toString: '$productDetails._id' },
          comparisonItemId: { $toString: '$items._id' }, // Include itemId to allow removal
          productName: '$productDetails.productName', // Product name
          productImage: '$productDetails.image', // Product image
          originalPrice: '$productDetails.originalPrice', // Product price
          ratings: '$productDetails.ratings', // Product ratings
          description: '$productDetails.description'
        },
      },
    ]);

    console.log(comparisonItems, "comparisonItems")
    return res.status(200).json(comparisonItems);
  } catch (error) {
    console.error('Error fetching comparison items:', error);
    return res.status(500).json({ message: 'Error fetching comparison items' });
  }
};
