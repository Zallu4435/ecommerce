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
  }),
});


export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useEditAddressMutation,
  useRemoveAddressMutation,
  useChangePasswordMutation
} = addressPasswordApi;
