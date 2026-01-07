import { crudApiSlice } from "./crudApiSlice";

export const reviewApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: ({ review, rating, productId }) => ({
        url: `/reviews/add-review`,
        method: "POST",
        body: { review, rating, productId },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: 'LIST' },
        { type: 'Entity', id: productId }
      ],
    }),

    updateReview: builder.mutation({
      query: ({ reviewId, review, rating }) => ({
        url: `/reviews/update-review/${reviewId}`,
        method: "PUT",
        body: { review, rating },
      }),
      invalidatesTags: ['Review', 'Entity'], // Invalidate generically if we don't have productId
    }),

    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/delete-review/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Review', 'Entity'],
    }),

    getReviews: builder.query({
      query: ({ page = 1, productId, rating, sortBy }) => {
        let url = `reviews/get-reviews?page=${page}&productId=${productId}`;
        if (rating) url += `&rating=${rating}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        return url;
      },
      providesTags: (result) =>
        result
          ? [
            ...result.reviews.map(({ _id }) => ({ type: 'Review', id: _id })),
            { type: 'Review', id: 'LIST' },
          ]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    hasReviewed: builder.query({
      query: (productId) => `reviews/has-reviewed?productId=${productId}`,
      providesTags: ['Review'],
    }),

    canReview: builder.query({
      query: (productId) => `reviews/can-review?productId=${productId}`,
      providesTags: ['Review'], // Add tag so it can be invalidated if needed
    }),
  }),
});

export const {
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsQuery,
  useHasReviewedQuery,
  useCanReviewQuery
} = reviewApiSlice;


