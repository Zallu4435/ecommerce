import usePreventBodyScroll from "../../hooks/usePreventBodyScroll"

const CancelConfirmationModal = ({
  show,
  onClose,
  onConfirm,
  orderId,
  productId,
  productName,
  reason,
  onReasonChange,
  title,
  message
}) => {
  // Prevent body scroll when modal is open
  usePreventBodyScroll(show)

  if (!show) return null

  // Determine dynamic content if props aren't explicitly provided
  const displayTitle = title || (productId ? "Cancel Item" : "Cancel Entire Order")
  const displayMessage = message || (productId
    ? `Are you sure you want to cancel ${productName || 'this item'}? This action cannot be undone.`
    : "Are you sure you want to cancel the entire order? All items will be cancelled and this action cannot be undone.")

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center backdrop-blur-sm justify-center p-4 sm:p-6 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 lg:p-8 max-w-lg w-full shadow-2xl transform transition-transform duration-300 scale-95 hover:scale-100 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-4 sm:mb-6 text-red-700 dark:text-gray-100 leading-tight">
          {displayTitle}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6">
          {displayMessage}
        </p>

        <div className="mb-6">
          <label className="block text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-400 mb-2">
            Reason for Cancellation <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 text-sm sm:text-base transition-all resize-none"
            rows="4"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder={productId ? "Why are you cancelling this item?" : "Why are you cancelling the entire order?"}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-2">
          <button
            className="w-full sm:w-auto px-6 py-2.5 text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-sm sm:text-base font-bold"
            onClick={onClose}
          >
            No, Keep it
          </button>

          <button
            className={`w-full sm:w-auto px-8 py-2.5 text-white rounded-xl text-sm sm:text-base font-bold transition-all duration-200 shadow-lg active:scale-95 ${reason.trim()
                ? "bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none"
                : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 shadow-none"
              }`}
            onClick={onConfirm}
            disabled={!reason.trim()}
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelConfirmationModal

