// src/redux/api/reviewApiSlice.js
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/authMiddleware';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: ({ review, rating, productId }) => ({
        url: `/reviews/add-review`, // Assuming you're posting to a 'reviews' endpoint
        method: 'POST',
        body: { review, rating, productId }, // Send review, rating, and product ID
      }),
    }),

    getReviews: builder.query({
      query: ({ page = 1, productId }) => `reviews/get-reviews?page=${page}&productId=${productId}`, // Updated to use object destructuring
    }),
    
    hasReviewed: builder.query({
      query: (productId) => `reviews/has-reviewed?productId=${productId}`, // Updated to use object destructuring
    }),
  }),
});

export const { useAddReviewMutation, useGetReviewsQuery, useHasReviewedQuery } = reviewApi;
