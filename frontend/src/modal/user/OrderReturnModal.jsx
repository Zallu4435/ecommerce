import { useEffect } from 'react';

const ReturnConfirmationModal = ({ show, onClose, onConfirm, orderId, productId, reason, onReasonChange }) => {

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  if (!show) return null;

  const handleConfirm = () => {
    if (onConfirm && typeof reason === 'string' && reason.trim()) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center backdrop-blur-sm justify-center p-6 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full shadow-2xl transform transition-transform duration-300 scale-95 hover:scale-100">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800 dark:text-gray-100">
          Are You Sure You Want to Return the Order?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Please confirm if you would like to return your order. This action cannot be undone.
        </p>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
            Reason for Return
          </label>
          <textarea
            className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-lg"
            rows="4"
            value={reason || ''}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Why do you want to return the order?"
            required
          />
        </div>

        <div className="flex justify-between items-center gap-6 mt-6">
          <button
            className="px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-lg font-semibold"
            onClick={onClose}
          >
            No, Keep the Order
          </button>

          <button
            className={`px-6 py-3 text-white rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 ${
              (reason && reason.trim()) ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleConfirm}
            disabled={!reason || !reason.trim()}
          >
            Yes, Return Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnConfirmationModal;
