const Comparison = require("../model/Comparison");
const mongoose = require("mongoose");

exports.addToComparison = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user;

    const existingComparison = await Comparison.findOne({ userId });

    if (existingComparison) {
      const productExists = existingComparison.items.some(
        (item) => item.productId.toString() === productId
      );
      if (productExists) {
        return res
          .status(400)
          .json({ message: "Product already in comparison list" });
      }

      if (existingComparison.items.length > 3) {
        return res
          .status(400)
          .json({ message: "Comparison list can only contain 3 products" });
      }

      existingComparison.items.push({
        productId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await existingComparison.save();
      return res
        .status(200)
        .json({
          message: "Product added to comparison",
          comparison: existingComparison,
        });
    } else {
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
      return res
        .status(201)
        .json({
          message: "Comparison list created and product added",
          comparison: newComparison,
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromComparison = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Comparison.findOneAndUpdate(
      { userId: req.user },
      { $pull: { items: { productId: id } } },
      { new: true }
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "Item not found in comparison list" });
    }

    return res
      .status(200)
      .json({ message: "Item removed successfully", comparison: result });
  } catch (error) {
    console.error("Error removing item from comparison list:", error);
    return res
      .status(500)
      .json({ message: "Error removing item from comparison list" });
  }
};

exports.getComparisonList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const comparisonItems = await Comparison.aggregate([
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
          comparisonItemId: { $toString: "$items._id" },
          productName: "$productDetails.productName",
          productImage: "$productDetails.image",
          originalPrice: "$productDetails.originalPrice",
          averageRating: { $ifNull: ["$averageRating", 0] },
          reviewCount: { $ifNull: ["$reviewCount", 0] },
          description: "$productDetails.description",
        },
      },
    ]);

    return res.status(200).json(comparisonItems);
  } catch (error) {
    console.error("Error fetching comparison items:", error);
    return res.status(500).json({ message: "Error fetching comparison items" });
  }
};
