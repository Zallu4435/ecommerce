import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useActivateUserMutation } from '../../redux/apiSliceFeatures/userApiSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useDispatch } from 'react-redux';
import { setGmailCredentials } from '../../redux/slice/userSlice';

const ActivationPage = () => {
  const { activation_token } = useParams(); // Extract token from URL
  const [activateUser, { isLoading, isError, isSuccess, error }] = useActivateUserMutation(); // Use the mutation hook
  const navigate = useNavigate(); // Initialize navigate hook
  const dispatch = useDispatch();

  useEffect(() => {
    if (activation_token) {
      activateUser({ token: activation_token }); // Pass the token with the correct key
    }
  }, [activation_token, activateUser]); // Ensure activation function is not recreated unnecessarily

  useEffect(() => {
    if (isSuccess) {
      dispatch(setGmailCredentials());
      navigate('/'); // Redirect to homepage or any page after successful activation
    }
  }, [isSuccess, navigate]); // Only navigate when isSuccess changes to true

  return (
    <div className="h-screen flex justify-center items-center">
      {isLoading && <LoadingSpinner />} {/* Show loading */}
      {isError && <p>{error?.data?.message || "Your token is expired or invalid. Please try again."}</p>} {/* Show error */}
      {isSuccess && <LoadingSpinner />} {/* Show success */}
    </div>
  );
};

export default ActivationPage;
