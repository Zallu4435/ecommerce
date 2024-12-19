import { crudApiSlice } from "./crudApiSlice";

export const categoryApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all categories
    getCategories: builder.query({
      query: () => '/category/getCategories',
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Entity', id })), // Tags for individual categories
              { type: 'Entity', id: 'categories-LIST' }, // Tag for the entire list
            ]
          : [{ type: 'Entity', id: 'categories-LIST' }],
    }),

    // Fetch category details by ID
    getCategoryById: builder.query({
      query: (id) => `/category/getCategory/${id}`,
      providesTags: (result, error, id) => [{ type: 'Entity', id }],
    }),
  }),
});


export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddEntityMutation: useAddProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  useDeleteEntityMutation: useDeleteProductMutation,
} = categoryApiSlice;
