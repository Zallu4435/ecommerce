import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../../redux/apiSliceFeatures/userApiSlice";
import {
  setEmailOtpToken,
  setResetPassword,
} from "../../../redux/slice/userSlice";
import { useDispatch } from "react-redux";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const dispatch = useDispatch();
  const [backendErr, setBackendErr] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setBackendErr(""); // Clear previous errors
    try {
      const token = location.state?.token;
      if (!token) {
        setBackendErr("Reset token not found. Please try the password reset process again.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      await resetPassword({ token, newPassword: data.password }).unwrap();
      toast.success("Password reset successfully!");
      dispatch(setEmailOtpToken(null));
      dispatch(setResetPassword(null));
      navigate("/login");
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to reset password";
      setBackendErr(errorMessage);
      toast.error(errorMessage);
      setTimeout(() => {
        setBackendErr("");
      }, 5000);
    }
  };

  return (
    <div className="dark:bg-gray-900 bg-gray-50 flex items-center justify-center min-h-screen p-6">
      <div className="w-[90%] md:w-[60%] sm:w-full lg:w-[30%] dark:bg-gray-800 bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center dark:text-gray-100 text-gray-800 mb-8">
          Reset Password
        </h2>

        {backendErr && (
          <p className="text-red-400 font-bold text-sm mb-4 text-center">
            {backendErr}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              {...register("password")}
              className="w-full lg:p-4 p-3 md:p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full lg:p-4 p-3 md:p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 font-semibold dark:bg-blue-600 bg-blue-500 text-white rounded-lg dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6 dark:text-gray-300 text-black font-semibold">
          <p>
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
