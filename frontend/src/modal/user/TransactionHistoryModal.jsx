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
      }, [isOpen])

    return (
      <div className="fixed inset-0 flex items-center backdrop-blur-sm justify-center bg-black bg-opacity-50">
        <div className="bg-white w-[550px] max-w-md p-6 px-10 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-600 text-center">No transactions yet.</p>
          ) : (
            <ul>
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex justify-between items-center py-2 border-b border-gray-200"
                >
                  <div >
                    <p
                      className={`font-semibold ${
                        transaction.type === 'Credit' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {transaction.type}
                    </p>
                    <p className="text-gray-500 text-sm">{transaction.date}</p>
                  </div>
                  <p className="font-medium text-gray-800">${transaction.amount.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex justify-center">
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default TransactionModal;
  