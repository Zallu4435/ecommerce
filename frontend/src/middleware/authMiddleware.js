import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../server";
import { clearCredentials, setCredentials } from "../redux/slice/userSlice";
import {
  clearAdminCredentials,
  setAdminCredentials,
} from "../redux/slice/adminSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${server}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery("/refresh-token", api, extraOptions);
    if (refreshResult?.data) {
      const user = api.getState().user.user;
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};


// ADMIN SIDE
const adminBaseQuery = fetchBaseQuery({
  baseUrl: `${server}/admin`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const adminToken = getState().admin.adminToken;
    if (adminToken) {
      headers.set("authorization", `Bearer ${adminToken}`);
    }
    return headers;
  },
});

export const adminBaseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await adminBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await adminBaseQuery(
      "/admin-refresh-token",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const { admin, adminAccessToken } = refreshResult.data;
      api.dispatch(setAdminCredentials({ admin, adminAccessToken }));
      result = await adminBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearAdminCredentials());
    }
  }

  return result;
};
