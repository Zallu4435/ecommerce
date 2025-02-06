import { useState, useEffect } from "react";
import EditProfileModal from "../../../modal/user/EditProfileModal";
import Avatar from "./Avatar";
import { useGetUserQuery } from "../../../redux/apiSliceFeatures/userApiSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { defaultProfile } from "../../../assets/images";

function UserProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, error, refetch } = useGetUserQuery();

  const [userAvatar, setUserAvatar] = useState("");
  const [userUsername, setUserUsername] = useState("");

  useEffect(() => {
    if (data?.user) {
      setUserAvatar(data.user.avatar);
      setUserUsername(data.user.username);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return <div>Error: {error?.message || "Failed to fetch data"}</div>;

  const userInfo = [
    { label: "Username", value: data.user?.username || "N/A" },
    { label: "Nickname", value: data.user?.nickname || "N/A" },
    { label: "Email", value: data.user?.email || "N/A" },
    { label: "Phone Number", value: data.user?.phone || "N/A" },
    { label: "Gender", value: data.user?.gender || "N/A" },
    { label: "Shipping Address", value: data.user?.address || "N/A" },
  ];

  return (
    <div className="flex-1 lg:mt-0 mt-14 dark:bg-gray-800 shadow-md rounded-lg p-6 lg:ml-6">
      <Avatar
        avatar={userAvatar || defaultProfile}
        username={userUsername}
        onAvatarUpdate={refetch}
        id={data?.user._id}
      />

      <div className="space-y-4">
        {userInfo.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition duration-300"
        >
          Edit Profile
        </button>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userInfo={data.user}
      />
    </div>
  );
}

export default UserProfile;
