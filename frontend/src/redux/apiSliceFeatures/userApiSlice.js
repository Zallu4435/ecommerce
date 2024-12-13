import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/authMiddleware';

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  // baseQuery: fetchBaseQuery({ baseUrl: `${server}/users` }),
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Fetch user details
    getUsers: builder.query({
      query: () => '/getUser',
    }),

    // Register user
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/signup-user',
        method: 'POST',
        body: userData,
      }),
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login-user',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Activate user
    activateUser: builder.mutation({
      query: (activationData) => ({
        url: '/activation',
        method: 'POST',
        body: activationData,
      }),
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
    }),

    // Update user information
    updateUserInfo: builder.mutation({
      query: (updateData) => ({
        url: '/update-user-info',
        method: 'PUT',
        body: updateData,
      }),
    }),

    // Update user avatar
    updateAvatar: builder.mutation({
      query: (avatarData) => ({
        url: '/update-avatar',
        method: 'PUT',
        body: avatarData,
      }),
    }),
  }),
});

// Export hooks for each API call
export const {
  useGetUsersQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useActivateUserMutation,
  useLogoutUserMutation,
  useUpdateUserInfoMutation,
  useUpdateAvatarMutation,
} = userApiSlice;
