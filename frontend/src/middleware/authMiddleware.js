import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../server';
import { clearCredentials, setCredentials } from '../redux/slice/userSlice';
import { clearAdminCredentials, setAdminCredentials } from '../redux/slice/adminSlice';


const baseQuery = fetchBaseQuery({
  baseUrl: `${server}`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});



export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // send refresh token to get new access token 
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      // store the new token 
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      // retry the original query with new access token
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
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // console.log(getState().admin.adminToken)
    const adminToken = getState().admin.adminToken;
// console.log(adminToken, "admin")
    if (adminToken) {
      headers.set('authorization', `Bearer ${adminToken}`);
    }
    return headers;
  },
});

export const adminBaseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await adminBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log('Sending refresh token for admin');

    // Send refresh token request
    const refreshResult = await adminBaseQuery('/admin-refresh-token', api, extraOptions);
    console.log(refreshResult, 'refreshResult');

    if (refreshResult?.data) {
      const { admin, adminAccessToken } = refreshResult.data;

      // Store the new token
      api.dispatch(setAdminCredentials({ admin, adminAccessToken }));

      // Retry the original query
      result = await adminBaseQuery(args, api, extraOptions);
    } else {
      // Clear credentials if refresh fails
      api.dispatch(clearAdminCredentials());
    }
  }

  return result;
};
