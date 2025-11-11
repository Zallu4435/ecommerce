import React, { useState, useEffect, useCallback } from "react";
import usePreventBodyScroll from "../../../hooks/usePreventBodyScroll";

const UserModal = ({
  showModal,
  setShowModal,
  users,
  handleUserSelect,
  selectedUsers,
  loadMoreUsers,
  hasMoreUsers,
  isUserFetching,
}) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  
  // Prevent body scroll when modal is open
  usePreventBodyScroll(showModal);

  const loadMore = useCallback(() => {
    if (!isUserFetching && hasMoreUsers) {
      setUserPage((prevPage) => prevPage + 1);
      loadMoreUsers(userPage + 1);
    }
  }, [isUserFetching, hasMoreUsers, loadMoreUsers, userPage]);

  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMore();
      }
    };

    const modalContent = document.getElementById("user-modal-content");
    if (modalContent) {
      modalContent.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loadMore]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-2/4 max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center mb-4 rounded-t-lg">
          <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-100">
            Select Users
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-8 py-2 bg-red-400 text-white font-bold rounded-md hover:bg-red-500 transition duration-200"
            >
              Close
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-8 py-2 bg-blue-500 font-bold text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Confirm
            </button>
          </div>
        </div>

        <div className="sticky top-16 bg-white dark:bg-gray-800 p-4 mb-4 rounded-t-lg">
          <input
            type="text"
            placeholder="Search users..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div
          id="user-modal-content"
          className="p-4 overflow-y-auto flex-grow"
          style={{ maxHeight: "calc(80vh - 180px)" }}
        >
          <div className="space-y-2">
            {users
              ?.filter((user) =>
                user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user.id}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center rounded-md"
                  onClick={() => handleUserSelect(user.id, user.email)}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.some((u) => u.userId === user.id)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="text-gray-800 dark:text-gray-100">
                    {user.email}
                  </span>
                </div>
              ))}
          </div>
          {isUserFetching && (
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Loading more users...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
