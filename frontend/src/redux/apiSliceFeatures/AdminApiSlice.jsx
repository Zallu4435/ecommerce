import { createApi } from '@reduxjs/toolkit/query/react';
import { adminBaseQueryWithReauth } from '../../middleware/authMiddleware';

export const adminApiSlice = createApi({
  reducerPath: 'adminApi', // Corrected name
  baseQuery: adminBaseQueryWithReauth, // Changed from adminBaseQuery to baseQuery
  tagTypes: ['User', 'Avatar'], // Tags for caching and invalidation
  endpoints: (builder) => ({
    // Block user mutation
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/block-user/${userId}`, // Assuming you need a user ID in the URL
        method: 'POST', // Assuming the request method is POST
      }),
    }),

    userDetails: builder.query({
      query: (id) => `/get-user-details/${id}`,
      providesTags: (result, error, id) => [{ type: 'Entity', id }],
    }),

    refreshAdmin: builder.mutation({
      query: () => ({
        url: '/admin-refresh-token',
        method: 'GET',
      }),
    }),


    // Admin login mutation
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/login-admin', // The admin login route
        method: 'POST', // POST request
        body: credentials, // Passing the email and password in the request body
      }),
    }),
  }),
});

export const { useBlockUserMutation, useLoginAdminMutation, useRefreshAdminMutation, useUserDetailsQuery } = adminApiSlice; // Correct export for loginAdmin
