import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/authMiddleware';
import { uploadImageToCloudinary } from '../../server'; // Import the upload function
import { clearCredentials } from '../slice/userSlice';

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Avatar'],
  endpoints: (builder) => ({
    // Fetch user details
    getUser: builder.query({
      query: () => 'users/getUser',
      // providesTags: ['User', 'Avatar'],
      
    }),

    googleLogin: builder.mutation({
      query: (userData) => ({
        url: 'users/google-login',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Fetch ALL user details
    getUsers: builder.query({
      query: () => 'users/getUsers',
      providesTags: ['User', 'Avatar']
    }),

    // Register user
    registerUser: builder.mutation({
      query: (userData) => ({
        url: 'users/signup-user',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Login user
    loginUser: builder.mutation({
      query: credentials => ({
        url: 'users/login-user',
        method: 'POST',
        body: { ...credentials }
      })
    }),

    refreshUser: builder.mutation({
      query: () => ({
        url: 'users/refresh-token',
        method: 'GET',
      }),
    }),

    // Activate user
    activateUser: builder.mutation({
      query: (activationData) => ({
        url: 'users/activation/:token',
        method: 'POST',
        body: activationData,
      }),
      invalidatesTags: ['User'],
    }),

    otpLogin: builder.mutation({
      query: (credentials) => ({
        url: "users/otp-login",
        method: "POST",
        body: credentials, // Send email or required login details
      }),
      transformResponse: (response) => {
        return {
          message: response.message,
          token: response.token,
        };
      },
    }),
    
    
    otpVerify: builder.mutation({
      query: ({ token, otp }) => ({
        url: "users/verify-otp",
        method: "POST",
        body: { token, otp }, // Send token and OTP for verification
      }),
    }),
    
    verifyResetPassword: builder.mutation({
      query: ({ token, otp }) => ({
        url: "users/verify-reset-password",
        method: "POST",
        body: { token, otp }, // Send token and OTP for verification
      }),
    }),

    resetPassword: builder.mutation({
      query: (password) => ({
        url: "users/reset-password",
        method: "POST",
        body: password,
      }),
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: 'users/logout',
        method: 'POST',
        credentials: 'include', // Ensure cookies are included in the request
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearCredentials());
        } catch (err) {
          console.error(err);
        }
      },
    }),

    // Update user information
    updateUserInfo: builder.mutation({
      query: ({ updateData, oldEmail }) => ({
        url: 'users/update-user-info',
        method: 'PUT',
        body: { ...updateData, oldEmail }, // Pass both updateData and oldEmail to the body
      }),
      invalidatesTags: ['User'],
    
      // Optimistic update for immediate UI feedback
      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        const { oldEmail } = updateData;  // Destructure to get oldEmail from updateData
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData('getUser', undefined, (draft) => {
            // Directly update the draft with new user data
            if (draft.user) {
              Object.assign(draft.user, updateData);  // Apply updateData to the draft
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Undo optimistic update if query fails
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
              url: 'users/update-avatar',
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
  useGetUsersQuery,
  useGoogleLoginMutation,
  useRefreshUserMutation,
  useOtpLoginMutation,
  useOtpVerifyMutation,
  useVerifyResetPasswordMutation,
  useResetPasswordMutation,
} = userApiSlice;
