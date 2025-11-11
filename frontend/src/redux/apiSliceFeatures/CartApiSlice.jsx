import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart", "Wishlist", "Comparison"],
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (productDetails) => ({
        url: "/user-cart/cart",
        method: "POST",
        body: productDetails,
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }, "Wishlist", "Comparison"],
    }),

    updateQuantity: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `/user-cart/cart-update-quantity`,
        method: "PUT",
        body: { cartItemId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    getCart: builder.query({
      query: () => "/user-cart/cart",
      providesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/user-cart/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateQuantityMutation,
} = cartApi;
