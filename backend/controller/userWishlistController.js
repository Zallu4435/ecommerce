const Wishlist = require('../model/Wishlist'); // Adjust the path if necessary
const Product = require('../model/Products'); // Adjust the path if necessary
const mongoose = require('mongoose');

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user;
        // Check if the product already exists in the user's wishlist
        const existingWishlist = await Wishlist.findOne({ userId });
        if (existingWishlist) {
            // Check if the product is already in the wishlist
            const productExists = existingWishlist.items.some(item => item.productId.toString() === productId);
            if (productExists) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            // Add new product to the items array
            existingWishlist.items.push({
                productId,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            await existingWishlist.save();
            return res.status(200).json({ message: 'Product added to wishlist', wishlist: existingWishlist });
        } else {
            // If no wishlist, create one
            const newWishlist = new Wishlist({
                userId,
                items: [{
                    productId,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                }]
            });

            await newWishlist.save();
            return res.status(201).json({ message: 'Wishlist created and product added', wishlist: newWishlist });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {

  console.log("reached inside remove frm wislist")
  const { id } = req.params; // Item ID passed as parameter in the URL

  try {
    console.log(req.params, "id from")
    // Find and remove the item from the user's wishlist
    const result = await Wishlist.findOneAndUpdate(
      { userId: req.user },
      { $pull: { items: { productId: id } } }, // Pull the item with the given ID from the wishlist's items array
      { new: true }
    );

    console.log(result , "result from wishlist ")

    if (!result) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    return res.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return res.status(500).json({ message: 'Error removing item from wishlist' });
  }
};

// Get user's wishlist

exports.getWishlist = async (req, res) => {
  try {

    // Convert req.user to ObjectId
    const userId = new mongoose.Types.ObjectId(req.user);

    // Aggregation pipeline to get wishlist with populated product details
    const wishlistItems = await Wishlist.aggregate([
      {
        $match: { userId: userId }, // Match wishlist items for the specific user
      },
      {
        $unwind: '$items', // Unwind the items array in the wishlist
      },
      {
        $lookup: {
          from: 'products', // Your Product collection name
          localField: 'items.productId', // Field in Wishlist referencing Product
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
          wishlistItemId: { $toString: '$items._id' }, // Include itemId to allow removal
          productName: '$productDetails.productName', // Product name
          productImage: '$productDetails.image', // Product image
          originalPrice: '$productDetails.originalPrice', // Product price
          ratings: '$productDetails.ratings', // Product ratings
          stockQuantity: '$productDetails.stockQuantity', // Quantity from wishlist
        },
      },
    ]);

    // Debugging: Log the final aggregated wishlist items
    // console.log('Wishlist Items with Product Details:', wishlistItems);

    // Send the response with wishlist items
    return res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return res.status(500).json({ message: 'Error fetching wishlist items' });
  }
};
