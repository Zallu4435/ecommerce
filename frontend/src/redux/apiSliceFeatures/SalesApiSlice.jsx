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
      query: (params) => ({
        url: "sales/getSalesOverview",
        method: "GET",
        params: params,
      }),
      providesTags: ["Sales"],
    }),

    getTopSellingProducts: builder.query({
      query: (params) => ({
        url: "sales/getTopSellingProducts",
        method: "GET",
        params: params,
      }),
      providesTags: ["Sales"],
    }),

    getTopSellingCategories: builder.query({
      query: (params) => ({
        url: "sales/getTopSellingCategories",
        method: "GET",
        params: params,
      }),
    }),

    getTopSellingBrands: builder.query({
      query: (params) => ({
        url: "sales/getTopSellingBrands",
        method: "GET",
        params: params,
      }),
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
  useLazyGetSalesDataQuery,
  useGetSalesOverviewQuery,
  useGetSaleByIdQuery,
  useUpdateSaleStatusMutation,
  useGetTopSellingProductsQuery,
  useLazyGetTopSellingProductsQuery,
  useGetTopSellingBrandsQuery,
  useGetTopSellingCategoriesQuery
} = salesApiSlice;
