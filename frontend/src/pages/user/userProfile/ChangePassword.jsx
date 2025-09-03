import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../../validation/schemas/changePasswordSchema";
import { useChangePasswordMutation } from "../../../redux/apiSliceFeatures/userProfileApi";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const passwordSchema = changePasswordSchema;

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const [changePassword, { isLoading, error }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    try {
      await changePassword(data).unwrap();
      toast.success("Password changed successfully!");
      setMessage({ type: "success", text: "Password changed successfully!" });
      setValue("currentPassword", "");
      setValue("newPassword", "");
      setValue("confirmPassword", "");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password");
      setMessage({
        type: "error",
        text: error?.data?.message || "Failed to change password",
      });
    }
  };

  const inputFields = [
    { id: "currentPassword", label: "Current Password", type: "password" },
    { id: "newPassword", label: "New Password", type: "password" },
    { id: "confirmPassword", label: "Confirm New Password", type: "password" },
  ];

  return (
    <div className="mx-auto mt-4 lg:mt-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-[700px] p-4 sm:p-6 md:p-8 lg:p-10">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-600 dark:text-gray-200">
        Change Password
      </h2>
      {message.text && (
        <p
          className={`text-sm font-bold mb-4 ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {inputFields.map(({ id, label, type }) => (
          <div key={id} className="relative">
            <label
              htmlFor={id}
              className="block text-gray-700 dark:text-gray-300 text-base sm:text-lg font-bold mb-2"
            >
              {label}
            </label>
            <div className="relative">
              <input
                type={showPassword[id] ? "text" : "password"}
                id={id}
                name={id}
                {...register(id)}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 border-2 sm:border-4 border-gray-300 dark:text-white dark:bg-gray-800 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 ${
                  errors[id] ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2"
                onClick={() =>
                  setShowPassword({ ...showPassword, [id]: !showPassword[id] })
                }
              >
                {showPassword[id] ? (
                  <AiOutlineEyeInvisible className="text-xl sm:text-2xl" />
                ) : (
                  <AiOutlineEye className="text-xl sm:text-2xl" />
                )}
              </button>
            </div>
            {errors[id] && (
              <p className="text-red-500 text-xs mt-1">{errors[id]?.message}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full font-bold text-base sm:text-lg bg-indigo-500 text-white py-3 sm:py-4 rounded-md hover:bg-indigo-600 transition duration-300 mt-6"
          disabled={isLoading}
        >
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;