import { useState, useEffect } from 'react';
import EditProfileModal from '../../../modal/user/EditProfileModal';

// Dummy data for the user (Replace with actual API calls)
const getUserInfo = () => {

  return {
    username: 'JohnDoe123',
    nickname: 'John',
    email: 'johndoe@example.com',
    avatar: 'https://www.w3schools.com/w3images/avatar2.png',
    phone: '123-456-7890',
    gender: 'Male',
    address: '123 Main St, City, Country',
  };
};

function UserProfile() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate fetching user data
  useEffect(() => {
    const userData = getUserInfo(); // Replace with an actual API call to get user data
    setUser(userData);
  }, []);

  // Display loading state while fetching user data
  if (!user) {
    return <div>Loading...</div>;
  }

  // Define the user profile fields to map through
  const userInfo = [
    { label: 'Username', value: user.username },
    { label: 'Nickname', value: user.nickname },
    { label: 'Email', value: user.email },
    { label: 'Phone Number', value: user.phone },
    { label: 'Gender', value: user.gender },
    { label: 'Shipping Address', value: user.address },
  ];

  return (
    <div className="flex-1 dark:bg-gray-800 shadow-md rounded-lg p-6 ml-6">
      {/* Header Section */}
      <div className="flex items-center space-x-6 mb-6">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-20 h-20 rounded-full border-4 border-gray-200"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.username}</h2>
          <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
        </div>
      </div>

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
          userInfo={user}
          // onSave={handleSave}
        />
    </div>
  );
}

export default UserProfile;
