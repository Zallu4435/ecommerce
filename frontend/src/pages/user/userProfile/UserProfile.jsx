import { useState } from 'react';
import EditProfileModal from '../../../modal/user/EditProfileModal';
import Avatar from './Avatar';
import { useGetUserQuery } from '../../../redux/apiSliceFeatures/userApiSlice';


function UserProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data , isLoading, isError, error } = useGetUserQuery({});

  if (isLoading) return <div>Loading</div>

  if(isError) return <div>Error: {error?.message || 'Failed to fetch data'}</div>

  const userInfo = [
    { label: 'Username', value: data.user?.username || 'N/A' },
    { label: 'Nickname', value: data.user?.nickname || 'N/A' },
    { label: 'Email', value: data.user?.email || 'N/A' },
    { label: 'Phone Number', value: data.user?.phone || 'N/A' },
    { label: 'Gender', value: data.user?.gender || 'N/A' },
    { label: 'Shipping Address', value: data.user?.address || 'N/A' },
  ];
  

  return (
    <div className="flex-1 dark:bg-gray-800 shadow-md rounded-lg p-6 ml-6">
      {/* Header Section */}
        <Avatar />

      {/* Profile Details */}
      <div className="space-y-4">
        {userInfo.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Edit Button */}
      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-300"
        >
          Edit Profile
        </button>
      </div>



        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userInfo={data.user}
        />
    </div>
  );
}

export default UserProfile;
