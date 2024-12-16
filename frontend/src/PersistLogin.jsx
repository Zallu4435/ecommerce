import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRefreshUserMutation } from './redux/apiSliceFeatures/userApiSlice';
import { selectCurrentToken, setCredentials } from './redux/slice/userSlice';

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(selectCurrentToken);
  const [refreshUser] = useRefreshUserMutation();
  const dispatch = useDispatch()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      console.log('verifying refresh token');
      try {
        const Response = await refreshUser();
        console.log(Response.data.accessToken, "response from the refreshhhhhh")
        dispatch(setCredentials( Response.data.user , Response.data.accessToken ))
      }
      catch (err) {
        console.error(err);
      }
      finally {
        setIsLoading(false);
      }
    }

    !token ? verifyRefreshToken() : setIsLoading(false);

  }, []);

  return (
    <>
      {isLoading
        ? <p>Loading...</p>
        : <Outlet />}
    </>
  );
}

export default PersistLogin;

