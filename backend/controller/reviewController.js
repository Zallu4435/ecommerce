// controllers/reviewController.js
const Review = require('../model/Review');


exports.getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const itemsPerPage = 5; // Items per page
    const productId = req.query.productId; // Get productId from query parameters
  
    // Skip and limit for pagination
    const skip = (page - 1) * itemsPerPage;

    // Filter reviews by productId, if it's provided
    const filter = productId ? { productId } : {};

    const reviews = await Review.find(filter) // Apply filter based on productId
      .skip(skip)
      .limit(itemsPerPage)
      .populate('userId', 'username avatar') // Populate username and avatar from the User collection
      .populate('productId', 'productName'); // Populate product name (optional)

    const totalReviews = await Review.countDocuments(filter); // Count total reviews for this product

    // Format the response
    const formattedReviews = reviews.map((review) => ({
      review: review.review,
      rating: review.rating,
      username: review.userId.username,
      avatar: review.userId.avatar,
    }));

    console.log(formattedReviews, 'formattedReviews');

    res.json({
      reviews: formattedReviews,
      totalPages: Math.ceil(totalReviews / itemsPerPage),
      currentPage: page,
      totalReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

  
exports.addReview = async (req, res) => {
  try {
    const { review, rating, productId } = req.body;
    console.log(review, rating, productId);
    console.log(req.body, 'body')
const userId = req.user;
    // Validate the data
    if (!review || !rating || !productId || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create the new review
    const newReview = new Review({
      review,
      rating,
      productId,
      userId,
    });

    // Save the review to the database
    await newReview.save();

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.hasUserReviewed = async (req, res) => {
  const {productId} = req.query;
  const userId = req.user

  try {
    const review = await Review.findOne({ userId, productId });
    console.log(review , 'review ')

    if (review) {
      return res.status(200).json({ hasReviewed: true });
    }
    return res.status(200).json({ hasReviewed: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error checking review status' });
  }
};
