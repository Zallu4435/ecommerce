import { crudApiSlice } from './crudApiSlice';

export const orderApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all orders
    getOrders: builder.query({
      query: () => '/orders/getOrders',
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Entity', id })),
              { type: 'Entity', id: 'orders-LIST' },
            ]
          : [{ type: 'Entity', id: 'orders-LIST' }],
    }),

    // Fetch order details by ID
    getOrderById: builder.query({
      query: (id) => `/orders/getOrder/${id}`,
      providesTags: (result, error, id) => [{ type: 'Entity', id }],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = orderApiSlice;
