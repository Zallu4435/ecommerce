import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../../validation/schemas/loginSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLoginUserMutation } from '../../../redux/apiSliceFeatures/userApiSlice'
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../../../redux/slice/userSlice';

const Login = () => {
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();
  const { isAuthenticated } = useSelector((state) => state.user.isAuthenticated);


  // Redirect if user is already authenticated
  if (isAuthenticated) {
    navigate('/'); // Redirect to home or protected route
    return null; // Return nothing while navigating
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    

    try {
      const response = await loginUser(data).unwrap();
      console.log(response, 'response from the backeng login')

      dispatch(setAccessToken(response.accessToken));

      toast.success("Login success");
      navigate('/')
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }

    reset();
  };

  const handleOtpSubmit = (data) => {
    console.log('OTP Submitted:', data);
    alert('OTP verified successfully');
  };

  return (
    <div className="dark:bg-gray-900 bg-gray-50 flex items-center justify-center min-h-screen p-6">
      <div className="w-[90%] md:w-[60%] sm:w-full lg:w-[30%] dark:bg-gray-800 bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-semibold text-center dark:text-gray-100 text-gray-800 mb-8">
          Login
        </h2>

        {!isOtpLogin ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                {...register('email')}
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
                {...register('password')}
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
            <div className="mt-4 justify-center">
              <GoogleLogin
                onSuccess={(response) => console.log(response)}
                onError={() => console.log('Google Login Failed')}
                useOneTap
              />
            </div>

            {/* OTP Login Toggle */}
            <div className="text-center mt-4">
              <p
                className="text-sm text-blue-500 dark:text-blue-400 cursor-pointer"
                onClick={() => setIsOtpLogin(true)}
              >
                Login with OTP
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-6">
            {/* OTP Input */}
            <div className="relative">
              <input
                type="text"
                {...register('otp')}
                className="w-full p-4 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
              )}
            </div>

            {/* Submit OTP */}
            <button
              type="submit"
              className="w-full py-3 font-semibold dark:bg-blue-600 bg-blue-500 text-white rounded-lg dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Sign Up Link */}
        <div className="text-center mt-6 dark:text-gray-300 text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
