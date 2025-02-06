import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshUserMutation } from "./redux/apiSliceFeatures/userApiSlice";
import { useRefreshAdminMutation } from "./redux/apiSliceFeatures/AdminApiSlice";
import { selectCurrentToken, setCredentials } from "./redux/slice/userSlice";
import {
  selectCurrentAdminToken,
  setAdminCredentials,
} from "./redux/slice/adminSlice";
import LoadingSpinner from "./components/LoadingSpinner";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);

  const userToken = useSelector(selectCurrentToken);
  const adminToken = useSelector(selectCurrentAdminToken);

  const [refreshUser] = useRefreshUserMutation();
  const [refreshAdmin] = useRefreshAdminMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        if (!userToken && !adminToken) {
          const userResponse = await refreshUser();
          if (userResponse?.data?.accessToken) {
            dispatch(
              setCredentials(
                userResponse.data.user,
                userResponse.data.accessToken
              )
            );
          }

          const adminResponse = await refreshAdmin();

          if (adminResponse?.data?.adminAccessToken) {
            dispatch(
              setAdminCredentials({
                admin: adminResponse.data.admin,
                adminAccessToken: adminResponse.data.adminAccessToken,
              })
            );
          }
        }
      } catch (err) {
        console.error("Error during refresh:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userToken && !adminToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [userToken, adminToken, refreshUser, refreshAdmin, dispatch]);

  return <>{isLoading ? <LoadingSpinner /> : <Outlet />}</>;
};

export default PersistLogin;
