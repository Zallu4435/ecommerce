import { crudApiSlice } from "./crudApiSlice";

export const productApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, limit = 5 }) =>
        `/products/getProducts?page=${page}&limit=${limit}`,
      providesTags: (result) => [{ type: "Entity", id: "products-LIST" }],
    }),

    getShopProducts: builder.query({
      query: () => "/products/getShopProducts",
      providesTags: (result) => [{ type: "Entity", id: "products-LIST" }],
    }),

    getRelatedProducts: builder.query({
      query: (category) => `/products/relatedProduct?category=${category}`,
      providesTags: (result) => [{ type: "Entity", id: "products-LIST" }],
    }),
    getProductById: builder.query({
      query: (arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        const params = typeof arg === "object" ? { ...arg } : {};
        delete params.id; // Remove id from params
        return {
          url: `/products/getProduct/${id}`,
          params,
        };
      },
      providesTags: (result, error, arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        return [{ type: "Entity", id }];
      },
      keepUnusedDataFor: 0, // Disable caching to ensure fresh data for admin updates
    }),

    getPopularProducts: builder.query({
      query: () => "/products/get-popular-products",
    }),

    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: "/products/search",
        method: "GET",
        params: { q: searchTerm },
      }),
    }),

    getFilteredProducts: builder.query({
      query: (params) => ({
        url: "/products/filter",
        method: "GET",
        params: {
          sizes: params.sizes.join(","),
          colors: params.colors.join(","),
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          sortBy: params.sortBy,
          page: params.page,
          limit: params.limit,
          category: params.category,
          search: params.search,
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
