import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/authMiddleware';

export const addressPasswordApi = createApi({
  reducerPath: 'addressPasswordApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Addresses'], // Add tag type for cache invalidation
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => 'userProfile/addresses',
      providesTags: ['Addresses'], // Attach the 'Addresses' tag to this query
    }),

    addAddress: builder.mutation({
      query: (addressData) => ({
        url: 'userProfile/address',
        method: 'POST',
        body: addressData,
      }),
      invalidatesTags: ['Addresses'], // Invalidate cache after adding
    }),

    editAddress: builder.mutation({
      query: ({ id, updatedAddress }) => ({
        url: `userProfile/address`, // Use URL parameter
        method: 'PUT',
        body: updatedAddress,
      }),
      invalidatesTags: ['Addresses'], // Invalidate cache after editing
    }),

    removeAddress: builder.mutation({
      query: (id) => ({
        url: `userProfile/address/${id}`, // Use URL parameter
        method: 'DELETE',
      }),
      invalidatesTags: ['Addresses'], // Invalidate cache after removing
    }),

    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: 'userProfile/change-password', // Endpoint for changing the password
        method: 'PUT',
        body: passwordData,
      }),
    }),

    checkoutAddress: builder.query({
      query: () => '/userProfile/checkout-address',
    }),

    processPayment: builder.mutation({
      query: (paymentData) => ({
        url: '/userProfile/process-payment', // The API endpoint for processing payments
        method: 'POST',
        body: paymentData,
      }),
    }),

    getOrders: builder.query({
      query: ({ page, limit }) => ({
        url: 'orders/getOrders',
        params: { page, limit },
      }),
    }),

    checkProductStock: builder.query({
      query: ({ productId, quantity }) => ({
        url: `/products/${productId}/stock`, // Adjust the endpoint path as necessary
        params: { quantity }, // Pass the productId and quantity as params
      }),
    }),

    getCheckoutCoupons: builder.query({
      query: (productId) => `/coupons/checkout-coupons/${productId}`
    }),

  }),
});


export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useEditAddressMutation,
  useRemoveAddressMutation,
  useChangePasswordMutation,
  useCheckoutAddressQuery,
  useProcessPaymentMutation,
  useGetOrdersQuery,
  useCheckProductStockQuery,
  useGetCheckoutCouponsQuery
} = addressPasswordApi;
