import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../server";
import { clearCredentials, setCredentials } from "../redux/slice/userSlice";
import {
  clearAdminCredentials,
  setAdminCredentials,
} from "../redux/slice/adminSlice";
import { toast } from "react-toastify";

// Flag to prevent multiple toast notifications for blocked users
let hasShownBlockedToast = false;
let hasRedirectedToLogin = false;

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

  // Handle blocked users (403)
  if (result?.error?.status === 403 && result?.error?.data?.isBlocked) {
    api.dispatch(clearCredentials());

    // Show toast only once
    if (!hasShownBlockedToast) {
      hasShownBlockedToast = true;
      toast.error(result.error.data.message || "Your account has been blocked. Please contact support.", {
        position: "top-center",
        autoClose: 5000,
      });

      // Reset flag after 6 seconds (after toast closes)
      setTimeout(() => {
        hasShownBlockedToast = false;
      }, 6000);
    }

    // Always redirect to login page (outside toast check) - but only once
    if (!hasRedirectedToLogin) {
      hasRedirectedToLogin = true;
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }, 1500);
    }

    return result;
  }

  // Handle unauthorized (401)
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery("/users/refresh-token", api, extraOptions);
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
