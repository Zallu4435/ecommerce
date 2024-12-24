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
    
    

    
    updateOrders: builder.mutation({
      query: (orders) => ({
        url: "/orders/update-bulk", // Assume a bulk update endpoint
        method: "PATCH",
        body: orders,
      }),
      invalidatesTags: ["Order"],

    }),

  }),
});

export const {
  useGetUsersOrdersQuery,
  useGetOrderByIdQuery,
  useFetchUserOrdersQuery,
  useUpdateOrdersMutation,
} = orderApiSlice;
