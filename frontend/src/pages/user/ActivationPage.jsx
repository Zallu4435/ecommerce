import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivateUserMutation } from "../../redux/apiSliceFeatures/userApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useDispatch } from "react-redux";
import { setGmailCredentials } from "../../redux/slice/userSlice";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [activateUser, { isLoading, isError, isSuccess, error }] =
    useActivateUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (activation_token) {
      activateUser({ token: activation_token });
    }
  }, [activation_token, activateUser]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setGmailCredentials());
      navigate("/");
    }
  }, [isSuccess, navigate]);

  return (
    <div className="h-screen flex justify-center items-center">
      {isLoading && <LoadingSpinner />}
      {isError && (
        <p>
          {error?.data?.message ||
            "Your token is expired or invalid. Please try again."}
        </p>
      )}{" "}
      {isSuccess && <LoadingSpinner />}
    </div>
  );
};

export default ActivationPage;
