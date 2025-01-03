import { crudApiSlice } from './crudApiSlice';

export const productApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all products
    getProducts: builder.query({
      query: () => '/products/getProducts',
      providesTags:['Products'],
    }),
 
    getShopProducts: builder.query({
      query: () => '/products/getShopProducts',
      providesTags:['Products'],
    }),

    getRelatedProducts: builder.query({
      query: (category) => `/products/relatedProduct?category=${category}`,
      providesTags:['Products'],
    }),
    // Fetch product details by ID
    getProductById: builder.query({
      query: (id) => `/products/getProduct/${id}`,
      providesTags: (result, error, id) => [{ type: 'Entity', id }],
    }),

    getPopularProducts: builder.query({
      query: () => '/products/get-popular-prducts'
    }),

    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/products/search',
        method: 'GET',
        params: { q: searchTerm }
      }),
    }),

    getFilteredProducts: builder.query({
      query: (params) => ({
        url: '/products/filter',
        method: 'GET',
        params: {
          sizes: params.sizes.join(','),
          colors: params.colors.join(','),
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          sortBy: params.sortBy,
          page: params.page,
          limit: params.limit,
          category: params.category
        },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetShopProductsQuery,
  useGetPopularProductsQuery,
  useGetRelatedProductsQuery,
  useGetFilteredProductsQuery,
  useSearchProductsQuery,
  useAddEntityMutation: useAddProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  useDeleteEntityMutation: useDeleteProductMutation,
  useBanEntityMutation: useBanProductMutation,

} = productApiSlice;
