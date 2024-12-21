import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const wishlistApiSlice = createApi({
  reducerPath: "wishlistApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    // Mutation to add product to wishlist
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: "/user-wishlist/wishlist",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Mutation to remove product from wishlist
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/user-wishlist/wishlist/${productId}`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Fetch wishlist data
    getWishlist: builder.query({
      query: () => "/user-wishlist/wishlist",
      providesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetWishlistQuery,
} = wishlistApiSlice;
