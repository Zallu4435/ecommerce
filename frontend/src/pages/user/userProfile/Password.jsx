import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePasswordMutation } from '../../../redux/apiSliceFeatures/addressPasswordApiSlice';
import { toast } from 'react-toastify';

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
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">Change Password</h2>
      {message.text && (
        <p className={`text-sm font-bold mb-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputFields.map(({ id, label, type }) => (
          <div key={id} className="mb-4">
            <label htmlFor={id} className="block text-gray-700 dark:text-gray-300 mb-2">
              {label}
            </label>
            <input
              type={type}
              id={id}
              name={id}
              {...register(id)}
              className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 ${errors[id] ? 'border-red-500' : ''}`}
            />
            {errors[id] && (
              <p className="text-red-500 text-xs mt-1">{errors[id]?.message}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
