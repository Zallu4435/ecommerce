import { crudApiSlice } from "./crudApiSlice";

export const categoryApiSlice = crudApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "/category/getCategories",
      providesTags: (result) => {
        const categories = result?.categories || [];
        return [
          ...categories.map((c) => ({ type: "Entity", id: c._id })),
          { type: "Entity", id: "category-LIST" },
        ];
      },
    }),

    getCategoryById: builder.query({
      query: (id) => `/category/getCategory/${id}`,
      providesTags: (result, error, id) => [{ type: "Entity", id }],
    }),

    getPopularCategories: builder.query({
      query: () => "/category/getPopularCategories",
      providesTags: [{ type: "Entity", id: "category-LIST" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetPopularCategoriesQuery,
  useAddEntityMutation: useAddProductMutation,
  useUpdateEntityMutation: useUpdateProductMutation,
  useDeleteEntityMutation: useDeleteProductMutation,
} = categoryApiSlice;
