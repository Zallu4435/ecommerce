import React from "react";

const ReturnReasonModal = ({
  show,
  onClose,
  onConfirm,
  orderId,
  productId,
  reason,
  setReason,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Return Reason
        </h2>

        <div className="text-sm text-gray-600 mb-4">
          <p>
            <span className="font-bold">Order ID:</span> {orderId || "N/A"}
          </p>
          <p>
            <span className="font-bold">Product ID:</span> {productId || "N/A"}
          </p>
        </div>

        <textarea
          className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for return"
        ></textarea>

        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnReasonModal;
