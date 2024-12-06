import React, { useState } from 'react';

const RatingsAndReviews = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const reviews = Array.from({ length: 20 }, (_, i) => ({
    name: `User ${i + 1}`,
    comment: `This product is amazing! Review ${i + 1}.`,
    rating: (Math.random() * 2 + 3).toFixed(1),
  }));

  const itemsPerPage = 5;
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">Customer Reviews</h2>

      <div className="space-y-4">
        {paginatedReviews.map((review, index) => (
          <div key={index} className="border-b pb-4">
            <p className="font-bold text-gray-800 dark:text-gray-100">{review.name}</p>
            <p className="text-gray-700 dark:text-gray-300 italic">{review.comment}</p>
            <p className="text-yellow-500">Rating: {review.rating} ⭐</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev < reviews.length / itemsPerPage ? prev + 1 : prev))
          }
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RatingsAndReviews;
