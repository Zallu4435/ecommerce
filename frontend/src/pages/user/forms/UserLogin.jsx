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
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    try {
      const response = await loginUser(data).unwrap();
      dispatch(setCredentials(response.user, response.accessToken));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse).unwrap();
      dispatch(setCredentials(response.user, response.accessToken));
      navigate("/");
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  const handleOtpLogin = async (data) => {
    try {
      // Send OTP for login
      const response = await otpLogin({ email: data.email }).unwrap();
      console.log(response, "response");

      dispatch(setEmailOtpToken(response.token));
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  };


  return (
    <div className="dark:bg-gray-900 bg-gray-50 flex items-center justify-center min-h-screen p-6">
      <div className="w-[90%] md:w-[60%] sm:w-full lg:w-[30%] dark:bg-gray-800 bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center dark:text-gray-100 text-gray-800 mb-8">
          Login
        </h2>

        {formNum === 3 && (
          // Forgot Password Form
          <form onSubmit={handleSubmit(handleOtpLogin)} className="space-y-6">
            {/* Email Input for Forgot Password */}
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                className="w-full p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email to Reset Password"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 font-semibold dark:bg-blue-600 bg-blue-500 text-white rounded-lg dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              Send Reset Otp
            </button>

            {/* Back to Login */}
            <div className="text-center mt-4">
              <p
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  setFormNum(1);
                }}
              >
                Back to Login
              </p>
            </div>

            <div className="text-center mt-4">
              <p
                className="text-lg text-green-500 font-bold dark:text-blue-400 cursor-pointer"
                onClick={() => {
                  setFormNum(2);
                }}
              >
                Login with OTP
              </p>
            </div>
          </form>
        )}

        {formNum === 1 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                className="w-full lg:p-4 p-3 md:p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                {...register("password")}
                className="w-full lg:p-4 p-3 md:p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 font-semibold dark:bg-blue-600 bg-blue-500 text-white rounded-lg dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              Login
            </button>

            {/* Google Login */}
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
              useOneTap
              className="google-button"
            />

            {/* OTP Login Toggle */}
            <div className="text-center mt-4">
              <p
                className="text-lg text-green-500 font-bold dark:text-blue-400 cursor-pointer"
                onClick={() => {
                  setFormNum(2);
                }}
              >
                Login with OTP
              </p>
            </div>
          </form>
        )}
        {formNum === 2 && (
          <form onSubmit={handleSubmit(handleOtpLogin)} className="space-y-6">
            {/* Email Input for OTP */}
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                className="w-full p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Send OTP Button */}
            <button
              type="submit"
              className="w-full py-3 font-semibold dark:bg-blue-600 bg-blue-500 text-white rounded-lg dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              Send OTP
            </button>
            {/* Back to Login */}
            <div className="text-center mt-4">
              <p
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  setFormNum(1);
                }}
              >
                Back to Login
              </p>
            </div>
          </form>
        )}

        {/* Sign Up Link */}
        <div
          className={`text-center ${
            formNum === 2 ? "mt-6" : "mt-1"
          } dark:text-gray-300  text-black font-semibold`}
        >
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

        <div
          className={`text-center mt-1 dark:text-gray-300 text-red-700 font-semibold ${
            formNum === 3 ? "hidden" : "block"
          }`}
        >
          <p>
            Forgot your password?{" "}
            <Link
              onClick={() => setFormNum(3)}
              className="text-blue-500 mr-2 dark:text-blue-400 hover:underline"
            >
              Reset it here
            </Link>
          </p>
        </div>
      </div>

      {console.log(otpToken, "otpToken")}
      {/* OTP Modal */}

      {otpToken && (
        <OTPLoginModal
          isOpen={otpToken}
          change={formNum === 2 ? "otp" : "forget-password"}
        />
      )}
    </div>
  );
};

export default Login;
