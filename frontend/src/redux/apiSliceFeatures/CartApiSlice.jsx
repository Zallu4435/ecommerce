import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/authMiddleware';

// Define the cart API slice
export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (productDetails) => ({
        url: '/user-cart/cart', 
        method: 'POST',
        body: productDetails,
      }),
      // Invalidating the cache after adding an item to the cart
      invalidatesTags: [{ type: 'Cart', id: 'LIST' }],
    }),

    updateQuantity: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `/user-cart/cart-update-quantity`,
        method: 'PUT',
        body: { cartItemId, quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    getCart: builder.query({
      query: () => '/user-cart/cart', // Assuming a GET request to fetch cart items
      providesTags: ['Cart'],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/user-cart/cart/${productId}`, // DELETE request to remove an item from the cart
        method: 'DELETE',
      }),
      // Invalidating the cache after removing an item
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const { 
  useAddToCartMutation, 
  useGetCartQuery, 
  useRemoveFromCartMutation,
  useUpdateQuantityMutation
} = cartApi;
