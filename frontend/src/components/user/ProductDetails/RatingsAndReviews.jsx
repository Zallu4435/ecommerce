import { useState } from "react";
import { Star, Filter, ChevronDown, ShieldCheck, MessageCircle } from "lucide-react";
import { useGetReviewsQuery } from "../../../redux/apiSliceFeatures/ReviewApiSlice";
import LoadingSpinner from "../../LoadingSpinner";
import { useSelector } from "react-redux";

const RatingsAndReviews = ({ productId, averageRating, totalReviews: totalReviewCount }) => {
  const currentUserId = useSelector((state) => state.user.user?._id);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState(null);
  const [sortBy, setSortBy] = useState("recent"); // recent, highest, lowest

  const {
    data: reviewsData = {},
    isLoading,
    isError,
    error,
  } = useGetReviewsQuery({ productId, page: currentPage, rating: filterRating, sortBy });

  const { reviews = [], totalPages, totalReviews } = reviewsData;

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header with Rating Summary */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Overall Rating */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 dark:text-white">
                {averageRating?.toFixed(1) || "0.0"}
              </div>
              <div className="flex items-center justify-center mt-2">
                {renderStars(Math.round(averageRating || 0))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {totalReviewCount || 0} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-1 space-y-2 min-w-[200px]">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div
                  key={star}
                  className={`flex items-center gap-2 cursor-pointer p-1 rounded transition-colors ${filterRating === star ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                  onClick={() => {
                    setFilterRating(filterRating === star ? null : star);
                    setCurrentPage(1); // Reset to page 1 when filtering
                  }}
                >
                  <span className={`text-sm font-medium w-8 ${filterRating === star ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {star}★
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${filterRating === star ? 'bg-blue-500' : 'bg-yellow-400'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sort & Filter */}
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-6">
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">
              Error loading reviews: {error?.message || "Please try again"}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div
                  key={index}
                  className="pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.username}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {review.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {review.username}
                        </p>
                        {review.verifiedPurchase && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                              Verified Purchase
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                            {review.updatedAt !== review.createdAt && " (edited)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    {review.review}
                  </p>


                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Be the first to share your thoughts about this product
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && reviews.length > 0 && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsAndReviews;
