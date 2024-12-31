import React, { useState, useEffect } from 'react';
import { useGetReviewsQuery } from '../../../redux/apiSliceFeatures/ReviewApiSlice';

const RatingsAndReviews = ({ productId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Pass productId and currentPage to fetch reviews for the specific product
  const { data: reviewsData = {}, isLoading, isError, error } = useGetReviewsQuery({ productId, page: currentPage });

  const { reviews = [], totalPages } = reviewsData; // Destructure reviews and totalPages from response

  const itemsPerPage = 5;

  // Handle pagination logic
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Customer Reviews</h2>

      {/* Loading or Error State */}
      {isLoading && <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>}
      {isError && <p className="text-red-500 dark:text-red-400">Error: {error.message}</p>}

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border-b pb-4 flex items-start justify-between">
              <div className="flex items-center">
                {/* Display avatar */}
                {review.avatar && (
                  <img
                    src={review.avatar}
                    alt={review.username}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                )}
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">{review.username}</p>
                  <p className="text-gray-700 dark:text-gray-300 italic">{review.review}</p>
                </div>
              </div>
              <p className="text-yellow-500">Rating: {review.rating} ⭐</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No reviews found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RatingsAndReviews;
