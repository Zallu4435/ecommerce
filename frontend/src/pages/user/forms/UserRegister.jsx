import React, { useState } from "react";
import { Input, InputContainer, Label } from "../../../components/user/StyledComponents/StyledComponents";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../../validation/schemas/SignupSchema";
import { toast } from "react-toastify";
import { useRegisterUserMutation } from "../../../redux/apiSliceFeatures/userApiSlice";
import SignupSuccessModal from "../../../modal/user/SignUpModal";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../redux/slice/userSlice";


const UserRegister = () => {

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [registerUser] = useRegisterUserMutation();
  const dispatch = useDispatch();
  // React Hook Form with zod schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onsubmit = async (data, e) => {
      e.preventDefault();

      try {
        const response = await registerUser(data).unwrap();
        console.log(response, "response from the backend signup");
        toast.info('Check your Gmail for the link to access your account!');
        setIsModalOpen(true);

      } catch (err) {
        toast.error(err?.data?.message);
      }

      reset();

  };

  const closeModal = () => {
    setIsModalOpen(false); 
  };

  return (
    <div className="dark:bg-gray-900 bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="w-[90%] sm:w-full lg:w-[50%] my-20 dark:bg-gray-800 bg-white p-8 rounded-md shadow-lg">
        <h1 className="text-2xl sm:text-xl md:text-2xl font-bold mb-6 dark:text-gray-100 text-gray-800 text-center">
          User Register
        </h1>
        <form onSubmit={handleSubmit(onsubmit)}>
          {/* Row 1: Username & Phone */}
          <div className="flex flex-col sm:flex-col md:flex-row gap-4 mb-4">
            <InputContainer className="flex-1">
              <Label className="dark:text-gray-100 text-gray-800">Username</Label>
              <Input
                type="text"
                {...register("username")}
                placeholder="Enter username"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-gray-100 text-gray-800">Phone</Label>
              <Input
                type="tel"
                {...register("phone")}
                placeholder="Enter phone number"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </InputContainer>
          </div>

          {/* Row 2: Email */}
          <div className="mb-4">
            <InputContainer>
              <Label className="dark:text-gray-100 text-gray-800">Email</Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="Enter email"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </InputContainer>
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div className="flex flex-col sm:flex-col md:flex-row gap-4 mb-6">
            <InputContainer className="flex-1">
              <Label className="dark:text-gray-100 text-gray-800">Password</Label>
              <Input
                type="password"
                {...register("password")}
                placeholder="Enter password"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-gray-100 text-gray-800">
                Confirm Password
              </Label>
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="Confirm password"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </InputContainer>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-bold dark:bg-blue-600 bg-blue-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            {isSubmitting ? "Submitting..." : "Register"}
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-4 text-center dark:text-gray-300 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>

      <SignupSuccessModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default UserRegister;
