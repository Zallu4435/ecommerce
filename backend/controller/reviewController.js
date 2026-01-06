const Review = require("../model/Review");
const Order = require("../model/Orders");

exports.getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;
    const productId = req.query.productId;
    const sortBy = req.query.sortBy || "recent";
    const ratingFilter = req.query.rating ? parseInt(req.query.rating) : null;

    const skip = (page - 1) * itemsPerPage;

    const filter = {
      ...(productId ? { productId } : {}),
      ...(ratingFilter ? { rating: ratingFilter } : {}),
    };

    let sortOptions = { createdAt: -1 }; // Default: Most Recent
    if (sortBy === "highest") sortOptions = { rating: -1 };
    if (sortBy === "lowest") sortOptions = { rating: 1 };

    const reviews = await Review.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage)
      .populate("userId", "username avatar")
      .populate("productId", "productName");

    const totalReviews = await Review.countDocuments(filter);

    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      review: review.review,
      rating: review.rating,
      username: review.userId?.username || "Anonymous",
      avatar: review.userId?.avatar,
      userId: review.userId?._id,
      verifiedPurchase: review.verifiedPurchase || false,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    }));

    res.json({
      reviews: formattedReviews,
      totalPages: Math.ceil(totalReviews / itemsPerPage),
      currentPage: page,
      totalReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { review, rating, productId } = req.body;
    const userId = req.user;

    if (!review || !rating || !productId || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product. You can edit or delete your existing review."
      });
    }

    // Check if user has purchased and received this product
    const deliveredOrder = await Order.findOne({
      userId: userId,
      'items.productId': productId,
      'items.status': 'Delivered'
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: "You can only review products you have purchased and received"
      });
    }

    const newReview = new Review({
      review,
      rating,
      productId,
      userId,
      verifiedPurchase: true,
    });

    await newReview.save();

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { review, rating } = req.body;
    const userId = req.user;

    if (!review || !rating) {
      return res.status(400).json({ message: "Review and rating are required" });
    }

    const existingReview = await Review.findOne({ _id: reviewId, userId });

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found or you don't have permission to edit it" });
    }

    existingReview.review = review;
    existingReview.rating = rating;
    await existingReview.save();

    res.json({ message: "Review updated successfully", review: existingReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating review" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user;

    const existingReview = await Review.findOne({ _id: reviewId, userId });

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found or you don't have permission to delete it" });
    }

    await Review.deleteOne({ _id: reviewId });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review" });
  }
};

exports.hasUserReviewed = async (req, res) => {
  const { productId } = req.query;
  const userId = req.user;

  try {
    const review = await Review.findOne({ userId, productId });

    if (review) {
      return res.status(200).json({
        hasReviewed: true,
        review: {
          _id: review._id,
          review: review.review,
          rating: review.rating,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        }
      });
    }
    return res.status(200).json({ hasReviewed: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error checking review status" });
  }
};

exports.canUserReview = async (req, res) => {
  const { productId } = req.query;
  const userId = req.user;

  try {
    // Check if user has purchased and received this product
    const deliveredOrder = await Order.findOne({
      userId: userId,
      'items.productId': productId,
      'items.status': 'Delivered'
    });

    if (!deliveredOrder) {
      return res.status(200).json({
        canReview: false,
        reason: "You can only review products you have purchased and received"
      });
    }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(200).json({
        canReview: false,
        reason: "You have already reviewed this product",
        hasReview: true
      });
    }

    return res.status(200).json({ canReview: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error checking review eligibility" });
  }
};
