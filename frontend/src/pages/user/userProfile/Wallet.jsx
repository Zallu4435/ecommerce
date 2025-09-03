import { useEffect, useState } from "react";
import TransactionModal from "../../../modal/user/TransactionHistoryModal";
import { wallet } from "../../../assets/images";
import {
  useGetTransactionsQuery,
  useUpdateWalletMutation,
} from "../../../redux/apiSliceFeatures/WalletApiSlice";
import { toast } from "react-toastify";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: fetchedTransactions, refetch } = useGetTransactionsQuery();
  const [updateWallet] = useUpdateWalletMutation();

  useEffect(() => {
    if (fetchedTransactions) {
      const initialBalance = fetchedTransactions.wallet
        ? fetchedTransactions.wallet.balance
        : 0;
      setBalance(initialBalance);
    }
  }, [fetchedTransactions]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoneyWithRazorpay = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      toast.info("Please enter a valid amount.");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load Razorpay SDK. Please try again later.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: value * 100,
      currency: "INR",
      name: "Test Wallet",
      description: "Wallet Recharge",
      handler: async function (response) {
        const payload = {
          paymentId: response.razorpay_payment_id,
          amount: value,
          type: "Credit",
        };

        try {
          const result = await updateWallet(payload).unwrap();
          if (result.success) {
            setBalance(result.wallet.balance);
            refetch();
            toast.success("Payment successful! Wallet updated.");
            setAmount("");
          }
        } catch (error) {
          console.error(error , 'message')
          toast.error(error?.data?.message || "Failed to update wallet. Please try again.");
        }
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 shadow-lg rounded-lg mx-auto w-full max-w-2xl p-10 space-y-6">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-300 text-center mb-6">
          My Wallet
        </h1>

        <div className="flex justify-center">
          <img
            src={wallet}
            alt="Wallet Card"
            className="rounded-lg shadow-lg dark:bg-gray-900 md:w-[400px] md:h-[200px] md:w-[500px] md:h-[250px]"
          />
        </div>

        <div className="flex justify-center items-center space-x-2">
          <p className="text-center text-gray-600 dark:text-gray-200 text-lg">
            Current Balance:
          </p>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        <div className="flex justify-between items-center space-x-4">
          <button
            onClick={handleAddMoneyWithRazorpay}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300 
             w-full sm:w-3/4 md:w-1/2 text-center"
          >
            <span className="block sm:hidden">Add ₹</span>
            <span className="hidden sm:block">Add Money (Razorpay)</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-400 text-white px-5 py-2 rounded-lg hover:bg-red-500 transition duration-300 
             w-full sm:w-3/4 md:w-1/2 text-center"
          >
            <span className="block sm:hidden">History</span>
            <span className="hidden sm:block">Show Transaction History</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          transactions={fetchedTransactions?.transactions || []}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default Wallet;
