import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../middleware/authMiddleware";

export const walletApiSlice = createApi({
  reducerPath: "walletApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: () => "/wallet/transactions",
    }),
    updateWallet: builder.mutation({
      query: (payload) => ({
        url: "/wallet/add-money",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useGetTransactionsQuery, useUpdateWalletMutation } =
  walletApiSlice;
