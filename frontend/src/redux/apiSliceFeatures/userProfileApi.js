import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Addresses"],
  endpoints: (builder) => ({
    getAddresses: builder.query({
      query: () => "userProfile/addresses",
      providesTags: ["Addresses"],
    }),

    addAddress: builder.mutation({
      query: (addressData) => ({
        url: "userProfile/address",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["Addresses"],
    }),

    editAddress: builder.mutation({
      query: ({ id, updatedAddress }) => ({
        url: `userProfile/address`,
        method: "PUT",
        body: { _id: id, ...updatedAddress },
      }),
      invalidatesTags: ["Addresses"],
    }),

    getAddressById: builder.query({
      query: (id) => `userProfile/address/${id}`,
      providesTags: ["Addresses"],
    }),

    removeAddress: builder.mutation({
      query: (id) => ({
        url: `userProfile/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),

    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "userProfile/change-password",
        method: "PUT",
        body: passwordData,
      }),
    }),

    checkoutAddress: builder.query({
      query: () => "/userProfile/checkout-address",
    }),

    processPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/userProfile/process-payment",
        method: "POST",
        body: paymentData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate Cart in unifiedApi when payment is processed
          const { unifiedApiSlice } = await import("./unifiedApiSlice");
          dispatch(unifiedApiSlice.util.invalidateTags(["Cart"]));
        } catch (err) {
          // do nothing
        }
      },
    }),

    getOrders: builder.query({
      query: ({ page, limit, sortOrder }) =>
        `orders/getOrders?page=${page}&limit=${limit}&sort=${sortOrder}`,
      providesTags: ["Order"],
    }),

    particularUser: builder.query({
      query: ({ page = 1, limit = 10, email }) =>
        `orders/get-users-individual-orders?page=${page}&limit=${limit}&email=${email}`,
      providesTags: ["Order"],
    }),

    checkProductStock: builder.query({
      query: ({ productId, quantity }) => ({
        url: `/products/${productId}/stock`,
        params: { quantity },
      }),
    }),

    getCheckoutCoupons: builder.query({
      query: (productId) => `/coupons/checkout-coupons/${productId}`,
    }),

    contact: builder.mutation({
      query: (data) => ({
        url: "/userProfile/contact",
        method: "POST",
        body: data,
      }),
    }),

    setPrimaryAddress: builder.mutation({
      query: (id) => ({
        url: `userProfile/address/set-primary/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Addresses"],
    }),

    retryPayment: builder.mutation({
      query: (data) => ({
        url: "/userProfile/retry-payment",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate Cart in unifiedApi when a payment is retried successfully
          const { unifiedApiSlice } = await import("./unifiedApiSlice");
          dispatch(unifiedApiSlice.util.invalidateTags(["Cart"]));
        } catch (err) {
          // do nothing
        }
      },
    }),

    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: "/userProfile/verify-razorpay-payment",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate Cart in unifiedApi when Razorpay payment is verified
          const { unifiedApiSlice } = await import("./unifiedApiSlice");
          dispatch(unifiedApiSlice.util.invalidateTags(["Cart"]));
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useEditAddressMutation,
  useGetAddressByIdQuery,
  useRemoveAddressMutation,
  useChangePasswordMutation,
  useCheckoutAddressQuery,
  useProcessPaymentMutation,
  useGetOrdersQuery,
  useCheckProductStockQuery,
  useGetCheckoutCouponsQuery,
  useContactMutation,
  useParticularUserQuery,
  useSetPrimaryAddressMutation,
  useRetryPaymentMutation,
  useVerifyRazorpayPaymentMutation,
} = userProfileApi;
