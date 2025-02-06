import React, { useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importing an icon

const DeleteConfirmationModal = ({ show, onClose, onConfirm, itemName }) => {

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out scale-105">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-5xl mr-3 animate-pulse" />
          <h2 className="text-3xl font-bold text-gray-800 animate-fadeIn">
            Delete Confirmation
          </h2>
        </div>
        <p className="text-gray-700 mb-6 text-lg">
          Are you sure to delete <strong>{itemName} ?</strong><small className='block text-center'>!! This action cannot be undone.</small>
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none transition-all duration-200"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
