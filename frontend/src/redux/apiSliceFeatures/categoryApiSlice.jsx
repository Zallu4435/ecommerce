import { crudApiSlice } from "./crudApiSlice";

export const categoryApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/category/getCategories",
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "category", id })),
              { type: "category", id: "categories-LIST" },
            ]
          : [{ type: "category", id: "categories-LIST" }],
    }),

    getCategoryById: builder.query({
      query: (id) => `/category/getCategory/${id}`,
      providesTags: (result, error, id) => [{ type: "Entity", id }],
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
