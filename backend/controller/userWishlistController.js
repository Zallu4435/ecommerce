const Wishlist = require("../model/Wishlist");
const Cart = require("../model/Cart");
const mongoose = require("mongoose");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user;

    // Check if product is already in cart
    const cart = await Cart.findOne({ userId });
    if (cart) {
      const productInCart = cart.items.some(
        (item) => item.productId.toString() === productId
      );
      if (productInCart) {
        return res.status(400).json({ message: "This product is already in your cart" });
      }
    }

    const existingWishlist = await Wishlist.findOne({ userId });
    if (existingWishlist) {
      const productExists = existingWishlist.items.some(
        (item) => item.productId.toString() === productId
      );
      if (productExists) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }

      existingWishlist.items.push({
        productId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await existingWishlist.save();
      return res
        .status(200)
        .json({
          message: "Product added to wishlist",
          wishlist: existingWishlist,
        });
    } else {
      const newWishlist = new Wishlist({
        userId,
        items: [
          {
            productId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      });

      await newWishlist.save();
      return res
        .status(201)
        .json({
          message: "Wishlist created and product added",
          wishlist: newWishlist,
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Wishlist.findOneAndUpdate(
      { userId: req.user },
      { $pull: { items: { productId: id } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    return res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
    return res
      .status(500)
      .json({ message: "Error removing item from wishlist" });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const wishlistItems = await Wishlist.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 0,
          productId: { $toString: "$productDetails._id" },
          wishlistItemId: { $toString: "$items._id" },
          productName: "$productDetails.productName",
          productImage: "$productDetails.image",
          originalPrice: "$productDetails.originalPrice",
          ratings: "$productDetails.ratings",
          stockQuantity: "$productDetails.stockQuantity",
        },
      },
    ]);

    return res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return res.status(500).json({ message: "Error fetching wishlist items" });
  }
};
