import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePasswordMutation } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice';
import { toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Eye icon imports

// Zod validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string()
    .min(6, { message: "New password must be at least 6 characters long" })
    .regex(/[A-Za-z]/, { message: "New password must contain at least one letter" })
    .regex(/[0-9]/, { message: "New password must contain at least one number" }),
  confirmPassword: z.string()
    .min(1, { message: "Please confirm your new password" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password must match",
  path: ["confirmPassword"], // Show the error on the confirmPassword field
});

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Setup react-hook-form and Zod
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const [changePassword, { isLoading, error }] = useChangePasswordMutation();

  const onSubmit = async (data) => {
    try {
      // Dispatch the changePassword mutation
      const response = await changePassword(data).unwrap();
      toast.success('Password changed successfully!');
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setValue('currentPassword', '');
      setValue('newPassword', '');
      setValue('confirmPassword', '');
    } catch (err) {
      toast.error(error?.data?.message || 'Failed to change password');
      setMessage({
        type: 'error',
        text: error?.data?.message || 'Failed to change password',
      });
    }
  };

  const inputFields = [
    { id: 'currentPassword', label: 'Current Password', type: 'password' },
    { id: 'newPassword', label: 'New Password', type: 'password' },
    { id: 'confirmPassword', label: 'Confirm New Password', type: 'password' }
  ];

  return (
    <div className=" mx-auto bg-white w-[700px] dark:bg-gray-800 py-10 px-20 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-600 dark:text-gray-200">Change Password</h2>
      {message.text && (
        <p className={`text-sm font-bold mb-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputFields.map(({ id, label, type }) => (
          <div key={id} className="mb-4 relative">
            <label htmlFor={id} className="block text-gray-700 text-lg dark:text-gray-300 font-bold mb-2">
              {label}
            </label>
            <div className="relative">
              <input
                type={showPassword[id] ? 'text' : 'password'}
                id={id}
                name={id}
                {...register(id)}
                className={`w-full px-4 py-4 border-4 border-gray-300 dark:text-white dark:bg-gray-800 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 ${errors[id] ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword({ ...showPassword, [id]: !showPassword[id] })}
              >
                {showPassword[id] ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
              </button>
            </div>
            {errors[id] && (
              <p className="text-red-500 text-xs mt-1">{errors[id]?.message}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full font-bold text-lg bg-indigo-500 text-white py-4 rounded-md hover:bg-indigo-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
