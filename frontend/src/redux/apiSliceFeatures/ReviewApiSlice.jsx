import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: ({ review, rating, productId }) => ({
        url: `/reviews/add-review`,
        method: "POST",
        body: { review, rating, productId },
      }),
    }),

    getReviews: builder.query({
      query: ({ page = 1, productId, rating, sortBy }) => {
        let url = `reviews/get-reviews?page=${page}&productId=${productId}`;
        if (rating) url += `&rating=${rating}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        return url;
      },
    }),

    hasReviewed: builder.query({
      query: (productId) => `reviews/has-reviewed?productId=${productId}`,
    }),
  }),
});

export const { useAddReviewMutation, useGetReviewsQuery, useHasReviewedQuery } =
  reviewApi;
