import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const addressPasswordApi = createApi({
  reducerPath: "addressPasswordApi",
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
        body: updatedAddress,
      }),
      invalidatesTags: ["Addresses"],
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
    }),

    // getOrders: builder.query({
    //   query: ({ page , limit }) => ({
    //     url: 'orders/getOrders',
    //     params: { page, limit },
    //   }),
    // }),
    getOrders: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `orders/getOrders?page=${page}&limit=${limit}`,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        if (currentCache) {
          const newOrders = newItems.orders.filter(
            (newOrder) =>
              !currentCache.orders.some(
                (existingOrder) => existingOrder._id === newOrder._id
              )
          );

          return {
            ...currentCache,
            orders: [...currentCache.orders, ...newOrders],
          };
        }
        return newItems;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
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
  useGetCheckoutCouponsQuery,
} = addressPasswordApi;
