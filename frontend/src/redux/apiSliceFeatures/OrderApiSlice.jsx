import { crudApiSlice } from './crudApiSlice';

export const orderApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all orders
    getUsersOrders: builder.query({
      query: () => 'orders/getUsersOrders', 
      providesTags:['Order'],
    }),

    // Fetch order details by ID
    getOrderById: builder.query({
      query: (id) => `/orders/getOrder/${id}`,
      providesTags:['Order'],
    }),

    fetchUserOrders: builder.query({
      query: (userId) => `/orders/user-order-modal?userId=${userId}`,
    }),
    
    
    cancelOrder: builder.mutation({
      query: ({ orderId, productId }) => ({
        url: `/orders/${orderId}/cancel/${productId}`, // Pass productId as a query string
        method: 'PATCH',
      }),
    }),
    

    // cancelIndividualOrder: builder.mutation({
    //   query: ({ orderId, productId }) => ({
    //     url: `orders/orders/${orderId}/cancel/${productId}`,
    //     method: 'PATCH',
    //   }),
    //   invalidatesTags:['Order']
    // }),
    
    updateOrderStatus: builder.mutation({
      query: (orders) => ({
        url: "/orders/update-bulk", // Assume a bulk update endpoint
        method: "PATCH",
        body: orders,
      }),
      invalidatesTags: ["Order"],

    }),
    getAddressByOrderId: builder.query({
      query: (orderId) => `orders/${orderId}/address`, // Adjust the endpoint as per your backend
    }),

    returnOrder: builder.mutation({
      query: ({ orderId, productId }) => ({
        url: `/orders/${orderId}/return/${productId}`,
        method: 'PATCH',
      }),
    }),


    
    lazyGetOrderDetails: builder.query({
      query: ({orderId}) => `/orders/order-invoice/${orderId}`, // Assuming your backend has an endpoint like /orders/:id
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
  useLazyGetOrderDetailsQuery
} = orderApiSlice;
