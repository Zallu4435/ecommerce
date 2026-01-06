import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Wallet, CreditCard, Banknote, AlertCircle, Loader2 } from "lucide-react";
import { useGetOrderByIdQuery } from "../../redux/apiSliceFeatures/OrderApiSlice";
import { useRetryPaymentMutation, useVerifyRazorpayPaymentMutation } from "../../redux/apiSliceFeatures/userProfileApi";

const RetryPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, amount } = location.state || {};

    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);

    // Using RTK Query hooks
    const { data: orderResponse, isLoading: loadingOrder } = useGetOrderByIdQuery(orderId, {
        skip: !orderId
    });

    const [retryPayment] = useRetryPaymentMutation();
    const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

    const orderData = orderResponse?.order || orderResponse;

    // Edge case: No state provided
    useEffect(() => {
        if (!orderId) {
            toast.error("Invalid access. Please select an order to retry payment.");
            navigate("/profile/order");
        } else if (orderData && orderData.paymentStatus === "Successful") {
            // Edge case: Payment already successful
            toast.info("This order has already been paid for.");
            navigate("/profile/order");
        }
    }, [orderId, navigate, orderData]);


    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async (orderAmount, razorpayOrderId) => {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast.error("Razorpay SDK failed to load. Please try again later.");
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount: Math.round(orderAmount * 100),
            currency: "INR",
            name: "VAGO University",
            description: `Retry Payment for Order`,
            order_id: razorpayOrderId, // Add the Razorpay Order ID here
            handler: async function (response) {
                try {
                    // Verify payment on backend using RTK Query
                    const result = await verifyRazorpayPayment({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: orderId,
                        amount: orderAmount
                    }).unwrap();

                    toast.success("Payment successful!");
                    navigate("/payment-success", {
                        state: { orderId, paymentId: response.razorpay_payment_id }
                    });
                } catch (error) {
                    console.error("Payment verification failed:", error);
                    toast.error("Payment verification failed. Please contact support.");
                }
            },
            modal: {
                ondismiss: function () {
                    toast.warning("Payment cancelled. You can retry anytime.");
                    setLoading(false);
                },
                escape: true,
                backdropclose: false,
            },
            prefill: {
                name: orderData?.user?.name || "",
                email: orderData?.user?.email || "",
                contact: orderData?.user?.phone || "",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razorpayInstance = new window.Razorpay(options);

        razorpayInstance.on('payment.failed', function (response) {
            console.error("Razorpay payment failed:", response.error);
            toast.error(response.error.description || "Payment failed. Please try again.");
            setLoading(false);
        });

        razorpayInstance.open();
    };

    const handleRetryPayment = async () => {
        // Edge case: No payment method selected
        if (!paymentMethod) {
            toast.info("Please select a payment method");
            return;
        }

        // Edge case: COD limit check
        if (paymentMethod === "cod" && amount > 2500) {
            toast.error("COD is not available for orders above ₹2500");
            return;
        }

        try {
            setLoading(true);

            // For wallet and COD, call backend retry API via RTK Query
            // For Razorpay, we also first call this to get the Order ID
            const response = await retryPayment({
                orderId,
                paymentMethod
            }).unwrap();

            if (paymentMethod === "razorpay") {
                // If it's Razorpay, the backend now returns razorpayOrderId
                await handleRazorpayPayment(amount, response.razorpayOrderId);
                return;
            }

            if (response.paymentStatus === "Successful") {
                toast.success("Payment successful!");
                navigate("/payment-success", {
                    state: { orderId, paymentId: response.paymentId }
                });
            } else if (paymentMethod === "cod") {
                toast.success("Order updated to Cash on Delivery!");
                navigate("/payment-success", {
                    state: { orderId, paymentId: response.paymentId, isCOD: true }
                });
            }
        } catch (error) {
            console.error("Retry payment error:", error);
            const errorMessage = error?.data?.message || error?.message || "Failed to process payment. Please try again.";
            toast.error(errorMessage);

            // Edge case: Insufficient wallet balance
            if (errorMessage.includes("Insufficient wallet balance")) {
                toast.info("Please add money to your wallet or choose a different payment method.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loadingOrder) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
                </div>
            </div>
        );
    }

    // Edge case: No order data
    if (!orderData && !loadingOrder) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Order Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We couldn't find this order. It may have been cancelled or doesn't exist.
                    </p>
                    <button
                        onClick={() => navigate("/profile/order")}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        View My Orders
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
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">Retry Payment</h1>
                        <p className="text-green-100">Complete your order payment</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Amount Display */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8 text-center border border-blue-200 dark:border-blue-800">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Amount to Pay</p>
                            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                ₹{amount?.toFixed(2) || "0.00"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Order ID: {orderId?.slice(0, 8).toUpperCase()}
                            </p>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Select Payment Method
                            </h3>
                            <div className="space-y-3">
                                {/* Wallet */}
                                <label
                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "card"
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="wallet"
                                        checked={paymentMethod === "wallet"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-4 w-5 h-5 text-blue-600"
                                    />
                                    <Wallet className={`w-6 h-6 mr-3 ${paymentMethod === "wallet" ? "text-blue-600" : "text-gray-400"}`} />
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 dark:text-white">Wallet</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Pay using your wallet balance</p>
                                    </div>
                                </label>

                                {/* Razorpay */}
                                <label
                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === "razorpay"
                                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                        : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="razorpay"
                                        checked={paymentMethod === "razorpay"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-4 w-5 h-5 text-blue-600"
                                    />
                                    <CreditCard className={`w-6 h-6 mr-3 ${paymentMethod === "razorpay" ? "text-blue-600" : "text-gray-400"}`} />
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 dark:text-white">Razorpay</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Credit/Debit Card, UPI, Net Banking</p>
                                    </div>
                                </label>

                                {/* COD */}
                                <label
                                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${amount > 2500
                                        ? "opacity-50 cursor-not-allowed"
                                        : paymentMethod === "cod"
                                            ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === "cod"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={amount > 2500}
                                        className="mr-4 w-5 h-5 text-blue-600 disabled:cursor-not-allowed"
                                    />
                                    <Banknote className={`w-6 h-6 mr-3 ${paymentMethod === "cod" ? "text-blue-600" : "text-gray-400"}`} />
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {amount > 2500 ? "Not available for orders above ₹2500" : "Pay when you receive"}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Info Box */}
                        {paymentMethod && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    {paymentMethod === "wallet" && "Make sure you have sufficient balance in your wallet."}
                                    {paymentMethod === "razorpay" && "You'll be redirected to Razorpay's secure payment gateway."}
                                    {paymentMethod === "cod" && "You can pay in cash when the order is delivered."}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleRetryPayment}
                                disabled={loading || !paymentMethod}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${loading || !paymentMethod
                                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </span>
                                ) : (
                                    "Confirm Payment"
                                )}
                            </button>

                            <button
                                onClick={() => navigate("/profile/order")}
                                disabled={loading}
                                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetryPayment;
