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
  const [copied, setCopied] = useState(false);

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

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Refer & Earn</h3>
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Share your referral code with friends! They get <span className="font-bold text-green-600">₹50</span> instantly on signup,
            and you earn <span className="font-bold text-green-600">₹100</span> when they place their first order!
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-400 dark:border-gray-600 px-4 py-2 rounded font-mono font-bold text-xl tracking-wider text-blue-600 dark:text-blue-400">
              {data.user?.referralCode || "Loading..."}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.user?.referralCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`text-sm px-3 py-2 rounded transition ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
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
