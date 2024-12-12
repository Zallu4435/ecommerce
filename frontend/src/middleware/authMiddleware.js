import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../server';
import { logout, setAccessToken } from '../redux/slice/userSlice';

// Base query with authentication and reauthentication logic
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: `${server}/users`,
    credentials: 'include', // Ensures cookies are sent with each request
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) { // 401 means the token is expired
    // Try refreshing the token
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions);
    
    if (refreshResult.data) {
      // If refresh is successful, retry the original request with the new token
      const { accessToken } = refreshResult.data;
      api.dispatch(setAccessToken(accessToken)); // Store the new token in Redux or context
      
      // Retry the original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // If refresh fails, redirect to login page
      api.dispatch(logout()); // Dispatch logout action or redirect to login
    }
  }

  return result;
};
