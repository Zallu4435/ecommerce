import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../server';

export const salesApiSlice = createApi({
  reducerPath: 'salesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}` }), // Ensure server is correctly defined
  tagTypes: ['Sales'], // Single tag type for sales-related data
  endpoints: (builder) => ({
    // Get sales data with pagination and filters
    getSalesData: builder.query({
      query: ({ page = 1, pageSize = 10, dateRange, orderStatusFilter }) => {
        let queryString = `sales/getSalesData?page=${page}&pageSize=${pageSize}`;
        if (dateRange) queryString += `&dateRange=${dateRange}`;
        if (orderStatusFilter) queryString += `&orderStatusFilter=${orderStatusFilter}`;
        return queryString;
      },
      providesTags: ['Sales'], // Provides 'Sales' cache tag
    }),

    // Fetch sales overview (Total revenue, Total orders, etc.)
    getSalesOverview: builder.query({
      query: () => 'sales/getSalesOverview',
      providesTags: ['Sales'], // Provides 'Sales' cache tag
    }),

    // Fetch specific sale details by ID
    getSaleById: builder.query({
      query: (id) => `sales/getSaleById/${id}`,
      providesTags: ['Sales'], // Provides 'Sales' cache tag
    }),

    // Update sale status (e.g., status update)
    updateSaleStatus: builder.mutation({
      query: (sale) => ({
        url: 'sales/updateSaleStatus', // Assuming there's an endpoint for this
        method: 'PATCH',
        body: sale, // Sale data to update
      }),
      invalidatesTags: ['Sales'], // Invalidates 'Sales' cache tag for data consistency
    }),

    // Fetch top selling products (for sales analysis)
    getTopSellingProducts: builder.query({
      query: () => 'sales/getTopSellingProducts',
      providesTags: ['Sales'], // Provides 'Sales' cache tag
    }),
  }),
});

export const {
  useGetSalesDataQuery,
  useGetSalesOverviewQuery,
  useGetSaleByIdQuery,
  useUpdateSaleStatusMutation,
  useGetTopSellingProductsQuery,
} = salesApiSlice;
