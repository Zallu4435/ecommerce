import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const comparisonApiSlice = createApi({
  reducerPath: "comparisonApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Comparison"],
  endpoints: (builder) => ({
    getComparisonList: builder.query({
      query: () => "/user-comparison/comparison",
      providesTags: ["Comparison"],
    }),

    addToComparison: builder.mutation({
      query: (productId) => ({
        url: `/user-comparison/comparison`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Comparison"],
    }),

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
