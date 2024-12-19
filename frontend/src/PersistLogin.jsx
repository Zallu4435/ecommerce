// import { Outlet } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useRefreshUserMutation } from './redux/apiSliceFeatures/userApiSlice';
// import { selectCurrentToken, setCredentials } from './redux/slice/userSlice';

// const PersistLogin = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const token = useSelector(selectCurrentToken);
//   const [refreshUser] = useRefreshUserMutation();
//   const dispatch = useDispatch()

//   useEffect(() => {
//     const verifyRefreshToken = async () => {
//       console.log('verifying refresh token');
//       try {
//         const Response = await refreshUser();
//         console.log(Response.data.accessToken, "response from the refreshhhhhh")
//         dispatch(setCredentials( Response.data.user , Response.data.accessToken ))
//       }
//       catch (err) {
//         console.error(err);
//       }
//       finally {
//         setIsLoading(false);
//       }
//     }

//     !token ? verifyRefreshToken() : setIsLoading(false);

//   }, []);

//   return (
//     <>
//       {isLoading
//         ? <p>Loading...</p>
//         : <Outlet />}
//     </>
//   );
// }

// export default PersistLogin;


import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRefreshUserMutation } from './redux/apiSliceFeatures/userApiSlice';
import { useRefreshAdminMutation } from './redux/apiSliceFeatures/AdminApiSlice'; // Assuming admin API exists
import { selectCurrentToken, setCredentials } from './redux/slice/userSlice';
import { selectCurrentAdminToken, setAdminCredentials } from './redux/slice/adminSlice';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Select tokens for both user and admin
  const userToken = useSelector(selectCurrentToken); // User token
  const adminToken = useSelector(selectCurrentAdminToken); // Admin token
  const admin = useSelector(state => state.admin.isAdminAuthenticated)

  // Refresh mutations for user and admin
  const [refreshUser] = useRefreshUserMutation();
  const [refreshAdmin] = useRefreshAdminMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log('Verifying refresh token');

      try {
        if (!userToken && !adminToken) {
          console.log('No token found. Attempting to refresh...');
          // Check for user token
          const userResponse = await refreshUser();
          if (userResponse?.data?.accessToken) {
            console.log(userResponse.data.accessToken, 'User refreshed successfully');
            dispatch(setCredentials(userResponse.data.user, userResponse.data.accessToken));
            console.log('updated updated ')
          }

          // Check for admin token
          const adminResponse = await refreshAdmin();
          console.log(adminResponse, "adminResponse")
          console.log(adminResponse?.data?.adminAccessToken, "hahahah")

          if (adminResponse?.data?.adminAccessToken) {
            console.log(adminResponse.data.adminAccessToken, 'Admin refreshed successfully');
            dispatch(
              setAdminCredentials({
                admin: adminResponse.data.admin,
                adminAccessToken: adminResponse.data.adminAccessToken,
              })
            );
          }
        }
      } catch (err) {
        console.error('Error during refresh:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Call verification only if no token exists
    if (!userToken && !adminToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [userToken, adminToken, refreshUser, refreshAdmin, dispatch]);


  console.log(admin, "adminToken in persist login ")
  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
