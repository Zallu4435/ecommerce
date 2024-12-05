import React, { useState } from 'react';

const AddReview = () => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);

  const handleReviewChange = (e) => setReview(e.target.value);
  const handleRatingChange = (e) => setRating(Number(e.target.value));

  const handleSubmitReview = () => {
    if (review) {
      alert('Review Submitted');
    } else {
      alert('Please write a review');
    }
  };

  return (
    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Your Review</h2>

      {/* Rating Input */}
      <div className="mb-4">
        <label className="text-gray-700">Rating: </label>
        <select
          className="ml-4 p-2 border rounded-lg"
          value={rating}
          onChange={handleRatingChange}
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
        <label className="text-gray-700">Your Review: </label>
        <textarea
          value={review}
          onChange={handleReviewChange}
          className="w-full mt-2 px-4 py-2 border rounded-lg"
          placeholder="Write your review here..."
        />
      </div>

      {/* Submit Review Button */}
      <button
        onClick={handleSubmitReview}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700"
      >
        Submit Review
      </button>
    </div>
  );
};

export default AddReview;
