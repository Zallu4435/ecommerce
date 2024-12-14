import { crudApiSlice } from './crudApiSlice';

export const productApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all products
    getProducts: builder.query({
      query: () => '/products/getProducts',
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Entity', id })),
              { type: 'Entity', id: 'products-LIST' },
            ]
          : [{ type: 'Entity', id: 'products-LIST' }],
        }),
 
    // Fetch product details by ID
    getProductById: builder.query({
      query: (id) => `/products/getProduct/${id}`,
      providesTags: (result, error, id) => [{ type: 'Entity', id }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddEntityMutation: useAddProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  useDeleteEntityMutation: useDeleteProductMutation,
  useBanEntityMutation: useBanProductMutation,
} = productApiSlice;
