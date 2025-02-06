import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../server";

export const salesApiSlice = createApi({
  reducerPath: "salesApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}` }),
  tagTypes: ["Sales"],
  endpoints: (builder) => ({
    getSalesData: builder.query({
      query: (params) => ({
        url: "sales/getSalesData",
        method: "GET",
        params: params,
      }),
      providesTags: ["Sales"],
    }),
    getSalesOverview: builder.query({
      query: () => "sales/getSalesOverview",
      providesTags: ["Sales"],
    }),

    getTopSellingProducts: builder.query({
      query: () => "sales/getTopSellingProducts",
      providesTags: ["Sales"],
    }),

    getTopSellingCategories: builder.query({
      query: () => "sales/getTopSellingCategories",
    }),

    getTopSellingBrands: builder.query({
      query: () => "sales/getTopSellingBrands",
    }),

    getSaleById: builder.query({
      query: (id) => `sales/getSaleById/${id}`,
      providesTags: ["Sales"],
    }),

    updateSaleStatus: builder.mutation({
      query: (sale) => ({
        url: "sales/updateSaleStatus",
        method: "PATCH",
        body: sale,
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetSalesDataQuery,
  useGetSalesOverviewQuery,
  useGetSaleByIdQuery,
  useUpdateSaleStatusMutation,
  useGetTopSellingProductsQuery,
  useGetTopSellingBrandsQuery,
  useGetTopSellingCategoriesQuery
} = salesApiSlice;
