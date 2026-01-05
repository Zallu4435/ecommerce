import React, { useState, useEffect, useCallback } from "react";
import { X, Search, Users } from "lucide-react";
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

  const filteredUsers = users?.filter((user) =>
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-blue-600 dark:to-blue-700 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-lg">
                <Users className="w-6 h-6 text-orange-600 dark:text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Select Users
                </h3>
                <p className="text-orange-100 dark:text-blue-100 text-sm">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by email..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* User List */}
        <div
          id="user-modal-content"
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 280px)" }}
        >
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.some((u) => u.userId === user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user.id, user.email)}
                    className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${isSelected
                        ? "bg-orange-50 dark:bg-blue-900 border-orange-500 dark:border-blue-500"
                        : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-blue-400"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                          ? "bg-orange-500 dark:bg-blue-500 border-orange-500 dark:border-blue-500"
                          : "border-gray-300 dark:border-gray-500"
                        }`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`font-medium ${isSelected
                          ? "text-orange-900 dark:text-blue-100"
                          : "text-gray-800 dark:text-gray-100"
                        }`}>
                        {user.email}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                {userSearchQuery ? "No users found matching your search" : "No users available"}
              </p>
            </div>
          )}

          {isUserFetching && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-orange-500 dark:border-t-blue-500"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Loading more users...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2.5 bg-orange-500 dark:bg-blue-600 text-white font-medium rounded-lg hover:bg-orange-600 dark:hover:bg-blue-700 transition-colors shadow-lg"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
