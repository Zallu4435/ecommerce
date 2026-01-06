import React from "react";

const CancelReasonModal = ({
  show,
  onClose,
  onConfirm,
  orderId,
  productId,
  reason,
  setReason,
  productName,
  productImage,
  type = "Cancel" // Default to Cancel, can be passed as "Return"
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {type === "Return" ? "Return Reason" : "Cancellation Reason"}
        </h2>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-2">
          <p>
            <span className="font-bold">Order ID:</span> {orderId || "N/A"}
          </p>

          {productName ? (
            <div className="flex items-center gap-3 mt-2 p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-lg">
              {productImage && (
                <img
                  src={productImage}
                  alt={productName}
                  className="w-12 h-12 rounded object-cover border border-gray-200 dark:border-gray-600"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={productName}>
                  {productName}
                </p>
              </div>
            </div>
          ) : (
            <p>
              <span className="font-bold">Product ID:</span> {productId || "N/A"}
            </p>
          )}
        </div>

        <textarea
          className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={`Enter reason for ${type === "Return" ? "return" : "cancellation"}`}
        ></textarea>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-md ${type === "Return"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-red-500 hover:bg-red-600"
              }`}
          >
            Confirm {type}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelReasonModal;
