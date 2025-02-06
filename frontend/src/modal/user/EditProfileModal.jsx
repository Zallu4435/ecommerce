import { useEffect, useState } from "react";
import { useUpdateUserInfoMutation } from "../../redux/apiSliceFeatures/userApiSlice";
import { toast } from "react-toastify";

function EditProfileModal({ isOpen, onClose, userInfo = {} }) {
  const [updateUserInfo] = useUpdateUserInfoMutation();
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    email: "",
    phone: "",
    gender: "",
    ...userInfo,
  });
  const oldEmail = userInfo.email;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUserInfo({ updateData: formData, oldEmail }).unwrap();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message);
      console.error("Failed to update user info", error);
    }
  };
  const getInputType = (key) => {
    if (key.toLowerCase().includes("email")) return "email";
    if (key.toLowerCase().includes("password")) return "password";
    if (key.toLowerCase().includes("phone")) return "tel";
    if (key.toLowerCase().includes("date")) return "date";
    return "text";
  };

  const allowedFields = ["username", "nickname", "phone", "gender"];

  return (
    <div className="fixed inset-0 z-50 bg-black backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Edit Profile
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {Object.entries(formData)
            .filter(([key]) => allowedFields.includes(key.toLowerCase()))
            .map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label
                  htmlFor={key}
                  className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={getInputType(key)}
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white dark:focus:ring-pink-500"
                />
              </div>
            ))}
          <div className="col-span-full">
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white dark:focus:ring-pink-500"
            />
          </div>
          <div className="col-span-full flex justify-end space-x-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
