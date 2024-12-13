import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../middleware/authMiddleware';

export const productApiSlice = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Fetch all products
    getProducts: builder.query({
      query: () => '/getProducts',
    }),

    // Fetch product details by ID
    getProductById: builder.query({
      query: (productId) => `/getProduct/${productId}`,
    }),

    // Add new product
    addProduct: builder.mutation({
      query: (productData) => ({
        url: '/add-product',
        method: 'POST',
        body: productData,
      }),
    }),

    // Update product details
    updateProduct: builder.mutation({
      query: (updateData) => ({
        url: '/update-product',
        method: 'PUT',
        body: updateData,
      }),
    }),

    // Delete a product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/delete-product/${productId}`,
        method: 'DELETE',
      }),
    }),

    // Search products by name or category
    searchProducts: builder.query({
      query: (searchQuery) => ({
        url: `/search-products?query=${searchQuery}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for each API call
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchProductsQuery,
} = productApiSlice;
