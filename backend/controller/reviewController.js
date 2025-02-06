const Review = require("../model/Review");

exports.getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;
    const productId = req.query.productId;

    const skip = (page - 1) * itemsPerPage;

    const filter = productId ? { productId } : {};

    const reviews = await Review.find(filter)
      .skip(skip)
      .limit(itemsPerPage)
      .populate("userId", "username avatar")
      .populate("productId", "productName");
    const totalReviews = await Review.countDocuments(filter);

    const formattedReviews = reviews.map((review) => ({
      review: review.review,
      rating: review.rating,
      username: review.userId.username,
      avatar: review.userId.avatar,
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

    const newReview = new Review({
      review,
      rating,
      productId,
      userId,
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

exports.hasUserReviewed = async (req, res) => {
  const { productId } = req.query;
  const userId = req.user;

  try {
    const review = await Review.findOne({ userId, productId });

    if (review) {
      return res.status(200).json({ hasReviewed: true });
    }
    return res.status(200).json({ hasReviewed: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error checking review status" });
  }
};
