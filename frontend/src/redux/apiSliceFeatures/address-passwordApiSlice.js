import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../server';

export const addressPasswordApi = createApi({
  reducerPath: 'addressPasswordApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/users` }), // Adjust the base URL to your API
  endpoints: (builder) => ({
    // Address routes
    addAddress: builder.mutation({
      query: (addressData) => ({
        url: '/address',
        method: 'POST',
        body: addressData,
      }),
    }),
    editAddress: builder.mutation({
      query: (addressData) => ({
        url: '/address',
        method: 'PUT',
        body: addressData,
      }),
    }),
    removeAddress: builder.mutation({
      query: (addressId) => ({
        url: '/address',
        method: 'DELETE',
        body: { addressId },
      }),
    }),

    // Password routes
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/reset-password/${token}`,
        method: 'PUT',
        body: { newPassword },
      }),
    }),
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/update-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useAddAddressMutation,
  useEditAddressMutation,
  useRemoveAddressMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
} = addressPasswordApi;
