import { crudApiSlice } from "./crudApiSlice";

export const orderApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsersOrders: builder.query({
      query: () => "orders/getUsersOrders",
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/order-details/${id}`,
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

    getOrderInvoiceDetails: builder.query({
      query: ({ orderId }) => `/orders/order-details/${orderId}`,
      invalidatesTags: ["Order"],
    }),

    getAllOrdersForAdmin: builder.query({
      query: ({ page = 1, limit = 10, sort = "desc" }) =>
        `/orders/admin/all-orders?page=${page}&limit=${limit}&sort=${sort}`,
      providesTags: ["Order"],
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
  useLazyGetAddressByOrderIdQuery,
  useReturnOrderMutation,
  useLazyGetOrderInvoiceDetailsQuery,
  useGetAllOrdersForAdminQuery,
} = orderApiSlice;
