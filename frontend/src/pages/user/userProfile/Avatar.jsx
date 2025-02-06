import { useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useUpdateAvatarMutation } from "../../../redux/apiSliceFeatures/userApiSlice";
import LoadingSpinner from "../../../components/LoadingSpinner";

const Avatar = ({ avatar, username, id, onAvatarUpdate }) => {
  const [user, setUser] = useState({ avatar, username });
  const [isLoading, setIsLoading] = useState(false);
  const [updateAvatar] = useUpdateAvatarMutation();

  useEffect(() => {
    setUser({ avatar, username });
  }, [avatar, username]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("id", id);

        const { data } = await updateAvatar(formData).unwrap();

        setUser({ ...user, avatar: data.avatarUrl });

        onAvatarUpdate();

        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading avatar:", error);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className="flex gap-3">
        <div className="relative mb-6 flex justify-center">
          <img
            src={user.avatar.replace("s96-c", "s200-c")}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
            id="avatarInput"
          />
          <label
            htmlFor="avatarInput"
            className="absolute top-12 right-[calc(10%-12px)] bg-yellow-500 text-white p-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300 cursor-pointer"
          >
            <FaPencilAlt size={16} />
          </label>
        </div>

        <div className="text-center mt-1">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {user.username}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Avatar;
