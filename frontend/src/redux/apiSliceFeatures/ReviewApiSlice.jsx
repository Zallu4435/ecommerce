import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: ({ review, rating, productId }) => ({
        url: `/reviews/add-review`,
        method: "POST",
        body: { review, rating, productId },
      }),
      invalidatesTags: ['Review'],
    }),

    updateReview: builder.mutation({
      query: ({ reviewId, review, rating }) => ({
        url: `/reviews/update-review/${reviewId}`,
        method: "PUT",
        body: { review, rating },
      }),
      invalidatesTags: ['Review'],
    }),

    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/delete-review/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Review'],
    }),

    getReviews: builder.query({
      query: ({ page = 1, productId, rating, sortBy }) => {
        let url = `reviews/get-reviews?page=${page}&productId=${productId}`;
        if (rating) url += `&rating=${rating}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        return url;
      },
      providesTags: ['Review'],
    }),

    hasReviewed: builder.query({
      query: (productId) => `reviews/has-reviewed?productId=${productId}`,
      providesTags: ['Review'],
    }),

    canReview: builder.query({
      query: (productId) => `reviews/can-review?productId=${productId}`,
    }),
  }),
});

export const {
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useHasReviewedQuery,
  useCanReviewQuery,
} = reviewApi;
