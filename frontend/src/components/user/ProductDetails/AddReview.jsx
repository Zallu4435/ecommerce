import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Star, Send, AlertCircle, CheckCircle2, Edit2, Trash2 } from "lucide-react";
import {
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useHasReviewedQuery,
  useCanReviewQuery,
} from "../../../redux/apiSliceFeatures/ReviewApiSlice";
import { useSelector } from "react-redux";

const AddReview = ({ productId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState(null);

  const [addReview, { isLoading: isAdding }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const {
    data: hasReviewedData,
    isLoading: isCheckingReview,
    refetch: refetchHasReviewed,
  } = useHasReviewedQuery(productId, {
    skip: !isAuthenticated,
  });

  const {
    data: canReviewData,
    isLoading: isCheckingEligibility,
  } = useCanReviewQuery(productId, {
    skip: !isAuthenticated || hasReviewedData?.hasReviewed,
  });

  useEffect(() => {
    if (hasReviewedData?.hasReviewed && hasReviewedData?.review) {
      setExistingReviewId(hasReviewedData.review._id);
      setReview(hasReviewedData.review.review);
      setRating(hasReviewedData.review.rating);
    }
  }, [hasReviewedData]);

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

    if (!review.trim() || review.trim().length < 10) {
      toast.info("Please write a review with at least 10 characters");
      return;
    }

    try {
      if (isEditing && existingReviewId) {
        await updateReview({ reviewId: existingReviewId, review, rating }).unwrap();
        toast.success("Review updated successfully!");
        setIsEditing(false);
      } else {
        await addReview({ review, rating, productId }).unwrap();
        toast.success("Review submitted successfully!");
      }
      refetchHasReviewed();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  const handleEditReview = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (hasReviewedData?.review) {
      setReview(hasReviewedData.review.review);
      setRating(hasReviewedData.review.rating);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm("Are you sure you want to delete your review? You can add a new review later if you've purchased this product.")) {
      return;
    }

    try {
      await deleteReview(existingReviewId).unwrap();
      toast.success("Review deleted successfully!");
      setReview("");
      setRating(0);
      setExistingReviewId(null);
      setIsEditing(false);
      refetchHasReviewed();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete review");
    }
  };

  if (isCheckingReview || isCheckingEligibility) {
    return (
      <div className="animate-pulse p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  // Show existing review if user has reviewed and not editing
  if (hasReviewedData?.hasReviewed && !isEditing) {
    return (
      <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                Your Review
              </p>
              <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                Thank you for sharing your feedback!
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEditReview}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDeleteReview}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                  }`}
              />
            ))}
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {hasReviewedData.review.review}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Posted on {new Date(hasReviewedData.review.createdAt).toLocaleDateString()}
            {hasReviewedData.review.updatedAt !== hasReviewedData.review.createdAt &&
              ` • Edited on ${new Date(hasReviewedData.review.updatedAt).toLocaleDateString()}`
            }
          </p>
        </div>
      </div>
    );
  }

  // Check if user can review (has purchased and received)
  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Please{" "}
            <a href="/login" className="font-semibold underline hover:no-underline">
              login
            </a>{" "}
            to write a review
          </p>
        </div>
      </div>
    );
  }

  if (canReviewData && !canReviewData.canReview) {
    return (
      <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-amber-600 dark:text-amber-400 font-semibold">
              Unable to Review
            </p>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/80 mt-1">
              {canReviewData.reason}
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
          {isEditing ? "Edit Your Review" : "Write a Review"}
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
                className="transition-transform hover:scale-110 active:scale-95"
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
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Share your experience with this product..."
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

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmitReview}
            disabled={isAdding || isUpdating || rating === 0 || review.trim().length < 10}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${rating === 0 || review.trim().length < 10
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
          >
            {isAdding || isUpdating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isEditing ? "Updating..." : "Submitting..."}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>{isEditing ? "Update Review" : "Submit Review"}</span>
              </>
            )}
          </button>

          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReview;
