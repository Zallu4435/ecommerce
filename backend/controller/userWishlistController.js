const Wishlist = require("../model/Wishlist");

const mongoose = require("mongoose");

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user;

    const limit = 15;
    const existingWishlist = await Wishlist.findOne({ userId });

    if (existingWishlist) {
      if (existingWishlist.items.length >= limit) {
        return res.status(400).json({ message: `Wishlist is full. Maximum ${limit} items allowed.` });
      }
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
    const { calculateBestPrice } = require("../utils/orderHelper");
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
        $lookup: {
          from: "reviews",
          localField: "productDetails._id",
          foreignField: "productId",
          as: "productReviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$productReviews.rating" },
          reviewCount: { $size: "$productReviews" },
        },
      },
      {
        $project: {
          _id: 0,
          productId: { $toString: "$productDetails._id" },
          wishlistItemId: { $toString: "$items._id" },
          productName: "$productDetails.productName",
          productImage: "$productDetails.image",
          // Map basePrice to originalPrice for frontend consistency, but we'll also use it for calculation
          basePrice: "$productDetails.basePrice",
          baseOfferPrice: "$productDetails.baseOfferPrice",
          averageRating: { $ifNull: ["$averageRating", 0] },
          reviewCount: { $ifNull: ["$reviewCount", 0] },
          stockQuantity: "$productDetails.totalStock",
          category: "$productDetails.category",
          // Include variant information for proper detection
          availableColors: "$productDetails.availableColors",
          availableSizes: "$productDetails.availableSizes",
          availableGenders: "$productDetails.availableGenders",
          hasVariants: "$productDetails.hasVariants",
        },
      },
    ]);

    // Post-process to calculate best prices including offers
    const processedItems = await Promise.all(wishlistItems.map(async (item) => {
      // Reconstruct product-like object for helper
      const productMock = {
        basePrice: item.basePrice,
        baseOfferPrice: item.baseOfferPrice,
        category: item.category
      };

      const priceInfo = await calculateBestPrice(productMock);

      return {
        ...item,
        originalPrice: item.basePrice, // Frontend expects originalPrice
        offerPrice: priceInfo.price,   // The calculated best price
        offerInfo: priceInfo.offerInfo,
        averageRating: item.averageRating,
        reviewCount: item.reviewCount,
        wishlistItemId: item.wishlistItemId
      };
    }));



    return res.status(200).json(processedItems);
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return res.status(500).json({ message: "Error fetching wishlist items" });
  }
};
