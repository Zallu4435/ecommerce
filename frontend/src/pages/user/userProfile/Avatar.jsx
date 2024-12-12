import { useState, useEffect } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import AvatarEditModal from '../../../modal/user/AvatharEditModal'; // Import the modal component

const getUserInfo = () => {
  return {
    username: 'JohnDoe123',
    avatar: 'https://www.w3schools.com/w3images/avatar2.png',
  };
};

const Avatar = ()  => {
  const [user, setUser] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState('');

  useEffect(() => {
    const userData = getUserInfo();
    setUser(userData);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewAvatar(reader.result); // Preview the uploaded image
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = () => {
    setUser({ ...user, avatar: newAvatar });
    setIsAvatarModalOpen(false); // Close modal after saving
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Header Section */}
      <div className='flex  gap-3'>
        <div className="relative mb-6 flex justify-center">
          {/* User Avatar */}
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />

          {/* Pencil Icon */}
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            className="absolute top-12 right-[calc(10%-12px)] bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300"
          >
            <FaPencilAlt size={16} />
          </button>
        </div>

        {/* Username */}
        <div className="text-center mt-1">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.username}</h2>
        </div>
      </div>

      {/* Avatar Edit Modal */}
      <AvatarEditModal
        isOpen={isAvatarModalOpen}
        currentAvatar={user.avatar}
        newAvatar={newAvatar}
        onAvatarChange={handleAvatarChange}
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={saveAvatar}
      />
    </>
  );
}

export default Avatar;
