import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";
import { uploadImageToCloudinary } from "../../server";
import { clearCredentials } from "../slice/userSlice";

export const userApiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Avatar"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "users/getUser",
      providesTags: ["User", "Avatar"],
    }),

    googleLogin: builder.mutation({
      query: (userData) => ({
        url: "users/google-login",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    getUsers: builder.query({
      query: ({ page, limit = 5 }) =>
        `users/getUsers?page=${page}&limit=${limit}`,
      providesTags: ["User", "Avatar"],
    }),

    registerUser: builder.mutation({
      query: (userData) => ({
        url: "users/signup-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "users/login-user",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    refreshUser: builder.mutation({
      query: () => ({
        url: "users/refresh-token",
        method: "GET",
      }),
    }),

    activateUser: builder.mutation({
      query: (activationData) => ({
        url: "users/activation/:token",
        method: "POST",
        body: activationData,
      }),
      invalidatesTags: ["User"],
    }),

    otpLogin: builder.mutation({
      query: (credentials) => ({
        url: "users/otp-login",
        method: "POST",
        body: credentials,
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
        body: { token, otp },
      }),
    }),

    verifyResetPassword: builder.mutation({
      query: ({ token, otp }) => ({
        url: "users/verify-reset-password",
        method: "POST",
        body: { token, otp },
      }),
    }),

    resetPassword: builder.mutation({
      query: (password) => ({
        url: "users/reset-password",
        method: "POST",
        body: password,
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "users/logout",
        method: "POST",
        credentials: "include",
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

    updateUserInfo: builder.mutation({
      query: ({ updateData, oldEmail }) => ({
        url: "users/update-user-info",
        method: "PUT",
        body: { ...updateData, oldEmail },
      }),
      invalidatesTags: ["User"],

      async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
        const { oldEmail } = updateData;
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData("getUser", undefined, (draft) => {
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

    updateAvatar: builder.mutation({
      queryFn: async (formData, _queryApi, _extraOptions, baseQuery) => {
        try {
          const avatarFile = formData.get("avatar");
          if (avatarFile) {
            const avatarUrl = await uploadImageToCloudinary(avatarFile);

            return await baseQuery({
              url: "users/update-avatar",
              method: "PUT",
              body: { avatar: avatarUrl },
            });
          }
          return {
            error: { status: "CUSTOM_ERROR", data: "No avatar file provided" },
          };
        } catch (error) {
          return { error: { status: "CUSTOM_ERROR", data: error.message } };
        }
      },
      invalidatesTags: ["Avatar", "User"],

      async onQueryStarted(formData, { dispatch, queryFulfilled }) {
        const avatarFile = formData.get("avatar");
        const avatarPreviewUrl = URL.createObjectURL(avatarFile);

        const patchResult = dispatch(
          userApiSlice.util.updateQueryData("getUser", undefined, (draft) => {
            if (draft.user) {
              draft.user.avatar = avatarPreviewUrl;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            userApiSlice.util.updateQueryData("getUser", undefined, (draft) => {
              if (draft.user) {
                draft.user.avatar = data.avatarUrl;
                URL.revokeObjectURL(avatarPreviewUrl);
              }
            })
          );
        } catch {
          patchResult.undo();
          URL.revokeObjectURL(avatarPreviewUrl);
        }
      },
    }),
  }),
});

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
