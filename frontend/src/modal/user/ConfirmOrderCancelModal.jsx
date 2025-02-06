import { useEffect } from "react"

const CancelConfirmationModal = ({ show, onClose, onConfirm, orderId, productId, reason, onReasonChange }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [show])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center backdrop-blur-sm justify-center p-4 sm:p-6 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8 max-w-lg w-full shadow-2xl transform transition-transform duration-300 scale-95 hover:scale-100">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-4 sm:mb-6 text-red-800 dark:text-gray-100">
          Are You Sure You Want to Cancel the Order?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
          Please confirm if you would like to cancel your order. This action cannot be undone.
        </p>

        <div className="mb-4 sm:mb-6">
          <label className="block text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
            Reason for Cancellation
          </label>
          <textarea
            className="w-full px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-sm sm:text-base lg:text-lg"
            rows="4"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Why do you want to cancel the order?"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          <button
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base lg:text-lg font-semibold"
            onClick={onClose}
          >
            No, Keep the Order
          </button>

          <button
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-white rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 ${
              reason.trim() ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={onConfirm}
            disabled={!reason.trim()}
          >
            Yes, Cancel Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelConfirmationModal

