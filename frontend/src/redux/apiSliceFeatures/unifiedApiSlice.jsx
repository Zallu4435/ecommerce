import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

/**
 * Unified API Slice for Cart, Wishlist, and Comparison
 * This ensures proper tag invalidation across all features
 */
export const unifiedApiSlice = createApi({
    reducerPath: "unifiedApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Cart", "Wishlist", "Comparison"],
    endpoints: (builder) => ({
        // ==================== CART ENDPOINTS ====================
        addToCart: builder.mutation({
            query: (productDetails) => ({
                url: "/user-cart/cart",
                method: "POST",
                body: productDetails,
            }),
            // Only invalidate Cart - backend handles wishlist/comparison removal
            invalidatesTags: ["Cart", "Wishlist", "Comparison"],
        }),

        getCart: builder.query({
            query: () => "/user-cart/cart",
            providesTags: ["Cart"],
        }),

        updateQuantity: builder.mutation({
            query: ({ cartItemId, quantity }) => ({
                url: `/user-cart/cart-update-quantity`,
                method: "PUT",
                body: { cartItemId, quantity },
            }),
            invalidatesTags: ["Cart"],
        }),

        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `/user-cart/cart/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

        // ==================== WISHLIST ENDPOINTS ====================
        addToWishlist: builder.mutation({
            query: (productId) => ({
                url: "/user-wishlist/wishlist",
                method: "POST",
                body: { productId },
            }),
            invalidatesTags: ["Wishlist"],
        }),

        getWishlist: builder.query({
            query: () => "/user-wishlist/wishlist",
            providesTags: ["Wishlist"],
        }),

        removeFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `/user-wishlist/wishlist/${productId}`,
                method: "DELETE",
                body: { productId },
            }),
            invalidatesTags: ["Wishlist"],
        }),

        // ==================== COMPARISON ENDPOINTS ====================
        addToComparison: builder.mutation({
            query: (productId) => ({
                url: `/user-comparison/comparison`,
                method: "POST",
                body: { productId },
            }),
            invalidatesTags: ["Comparison"],
        }),

        getComparisonList: builder.query({
            query: () => "/user-comparison/comparison",
            providesTags: ["Comparison"],
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
    // Cart
    useAddToCartMutation,
    useGetCartQuery,
    useUpdateQuantityMutation,
    useRemoveFromCartMutation,
    // Wishlist
    useAddToWishlistMutation,
    useGetWishlistQuery,
    useRemoveFromWishlistMutation,
    // Comparison
    useAddToComparisonMutation,
    useGetComparisonListQuery,
    useRemoveFromComparisonMutation,
} = unifiedApiSlice;
