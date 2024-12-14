import React, { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { useUpdateAvatarMutation } from '../../../redux/apiSliceFeatures/userApiSlice'; // Import the mutation
import LoadingSpinner from '../../../components/LoadingSpinner'; // Import the loading spinner component

const Avatar = ({ avatar, username, onAvatarUpdate }) => {
  const [user, setUser] = useState({ avatar, username });
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [updateAvatar] = useUpdateAvatarMutation(); // Hook for the RTK Query mutation

  useEffect(() => {
    // Update the avatar state whenever the props change
    setUser({ avatar, username });
  }, [avatar, username]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true); // Show loading spinner

        // Prepare form data for the avatar upload
        const formData = new FormData();
        formData.append('avatar', file);

        // Save the avatar URL to the backend
        const { data } = await updateAvatar(formData).unwrap();

        // Update the user's avatar with the URL from the backend response
        setUser({ ...user, avatar: data.avatarUrl });

        // Trigger the callback to refetch user data
        onAvatarUpdate();

        setIsLoading(false); // Hide loading spinner
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setIsLoading(false); // Hide loading spinner on error
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className='flex gap-3'>
        <div className="relative mb-6 flex justify-center">
          {/* User Avatar */}
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />

          {/* Pencil Icon */}
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} id="avatarInput" />
          <label htmlFor="avatarInput" className="absolute top-12 right-[calc(10%-12px)] bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300 cursor-pointer">
            <FaPencilAlt size={16} />
          </label>
        </div>

        {/* Username */}
        <div className="text-center mt-1">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.username}</h2>
        </div>
      </div>
    </>
  );
};

export default Avatar;
