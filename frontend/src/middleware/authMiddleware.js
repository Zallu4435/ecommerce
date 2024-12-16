import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../server';
import { clearCredentials, setCredentials } from '../redux/slice/userSlice';

// export const baseQueryWithReauth = async (args, api, extraOptions) => {
//   const baseQuery = fetchBaseQuery({
//     baseUrl: `${server}/users`,
//     credentials: 'include',
//     prepareHeaders: (headers, { getState }) => {
//       const accessToken = getState().user.accessToken;
//       if (accessToken) {
//         headers.set('Authorization', `Bearer ${accessToken}`);
//       }
//       return headers;
//     },
//   });
 
//   let result = await baseQuery(args, api, extraOptions);

//   // Handle 401 Unauthorized (token expiration)
//   if (result.error?.status === 401) {
//     console.log("Token expired, attempting to refresh");
    
//     const refreshResult = await baseQuery({
//       url: '/refresh-token',
//       method: 'POST'
//     }, api, extraOptions);

//     if (refreshResult.data) {
//       // Update access token in Redux store
//       api.dispatch(setAccessToken(refreshResult.data.accessToken));
      
//       // Retry original request with new token
//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       // Logout if refresh fails
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };


const baseQuery = fetchBaseQuery({
  baseUrl: `${server}/users`,
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
    console.log('Sending refresh token');
    // send refresh token to get new access token 
    const refreshResult = await baseQuery('/refresh-token', api, extraOptions);
    console.log(refreshResult, "refreshresult");
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      // store the new token 
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      console.log(user, "user")
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};