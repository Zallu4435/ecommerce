import { useEffect } from "react";

const TransactionModal = ({ transactions, closeModal, isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null; // Ensure modal content doesn't render if it's not open

  console.log(transactions, 'transactions');

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-600 w-[650px] p-6 px-10 rounded-lg shadow-lg">
        {/* Modal Header */}
        <h2 className="text-3xl font-bold text-gray-600 mb-4 dark:text-gray-200 text-center">
          Transaction History
        </h2>

        {/* Transactions List */}
        {transactions?.length === 0 ? (
          <p className="text-gray-600 text-center">No transactions yet.</p>
        ) : (
          <ul className="max-h-[470px] overflow-y-auto scrollbar-hidden">
            {transactions.map((transaction, index) => (
              <li
                key={transaction._id || index}  // Use _id or fallback to index
                className="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <div>
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "Credit" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {transaction.type}
                  </p>
                  <p className="text-gray-500 dark:text-gray-200 text-sm">
                    {new Date(transaction.date).toLocaleDateString() || 'N/A'}
                  </p>
                </div>
                <p className="font-bold text-gray-600 dark:text-gray-200">
                  ₹ {transaction.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={closeModal}
            className="bg-red-400 text-white px-12 py-2 font-bold rounded-md hover:bg-red-500 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
