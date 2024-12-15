import { crudApiSlice } from './crudApiSlice';

export const categoryApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all categories
    getCategories: builder.query({
      query: () => '/categories/getCategories',
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Entity', id })),
              { type: 'Entity', id: 'categories-LIST' },
            ]
          : [{ type: 'Entity', id: 'categories-LIST' }],
    }),

    // Fetch category details by ID
    getCategoryById: builder.query({
      query: (id) => `/categories/getCategory/${id}`,
      providesTags: (result, error, id) => [{ type: 'Entity', id }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
} = categoryApiSlice;
