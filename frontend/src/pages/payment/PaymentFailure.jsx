import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, AlertTriangle, ArrowLeft } from "lucide-react";

const PaymentFailure = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, reason, amount, orderDetails } = location.state || {};

    // Edge case: No state provided
    if (!orderId) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Invalid Access
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        No payment information found. Please try placing your order again.
                    </p>
                    <button
                        onClick={() => navigate("/shop")}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/profile/order")}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Orders
                </button>

                {/* Main Failure Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with Icon */}
                    <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center">
                        <XCircle className="w-24 h-24 text-white mx-auto mb-4 animate-pulse" />
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Payment Failed
                        </h1>
                        <p className="text-red-100">
                            Don't worry, your order has been saved
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Failure Reason */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                What went wrong?
                            </h3>
                            <p className="text-red-700 dark:text-red-400 text-sm">
                                {reason || "We couldn't process your payment. This could be due to insufficient funds, network issues, or payment gateway errors."}
                            </p>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Order Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                                    <span className="font-mono text-sm bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded">
                                        {orderId.slice(0, 8).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <span className="text-gray-600 dark:text-gray-400">Amount to Pay</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ₹{amount?.toFixed(2) || "0.00"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* What's Next Section */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                                What happens next?
                            </h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Your order has been saved and is waiting for payment</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>You can retry payment anytime from your orders page</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Your cart items are safe and won't be lost</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Stock is reserved for 24 hours</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/retry-payment", {
                                    state: { orderId, amount, orderDetails }
                                })}
                                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Retry Payment Now
                            </button>

                            <button
                                onClick={() => navigate("/profile/order")}
                                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                            >
                                View My Orders
                            </button>

                            <button
                                onClick={() => navigate("/shop")}
                                className="w-full border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                            >
                                Continue Shopping
                            </button>
                        </div>

                        {/* Help Section */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Need help?{" "}
                                <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    Contact Support
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
