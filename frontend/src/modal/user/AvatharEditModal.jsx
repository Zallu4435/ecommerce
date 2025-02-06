import React, { useEffect, useState } from "react";

const AvatarEditModal = ({
  isOpen,
  currentAvatar,
  onAvatarChange,
  onClose,
  onSave,
}) => {
  const [newAvatarPreview, setNewAvatarPreview] = useState(null);

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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewAvatarPreview(previewUrl);
      onAvatarChange(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Avatar</h2>

        {newAvatarPreview ? (
          <img
            src={newAvatarPreview}
            alt="New Avatar"
            className="w-32 h-32 rounded-full mx-auto border-4 border-gray-200 mb-4"
          />
        ) : (
          <img
            src={currentAvatar}
            alt="Current Avatar"
            className="w-32 h-32 rounded-full mx-auto border-4 border-gray-200 mb-4"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-500 file:text-white hover:file:bg-yellow-600"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await onSave();
              onClose();
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditModal;
