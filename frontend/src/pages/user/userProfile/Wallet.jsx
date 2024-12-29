import { useEffect, useState } from 'react';
import TransactionModal from '../../../modal/user/TransactionHistoryModal'; // Importing the modal component
import { wallet } from '../../../assets/images';
import { useGetTransactionsQuery, useUpdateWalletMutation } from '../../../redux/apiSliceFeatures/WalletApiSlice';

const Wallet = () => {
  const [balance, setBalance] = useState(0); // Set initial balance to 0
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query hooks
  const { data: fetchedTransactions, refetch } = useGetTransactionsQuery();
  const [updateWallet] = useUpdateWalletMutation();

  console.log(fetchedTransactions, 'fetchedTransactions');

  // Fetch wallet details on mount
  useEffect(() => {
    if (fetchedTransactions) {
      const initialBalance = fetchedTransactions.wallet ? fetchedTransactions.wallet.balance : 0;
      setBalance(initialBalance);
    }
  }, [fetchedTransactions]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoneyWithRazorpay = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay SDK. Please try again later.');
      return;
    }

    const options = {
      key: 'rzp_test_1rT7BxhvJixZp1', // Replace with Razorpay Test Key
      amount: value * 100, // Amount in paise
      currency: 'INR',
      name: 'Test Wallet',
      description: 'Wallet Recharge',
      handler: async function (response) {
        const payload = {
          paymentId: response.razorpay_payment_id,
          amount: value,
          type: 'Credit',
        };

        try {
          const result = await updateWallet(payload).unwrap(); // Call backend to update wallet
          if (result.success) {
            setBalance(result.wallet.balance); // Update balance from backend
            refetch(); // Refetch transactions
            alert('Payment successful! Wallet updated.');
          }
        } catch (error) {
          alert('Failed to update wallet. Please try again.');
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9876543210',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg mx-auto w-full max-w-2xl p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">My Wallet</h1>

        <div className="flex justify-center">
          <img
            src={wallet}
            alt="Wallet Card"
            className="rounded-lg shadow-lg w-[400px] h-[200px] md:w-[500px] md:h-[250px]"
          />
        </div>

        <div className="flex justify-center items-center space-x-2">
          <p className="text-center text-gray-600 text-lg">Current Balance:</p>
          <h2 className="text-lg font-semibold text-green-600 text-center">
            ₹{balance.toFixed(2)}
          </h2>
        </div>

        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={handleAddMoneyWithRazorpay}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-1/2"
          >
            Add Money (Razorpay)
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300 w-1/2"
          >
            Show Transaction History
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          transactions={fetchedTransactions?.transactions || []} // Show fetched transactions
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Wallet;
