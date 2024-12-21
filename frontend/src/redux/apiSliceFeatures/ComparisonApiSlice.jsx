import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const comparisonApiSlice = createApi({
  reducerPath: "comparisonApi",
    baseQuery: baseQueryWithReauth,
  tagTypes: ["Comparison"], // Add tag for comparison
  endpoints: (builder) => ({

    // Fetch comparison list
    getComparisonList: builder.query({
      query: () => "/user-comparison/comparison",
      providesTags: ["Comparison"],
    }),

    // Add product to comparison
    addToComparison: builder.mutation({
      query: (productId) => ({
        url: `/user-comparison/comparison`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Comparison"],
    }),

    // Remove product from comparison
    removeFromComparison: builder.mutation({
      query: (productId) => ({
        url: `/user-comparison/comparison/${productId}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Comparison"],
    }),
  }),
});

export const {
  useGetComparisonListQuery,
  useAddToComparisonMutation,
  useRemoveFromComparisonMutation,
} = comparisonApiSlice;
