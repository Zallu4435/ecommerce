import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/authMiddleware';
import { uploadImageToCloudinary } from '../../server'; // Import the upload function

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Avatar'],
  endpoints: (builder) => ({
    // Fetch user details
    getUser: builder.query({
      query: () => '/getUser',
      providesTags: ['User', 'Avatar'],
    }),

    // Fetch ALL user details
    getUsers: builder.query({
      query: () => '/getUsers',
      providesTags: ['User', 'Avatar']
    }),

    // Register user
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/signup-user',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Login user
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login-user',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Avatar'],
    }),

    // Activate user
    activateUser: builder.mutation({
      query: (activationData) => ({
        url: '/activation',
        method: 'POST',
        body: activationData,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      invalidatesTags: ['User', 'Avatar'],
    }),

    // Update user information
    updateUserInfo: builder.mutation({
      query: (updateData) => ({
        url: '/update-user-info',
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['User'],

      // Optimistic update for immediate UI feedback
      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData('getUser', undefined, (draft) => {
            // Directly update the draft with new user data
            if (draft.user) {
              Object.assign(draft.user, updateData);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Update user avatar
    updateAvatar: builder.mutation({
      queryFn: async (formData, _queryApi, _extraOptions, baseQuery) => {
        try {
          const avatarFile = formData.get('avatar');
          if (avatarFile) {
            // Upload the avatar to Cloudinary
            const avatarUrl = await uploadImageToCloudinary(avatarFile);

            // Return the updated avatar URL
            return await baseQuery({
              url: '/update-avatar',
              method: 'PUT',
              body: { avatar: avatarUrl },
            });
          }
          return { error: { status: 'CUSTOM_ERROR', data: 'No avatar file provided' } };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', data: error.message } };
        }
      },
      invalidatesTags: ['Avatar', 'User'],

      // Optimistic update for immediate UI feedback
      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        // Create a local URL for immediate preview
        const avatarFile = formData.get('avatar');
        const avatarPreviewUrl = URL.createObjectURL(avatarFile);
        
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData('getUser', undefined, (draft) => {
            // Update avatar URL in the draft
            if (draft.user) {
              draft.user.avatar = avatarPreviewUrl;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          // Update with the server-returned avatar URL
          dispatch(
            userApiSlice.util.updateQueryData('getUser', undefined, (draft) => {
              if (draft.user) {
                draft.user.avatar = data.avatarUrl;
                // Revoke the temporary preview URL
                URL.revokeObjectURL(avatarPreviewUrl);
              }
            })
          );
        } catch {
          // If the upload fails, revert the optimistic update
          patchResult.undo();
          URL.revokeObjectURL(avatarPreviewUrl);
        }
      },
    }),
  }),
});

// Export hooks for each API call
export const {
  useGetUserQuery,
  useRegisterUserMutation,
  useLoginUserMutation,
  useActivateUserMutation,
  useLogoutUserMutation,
  useUpdateUserInfoMutation,
  useUpdateAvatarMutation,
  useGetUsersQuery
} = userApiSlice;
