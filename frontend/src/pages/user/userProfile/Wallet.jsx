import { useState } from 'react';
import TransactionModal from '../../../modal/user/TransactionHistoryModal'; // Importing the modal component
import { wallet } from '../../../assets/images';

const Wallet = () => {
  const [balance, setBalance] = useState(500);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Credit', amount: 200, date: '2024-12-01' },
    { id: 2, type: 'Debit', amount: 50, date: '2024-12-05' },
    { id: 3, type: 'Credit', amount: 300, date: '2024-12-10' },
  ]);
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0) {
      setBalance(balance + value);
      setTransactions([
        ...transactions,
        { id: transactions.length + 1, type: 'Credit', amount: value, date: new Date().toISOString().split('T')[0] },
      ]);
      setAmount('');
    } else {
      alert('Please enter a valid amount.');
    }
  };

  const handleWithdrawMoney = () => {
    const value = parseFloat(amount);
    if (!isNaN(value) && value > 0 && value <= balance) {
      setBalance(balance - value);
      setTransactions([
        ...transactions,
        { id: transactions.length + 1, type: 'Debit', amount: value, date: new Date().toISOString().split('T')[0] },
      ]);
      setAmount('');
    } else {
      alert('Invalid amount or insufficient balance.');
    }
  };

  return (
    <>
      {/* Wallet Header */}
      <div className="bg-white shadow-md py-4 rounded-lg mt-[-20px] ml-[250px] w-[600px] max-w-lg px-10 space-y-6"> {/* Increased width */}
        <h1 className="text-3xl font-bold text-gray-800 text-center">My Wallet</h1>

        {/* Wallet Card Image */}
        <div className="flex justify-center">
          <img
            src={wallet}
            alt="Wallet Card"
            className="rounded-lg shadow-md w-[400px] h-[200px]" // Increased width and ensured auto height
          />
        </div>

        {/* Current Balance */}
        <div className='flex justify-center gap-2 items-center'>
            <p className="text-center text-gray-600 text-lg">Current Balance:</p>
            <h2 className="text-lg font-semibold text-green-500 text-center">${balance.toFixed(2)}</h2>
        </div>

        {/* Amount Input */}
        <div className="">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleAddMoney}
            className="bg-blue-500 text-white px-5 rounded-md hover:bg-blue-600 transition duration-300 text-md"
          >
            Add Money
          </button>
          <button
            onClick={handleWithdrawMoney}
            className="bg-red-500 text-white px-5 p-2 rounded-md hover:bg-red-600 transition duration-300 text-md"
          >
            Withdraw Money
          </button>
        </div>

        {/* Toggle Transaction History Button */}
        <div className="">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-700 text-white w-full px-5 py-2 rounded-md hover:bg-gray-800 transition duration-300 text-md"
          >
            Show Transaction History
          </button>
        </div>
      </div>

      {/* Transaction History Modal */}
      {isModalOpen && (
        <TransactionModal
          isOpen= "true"
          transactions={transactions}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Wallet;
