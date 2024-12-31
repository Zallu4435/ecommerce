import React, { useState, useEffect } from 'react';
import { useAddReviewMutation, useHasReviewedQuery } from '../../../redux/apiSliceFeatures/ReviewApiSlice';

const AddReview = ({ productId }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [hasReviewed, setHasReviewed] = useState(false);
console.log(productId, 'id of the produt')
  // Use RTK Query mutation hook for submitting reviews
  const [addReview, { isLoading, isSuccess, isError, error }] = useAddReviewMutation();

  // Fetch the review status for the product (no userId needed, handled in backend)
  const { data: hasReviewedData, isLoading: isCheckingReview, isError: hasReviewError } = useHasReviewedQuery(productId);

  // Check the review status once the data is fetched
  useEffect(() => {
    if (hasReviewedData) {
      setHasReviewed(hasReviewedData.hasReviewed); // This will be true or false
    }
  }, [hasReviewedData]);

  const handleReviewChange = (e) => setReview(e.target.value);
  const handleRatingChange = (e) => setRating(Number(e.target.value));

  const handleSubmitReview = async () => {
    if (review) {
      try {
        await addReview({ review, rating, productId }).unwrap(); // Make the API call
        alert('Review Submitted');
      } catch (err) {
        alert('Failed to submit review');
      }
    } else {
      alert('Please write a review');
    }
  };

  if (isCheckingReview) {
    return <p>Checking review status...</p>;
  }

  if (hasReviewError) {
    return <p>Error checking review status. Please try again.</p>;
  }

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">Add Your Review</h2>

      {/* Rating Input */}
      <div className="mb-4">
        <label className="text-gray-700 dark:text-gray-300">Rating: </label>
        <select
          className="ml-4 p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-100"
          value={rating}
          onChange={handleRatingChange}
          disabled={hasReviewed} // Disable if user has already reviewed
        >
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>
              {rate} Star{rate > 1 && 's'}
            </option>
          ))}
        </select>
      </div>

      {/* Review Textarea */}
      <div className="mb-4">
        <label className="text-gray-700 dark:text-gray-300">Your Review: </label>
        <textarea
          value={review}
          onChange={handleReviewChange}
          className="w-full mt-2 px-4 py-2 border rounded-lg dark:bg-gray-600 dark:text-gray-100"
          placeholder="Write your review here..."
          disabled={hasReviewed} // Disable textarea if user has already reviewed
        />
      </div>

      {/* Submit Review Button */}
      <button
  onClick={handleSubmitReview}
  className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 ${hasReviewed ? 'opacity-50 cursor-not-allowed' : ''}`}
  disabled={isLoading || hasReviewed} // Disable button if loading or if user has already reviewed
>
  {isLoading ? 'Submitting...' : hasReviewed ? 'You have already reviewed this product' : 'Submit Review'}
</button>

      {/* Display errors if any */}
      {isError && (
        <div className="mt-4 text-red-500">
          {error?.message || 'Something went wrong. Please try again.'}
        </div>
      )}

      {isSuccess && <div className="mt-4 text-green-500">Review Submitted Successfully!</div>}
    </div>
  );
};

export default AddReview;
