import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Star, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  useAddReviewMutation,
  useHasReviewedQuery,
} from "../../../redux/apiSliceFeatures/ReviewApiSlice";
import { useSelector } from "react-redux";

const AddReview = ({ productId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [addReview, { isLoading, isSuccess, isError, error }] =
    useAddReviewMutation();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const {
    data: hasReviewedData,
    isLoading: isCheckingReview,
    isError: hasReviewError,
    refetch: refetchHasReviewed,
  } = useHasReviewedQuery(productId, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (hasReviewedData) {
      setHasReviewed(hasReviewedData.hasReviewed);
    }
  }, [hasReviewedData]);

  useEffect(() => {
    if (isSuccess) {
      setHasReviewed(true);
      refetchHasReviewed();
    }
  }, [isSuccess, refetchHasReviewed]);

  const handleReviewChange = (e) => setReview(e.target.value);

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      toast.info("Please select a rating");
      return;
    }

    if (!review.trim()) {
      toast.info("Please write a review");
      return;
    }

    try {
      await addReview({ review, rating, productId }).unwrap();
      toast.success("Review submitted successfully!");
      setReview("");
      setRating(0);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  if (isCheckingReview) {
    return (
      <div className="animate-pulse p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (hasReviewError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <p className="text-red-600 dark:text-red-400 font-medium">
            Error checking review status. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (hasReviewed) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Thank you for your review!
            </p>
            <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
              Your feedback helps other customers make informed decisions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Write a Review
        </h2>

        {/* Rating Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                disabled={!isAuthenticated}
                className="transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                    }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            value={review}
            onChange={handleReviewChange}
            rows={5}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            placeholder={
              isAuthenticated
                ? "Share your experience with this product..."
                : "Please login to write a review"
            }
            disabled={!isAuthenticated}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum 10 characters
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {review.length} / 500
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitReview}
          disabled={isLoading || !isAuthenticated || rating === 0 || review.trim().length < 10}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${!isAuthenticated || rating === 0 || review.trim().length < 10
              ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : !isAuthenticated ? (
            <>
              <AlertCircle className="w-5 h-5" />
              <span>Login to Submit Review</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Review</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {isError && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {error?.data?.message || "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Review submitted successfully!
              </p>
            </div>
          </div>
        )}

        {/* Login Prompt */}
        {!isAuthenticated && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Please{" "}
                <a href="/login" className="font-semibold underline hover:no-underline">
                  login
                </a>{" "}
                to submit a review
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddReview;
