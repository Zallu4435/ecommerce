import { crudApiSlice } from "./crudApiSlice";

export const orderApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersOrders: builder.query({
      query: () => "orders/getUsersOrders",
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/getOrder/${id}`,
      providesTags: ["Order"],
    }),

    fetchUserOrders: builder.query({
      query: (userId) => `/orders/user-order-modal?userId=${userId}`,
      providesTags: ["Order"],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, productId, reason }) => ({
        url: `/orders/${orderId}/cancel/${productId}`,
        method: "PATCH",
        body: { reason },
        invalidatesTags: ["Order"],
      }),
    }),

    updateOrderStatus: builder.mutation({
      query: (orders) => ({
        url: "/orders/update-bulk",
        method: "PATCH",
        body: orders,
        invalidatesTags: ["Order"],
      }),
    }),
    getAddressByOrderId: builder.query({
      query: (orderId) => `orders/${orderId}/address`,
      invalidatesTags: ["Order"],
    }),

    returnOrder: builder.mutation({
      query: ({ orderId, productId, reason }) => ({
        url: `/orders/${orderId}/return/${productId}`,
        method: "PATCH",
        body: { reason },
        invalidatesTags: ["Order"],
      }),
    }),

    lazyGetOrderDetails: builder.query({
      query: ({ orderId }) => `/orders/order-invoice/${orderId}`,
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetUsersOrdersQuery,
  useGetOrderByIdQuery,
  useFetchUserOrdersQuery,
  useCancelOrderMutation,
  useCancelIndividualOrderMutation,
  useUpdateOrderStatusMutation,
  useGetAddressByOrderIdQuery,
  useReturnOrderMutation,
  useLazyGetOrderDetailsQuery,
} = orderApiSlice;
