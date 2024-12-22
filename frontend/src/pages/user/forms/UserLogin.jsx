import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import {
  otpLoginSchema,
  regularLoginSchema,
  otpResetSchema,
} from "../../../validation/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useLoginUserMutation,
  useGoogleLoginMutation,
  useOtpLoginMutation,
} from "../../../redux/apiSliceFeatures/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setCredentials,
  setEmailOtpToken,
  setForgotEmail,
} from "../../../redux/slice/userSlice";
import OTPLoginModal from "../../../modal/user/OtpLoginModal";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const otpToken = useSelector((state) => state.user.otpToken);

  const [loginUser] = useLoginUserMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [otpLogin] = useOtpLoginMutation();
  const [formNum, setFormNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(
      formNum === 1
        ? regularLoginSchema
        : formNum === 2
        ? otpLoginSchema
        : otpResetSchema
    ),
  });

  const onSubmit = async (data, e) => {
    setIsLoading(true);
    try {
      if (formNum === 1) {
        setLoadingText("Logging in...");
        const response = await loginUser(data).unwrap();
        dispatch(setCredentials(response.user, response.accessToken));
        navigate("/");
      } else if (formNum === 2 || formNum === 3) {
        setLoadingText("Sending OTP...");
        await handleOtpLogin(data);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
      setLoadingText("");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    setLoadingText("Logging in with Google...");
    try {
      const response = await googleLogin(credentialResponse).unwrap();
      dispatch(setCredentials(response.user, response.accessToken));
      navigate("/");
    } catch (error) {
      toast.error("Google Login Failed");
      console.error("Google Login Failed:", error);
    } finally {
      setIsLoading(false);
      setLoadingText("");
    }
  };

  const handleOtpLogin = async (data) => {
    try {
      dispatch(setForgotEmail(data.email));
      const response = await otpLogin({ email: data.email }).unwrap();
      dispatch(setEmailOtpToken(response.token));
      setShowOtpModal(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };

  const handleCloseOtpModal = () => {
    setShowOtpModal(false);
    dispatch(setEmailOtpToken(null));
  };

  const renderForm = () => {
    switch (formNum) {
      case 1:
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                className="w-full lg:p-4 p-3 md:p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                {...register("password")}
                className="w-full lg:p-4 p-3 md:p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full p-3 font-semibold dark:bg-blue-600 bg-blue-500 text-white rounded-lg dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? loadingText : "Login"}
            </button>
          </form>
        );
      case 2:
      case 3:
        return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                className="w-full p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={formNum === 2 ? "Enter your Email for OTP" : "Enter your Email to Reset Password"}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 font-semibold dark:bg-blue-600 bg-blue-500 text-white rounded-lg dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? loadingText : (formNum === 2 ? "Send OTP" : "Send Reset OTP")}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dark:bg-gray-900 bg-gray-50 flex items-center justify-center min-h-screen p-6">
      <div className="w-[90%] md:w-[60%] sm:w-full lg:w-[30%] dark:bg-gray-800 bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center dark:text-gray-100 text-gray-800 mb-8">
          {formNum === 1 ? "Login" : formNum === 2 ? "OTP Login" : "Reset Password"}
        </h2>

        {renderForm()}

        {formNum === 1 && !isLoading && (
          <>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
              useOneTap
              className="google-button mt-4"
              disabled={isLoading}
            />
            <div className="text-center mt-4">
              <p
                className="text-lg text-green-500 font-bold dark:text-blue-400 cursor-pointer"
                onClick={() => {
                  setFormNum(2);
                  reset();
                }}
              >
                Login with OTP
              </p>
            </div>
          </>
        )}

        {formNum !== 1 && !isLoading && (
          <div className="text-center mt-4">
            <p
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => {
                setFormNum(1);
                reset();
              }}
            >
              Back to Login
            </p>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="text-center mt-4 dark:text-gray-300 text-black font-semibold">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 dark:text-blue-400 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {formNum !== 3 && (
              <div className="text-center mt-1 dark:text-gray-300 text-red-700 font-semibold">
                <p>
                  Forgot your password?{" "}
                  <span
                    onClick={() => {
                      setFormNum(3);
                      reset();
                    }}
                    className="text-blue-500 mr-2 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Reset it here
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {showOtpModal && (
        <OTPLoginModal
          isOpen={showOtpModal}
          change={formNum === 2 ? "otp" : "forget-password"}
          onClose={handleCloseOtpModal}
        />
      )}
    </div>
  );
};

export default Login;

