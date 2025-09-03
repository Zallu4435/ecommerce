import { useEffect, useState } from "react";
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
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (activation_token) {
      activateUser(activation_token);
    }
  }, [activation_token, activateUser]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setGmailCredentials());
      const timer = setInterval(() => {
        setCountdown((c) => (c > 0 ? c - 1 : 0));
      }, 1000);
      const redirect = setTimeout(() => navigate("/"), 3000);
      return () => {
        clearInterval(timer);
        clearTimeout(redirect);
      };
    }
  }, [isSuccess, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
        {isLoading && (
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <p className="text-gray-600">Activating your account…</p>
          </div>
        )}

        {isError && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Activation failed</h1>
            <p className="text-gray-600 mb-6">
              {error?.data?.message ||
                "Your token is expired or invalid. Please request a new activation email."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go to Home
            </button>
          </>
        )}

        {isSuccess && (
          <>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-2xl">✓</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Account activated!</h1>
            <p className="text-gray-600 mb-6">
              Redirecting to home in {countdown}…
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Go now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;
