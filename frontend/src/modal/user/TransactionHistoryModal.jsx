import { useEffect } from "react";

const TransactionModal = ({ transactions, closeModal, isOpen }) => {
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

  if (!isOpen) return null;

  const getTransactionDetails = (description) => {
    if (description.includes("Refund for order cancel")) {
      return "Refund issued for a canceled order.";
    } else if (description.includes("Refund for returned item")) {
      return "Refund issued for a returned item.";
    } else if (description.includes("Payment for order")) {
      return "Payment made for an order.";
    } else if (description.includes("Wallet recharge")) {
      return "Funds added to the wallet.";
    } else {
      return description;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 w-[90%] max-w-xl p-6 px-10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 dark:text-gray-200 text-center">
          Transaction History
        </h2>

        {transactions?.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            No transactions yet.
          </p>
        ) : (
          <ul className="max-h-[470px] overflow-y-auto scrollbar-hidden">
            {transactions.map((transaction, index) => (
              <li
                key={transaction._id || index}
                className="flex flex-col py-4 border-b border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-center">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === "Credit"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type}
                  </p>
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    ₹ {transaction.amount.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <strong>Date:</strong>{" "}
                  {new Date(transaction.createdAt).toLocaleDateString("en-GB", {
                    weekday: "short", // Optional, adds the day of the week
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(transaction.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <strong>Status:</strong> {transaction.status}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  <strong>Details:</strong>{" "}
                  {getTransactionDetails(transaction.description)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={closeModal}
            className="bg-red-500 text-white px-12 py-2 font-bold rounded-md hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
