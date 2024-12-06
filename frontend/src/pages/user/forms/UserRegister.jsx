import React from 'react';
import { Input, InputContainer, Label } from '../../../components/user/StyledComponents/StyledComponents';
import { Link } from 'react-router-dom';
import { signupSchema } from '../../../validation/schemas/SignupSchema';
import useFormValidation from '../../../validation/hooks/useFormValidation';


const UserRegister = () => {

  const { errors, handleSubmit, isSubmitting } = useFormValidation(signupSchema);
  
  const onsubmit = (data) => {
    alert('Signup form submitted', data);
  }
  

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
                name='username'
                placeholder="Enter username"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.username && <p className="text-red-500">{ errors.username }</p>}
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-gray-100 text-gray-800">Phone</Label>
              <Input
                type="tel"
                name='phone'
                placeholder="Enter phone number"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.phone && <p className="text-red-500">{ errors.phone }</p>}
            </InputContainer>
          </div>

          {/* Row 2: Email */}
          <div className="mb-4">
            <InputContainer>
              <Label className="dark:text-gray-100 text-gray-800">Email</Label>
              <Input
                type="email"
                name='email'
                placeholder="Enter email"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.email && <p className="text-red-500">{ errors.email }</p>}
            </InputContainer>
          </div>

          {/* Row 3: Password & Confirm Password */}
          <div className="flex flex-col sm:flex-col md:flex-row gap-4 mb-6">
            <InputContainer className="flex-1">
              <Label className="dark:text-gray-100 text-gray-800">Password</Label>
              <Input
                type="password"
                name='password'
                placeholder="Enter password"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.password && <p className="text-red-500">{ errors.password }</p>}
            </InputContainer>
            <InputContainer className="flex-1">
              <Label className="dark:text-gray-100 text-gray-800">Confirm Password</Label>
              <Input
                type="password"
                name='confirmPassword'
                placeholder="Confirm password"
                className="w-full p-3 rounded-md border dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
              />
              {errors.confirmPassword && <p className="text-red-500">{ errors.confirmPassword }</p>}
            </InputContainer>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 font-bold dark:bg-blue-600 bg-blue-500 text-white rounded-md dark:hover:bg-blue-700 hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          >
            { isSubmitting ? 'Submitting...' : 'Login' }
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-4 text-center dark:text-gray-300 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 dark:text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserRegister;
