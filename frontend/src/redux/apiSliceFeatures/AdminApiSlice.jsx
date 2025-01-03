import { createApi } from "@reduxjs/toolkit/query/react";
import { adminBaseQueryWithReauth } from "../../middleware/authMiddleware";
import { clearAdminCredentials } from "../slice/adminSlice";
import { useSearchProductsQuery } from "./productApiSlice";

export const adminApiSlice = createApi({
  reducerPath: "adminApi", // Corrected name
  baseQuery: adminBaseQueryWithReauth, // Changed from adminBaseQuery to baseQuery
  tagTypes: ["User", "Avatar"], // Tags for caching and invalidation
  endpoints: (builder) => ({
    // Block user mutation
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/block-user/${userId}`, // Assuming you need a user ID in the URL
        method: "POST", // Assuming the request method is POST
      }),
    }),

    userDetails: builder.query({
      query: (id) => `/get-user-details/${id}`,
      providesTags: (result, error, id) => [{ type: "Entity", id }],
    }),

    refreshAdmin: builder.mutation({
      query: () => ({
        url: "/admin-refresh-token",
        method: "GET",
      }),
    }),

    logoutAdmin: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include", // Ensure cookies are included in the request
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearAdminCredentials());
        } catch (err) {
          console.error(err);
        }
      },
    }),
    // Admin login mutation
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/login-admin", // The admin login route
        method: "POST", // POST request
        body: credentials, // Passing the email and password in the request body
      }),
    }),

    getMetrics: builder.query({
      query: ({ type, year, month, week }) =>
        `/metrics?type=${type}&year=${year}&month=${month}&week=${week}`,
    }),

    searchUsers: builder.query({
      query: (searchTerm) => `/users/search?query=${searchTerm}`,
    }),

    searchAdminProducts: builder.query({
      query: (searchTerm) => `/products/search?query=${searchTerm}`,
    }),

    searchAdminOrders: builder.query({
      query: (searchTerm) => `/orders/search?query=${searchTerm}`,
    }),

    
    searchAdminCategories: builder.query({
      query: (searchTerm) => `/categories/search?query=${searchTerm}`,
    }),

    searchAdminCoupons: builder.query({
      query: (searchTerm) => `/coupons/search?query=${searchTerm}`,
    }),

    searchUsersIndividualOrders: builder.query({
      query: (searchTerm) => `/orders/search-individual-order?query=${searchTerm}`,
    }),

  }),
});

export const {
  useBlockUserMutation,
  useLoginAdminMutation,
  useRefreshAdminMutation,
  useUserDetailsQuery,
  useLogoutAdminMutation,
  useGetMetricsQuery,
  useSearchUsersQuery,
  useSearchAdminProductsQuery,
  useSearchAdminCategoriesQuery,
  useSearchAdminOrdersQuery,
  useSearchAdminCouponsQuery,
  useSearchUsersIndividualOrdersQuery,
} = adminApiSlice; // Correct export for loginAdmin
