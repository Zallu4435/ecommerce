import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  useAddReviewMutation,
  useHasReviewedQuery,
} from "../../../redux/apiSliceFeatures/ReviewApiSlice";
import { useSelector } from "react-redux";

const AddReview = ({ productId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
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
  const handleRatingChange = (e) => setRating(Number(e.target.value));

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!review.trim()) {
      toast.info("Please write a review");
      return;
    }

    try {
      await addReview({ review, rating, productId }).unwrap();
      toast.success("Review Submitted");
      setReview("");
      setRating(5); 
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  if (isCheckingReview) {
    return (
      <div className="animate-pulse p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      </div>
    );
  }

  if (hasReviewError) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 rounded-lg">
        Error checking review status. Please try again.
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white dark:bg-gray-800 shadow-lg dark:shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
        Add Your Review
      </h2>

      <div className="mb-4">
        <label className="text-gray-700 dark:text-gray-300">Rating: </label>
        <select
          className="ml-4 p-2 border rounded-lg dark:bg-gray-600 dark:text-gray-100 disabled:opacity-50"
          value={rating}
          onChange={handleRatingChange}
          disabled={hasReviewed || !isAuthenticated}
        >
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>
              {rate} Star{rate > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-gray-700 dark:text-gray-300">Your Review:</label>
        <textarea
          value={review}
          onChange={handleReviewChange}
          className="w-full mt-2 px-4 py-2 border rounded-lg dark:bg-gray-600 dark:text-gray-100 disabled:opacity-50"
          placeholder={
            isAuthenticated
              ? "Write your review here..."
              : "Please login to write a review"
          }
          disabled={hasReviewed || !isAuthenticated}
        />
      </div>

      <button
        onClick={handleSubmitReview}
        className={`w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg transition-all
          ${
            !hasReviewed && isAuthenticated
              ? "hover:bg-blue-700 dark:hover:bg-blue-500"
              : "opacity-50 cursor-not-allowed"
          }
        `}
        disabled={isLoading || hasReviewed || !isAuthenticated}
      >
        {isLoading
          ? "Submitting..."
          : !isAuthenticated
          ? "Login to Submit Review"
          : hasReviewed
          ? "Review Submitted"
          : "Submit Review"}
      </button>

      {isError && (
        <div className="mt-4 text-red-500">
          {error?.data?.message || "Something went wrong. Please try again."}
        </div>
      )}

      {isSuccess && (
        <div className="mt-4 text-green-500">
          Review Submitted Successfully!
        </div>
      )}
    </div>
  );
};

export default AddReview;
