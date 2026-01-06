import { createApi } from "@reduxjs/toolkit/query/react";
import { adminBaseQueryWithReauth } from "../../middleware/authMiddleware";
import { clearAdminCredentials } from "../slice/adminSlice";

export const adminApiSlice = createApi({
  reducerPath: "adminApi",
  baseQuery: adminBaseQueryWithReauth,
  tagTypes: ["User", "Order", "Entity", "Avatar"],
  endpoints: (builder) => ({
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/ban/${userId}`,
        method: "PATCH",
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
        credentials: "include",
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
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/login-admin",
        method: "POST",
        body: credentials,
      }),
    }),

    getMetrics: builder.query({
      query: ({ type, year, month, week }) =>
        `/metrics?type=${type}&year=${year}&month=${month}&week=${week}`,
    }),

    searchUsers: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/users/search?${queryString}`;
      },
      providesTags: ["User"],
    }),

    searchAdminProducts: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/products/search?${queryString}`;
      },
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
      query: ({ query, email }) => {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (email) params.set("email", email);
        return `/orders/search-individual-order?${params.toString()}`;
      },
    }),

    // Admin fetch of a particular user's orders (proxy route)
    getUsersIndividualOrders: builder.query({
      query: ({ page = 1, limit = 10, email }) =>
        `/orders/get-users-individual-orders?page=${page}&limit=${limit}&email=${encodeURIComponent(
          email || ""
        )}`,
      providesTags: ["Order"],
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
  useGetUsersIndividualOrdersQuery,
} = adminApiSlice; 
