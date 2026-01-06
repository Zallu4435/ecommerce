import usePreventBodyScroll from "../../hooks/usePreventBodyScroll";

const TransactionModal = ({ transactions, closeModal, isOpen }) => {
  // Prevent body scroll when modal is open
  usePreventBodyScroll(isOpen);

  if (!isOpen) return null;

  const getTransactionDetails = (description) => {
    // Helper to format Mongo IDs to ORD-XXXXXX
    const formatDescriptionId = (text) => {
      const mongoIdRegex = /[a-f\d]{24}/i;
      const match = text.match(mongoIdRegex);
      if (match) {
        const id = match[0];
        const formattedId = `ORD-${id.slice(-6).toUpperCase()}`;
        return text.replace(id, formattedId);
      }
      return text;
    };

    const formattedText = formatDescriptionId(description);

    if (description.includes("Refund for order cancel")) {
      return formatDescriptionId(description); // Show "Refund for order cancel... ORD-..."
    } else if (description.includes("Refund for returned item")) {
      return formatDescriptionId(description);
    } else if (description.toLowerCase().includes("payment for order")) {
      // Handles both "Payment" and "Failed payment"
      return formattedText;
    } else if (description.includes("Wallet recharge")) {
      return "Funds added to the wallet.";
    } else {
      return formattedText;
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
                    className={`font-bold text-lg ${transaction.type === "Credit"
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
