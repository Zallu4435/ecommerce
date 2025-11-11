import { useLocation, useNavigate } from "react-router-dom"
import {
  FaTruck,
  FaBox,
  FaCheckCircle,
  FaClipboardList,
  FaShippingFast,
  FaTimesCircle,
  FaCreditCard,
} from "react-icons/fa"
import { ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"
import { useUpdateOrderStatusMutation } from "../../../redux/apiSliceFeatures/OrderApiSlice"
// import { useUpdateWalletMutation } from "../../../redux/apiSliceFeatures/WalletApiSlice"
import { useGetOrdersQuery } from "../../../redux/apiSliceFeatures/userProfileApi"

const TrackOrder = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { order } = state || {}

  const { refetch } = useGetOrdersQuery()

  const [updateOrderStatus] = useUpdateOrderStatusMutation()

  if (!order) {
    return <div className="text-center mt-20 text-xl font-semibold">Order not found!</div>
  }

  const trackingSteps = [
    { label: "Order Placed", shortLabel: "Placed", icon: <FaClipboardList /> },
    { label: "Processing", shortLabel: "Processing", icon: <FaBox /> },
    { label: "Shipped", shortLabel: "Shipped", icon: <FaTruck /> },
    { label: "Out for Delivery", shortLabel: "Delivery", icon: <FaShippingFast /> },
    { label: "Delivered", shortLabel: "Delivered", icon: <FaCheckCircle /> },
    { label: "Cancelled", shortLabel: "Cancelled", icon: <FaTimesCircle />, cancel: true },
    { label: "Payment Failed", shortLabel: "Failed", icon: <FaTimesCircle />, failed: true },
    { label: "Failed", shortLabel: "Failed", icon: <FaTimesCircle />, failed: true },
  ]

  const currentStep = trackingSteps.findIndex((step) => step.label === order.Status)

  const calculateLineProgress = () => {
    if (currentStep === -1) return 0
    // For failed or cancelled orders, don't show full progress
    if (order.Status === "Cancelled" || order.Status === "Failed" || order.Status === "Payment Failed") {
      return 0 // No progress for failed/cancelled orders
    }
    // Only count progress for successful flow (first 5 steps)
    const successfulSteps = 5 // Order Placed, Processing, Shipped, Out for Delivery, Delivered
    return ((currentStep + 1) / successfulSteps) * 100
  }

  const getStatusColor = () => {
    switch (order.Status) {
      case "Order Placed":
        return "bg-green-500"
      case "Processing":
        return "bg-blue-400"
      case "Shipped":
        return "bg-green-400"
      case "Out for Delivery":
        return "bg-orange-400"
      case "Delivered":
        return "bg-green-500"
      case "Cancelled":
        return "bg-red-500"
      case "Payment Failed":
      case "Failed":
        return "bg-red-500"
      default:
        return "bg-gray-300"
    }
  }

  const totalQuantity = order.Quantity
  const totalPrice = order.TotalAmount
  const razorpayAmount = order.CouponDiscount ? Math.round(order.Subtotal - order.CouponDiscount) : order.Subtotal

  const generateOrderId = (id) => {
    return `ORD-${id.slice(0, 6).toUpperCase()}`
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleAddPayment = async () => {
    const value = Number.parseFloat(razorpayAmount)
    if (isNaN(value) || value <= 0) {
      toast.warning("Please enter a valid amount.")
      return
    }

    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error("Failed to load Razorpay SDK. Please try again later.")
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: value * 100,
      currency: "INR",
      name: "Test Wallet",
      description: "Wallet Recharge",
      handler: async (response) => {
        try {
            try {
              await updateOrderStatus({
                orderId: order?._id,
                status: "Order Placed",
                itemsIds: order?.itemsIds,
              }).unwrap()

              await refetch()

              // navigate("/profile/order")
              window.location.href = '/profile/order'
            } catch (err) {
              console.error("Error updating order status:", err.message)
              toast(err?.data?.message || "Failed to update order status. Please try again.")
            }
            toast.success("Payment successful! Order updated.")
          // }
        } catch (error) {
          toast.error(error?.data?.message || "Failed to update wallet. Please try again.")
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
    }

    const razorpayInstance = new window.Razorpay(options)
    razorpayInstance.open()
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white my-10 dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-600 dark:text-gray-200 mb-4 sm:mb-0">Track Order</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2" />
          <span>Back to Products</span>
        </button>
      </div>

      <div className="relative mb-12 mt-8">
        <div className="flex justify-between items-center w-full mb-4">
          {trackingSteps
            .filter((step) => {
              // Only show normal flow steps, hide failed/cancelled unless it's the current status
              if (step.cancel || step.failed) {
                return step.label === order.Status
              }
              return true
            })
            .map((step, index) => {
              const isCurrentStatus = step.label === order.Status
              const isFailed = step.failed || step.cancel
              return (
                <div key={index} className="flex z-20 flex-col items-center text-center relative">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full mb-1 ${
                      isCurrentStatus && isFailed
                        ? "bg-red-500 text-white"
                        : index <= currentStep && !isFailed
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div
                    className={`absolute top-10 sm:top-12 text-xs sm:text-sm font-semibold ${
                      isCurrentStatus && isFailed
                        ? "text-red-500"
                        : index <= currentStep && !isFailed
                        ? "text-green-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span className="hidden sm:inline">{step.label}</span>
                    <span className="sm:hidden">{step.shortLabel}</span>
                  </div>
                </div>
              )
            })}
        </div>
        <div className="absolute w-full top-4 sm:top-5 left-0">
          <div className="w-full bg-gray-300 dark:bg-gray-600 h-1 sm:h-2">
            <div
              className={`h-full ${getStatusColor()} transition-all duration-500 ease-in-out`}
              style={{ width: `${calculateLineProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
          <strong>Order ID:</strong> {generateOrderId(order._id) || "N/A"}
        </div>
        <div className="text-gray-700 dark:text-gray-300">
          <strong>Delivery Date:</strong> {order.deliveryDate || "N/A"}
        </div>
      </div>

      <div className="grid items-center justify-center gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-md">
          <img
            src={order.ProductImage || "/placeholder.svg"}
            alt={order.ProductName}
            className="w-32 h-32 object-cover rounded-lg mb-4 mx-auto"
          />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-100 text-center">{order.ProductName}</p>
          <div className="flex justify-between mt-4">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Quantity:</strong> {order.Quantity}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Price:</strong> ₹ {order.offerPrice}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 dark:bg-gray-600 p-4 rounded-lg shadow-md mb-8">
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">
          <strong>Total Quantity:</strong> {totalQuantity}
        </div>
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          <strong>Total Price:</strong> ₹ {totalPrice}
        </div>
      </div>

      {order.Status === "Cancelled" && (
        <div className="text-center mt-6 text-xl text-red-500 font-semibold">
          <strong>Order has been Cancelled</strong>
        </div>
      )}

      {(order.Status === "Failed" || order.Status === "Payment Failed") && (
        <div className="mt-8 border-2 border-red-300 dark:border-red-700 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-50 dark:bg-red-900/30 px-6 py-4 border-b border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <FaTimesCircle className="text-red-600 dark:text-red-400 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-300">Payment Failed</h3>
                <p className="text-sm text-red-600 dark:text-red-400">Order ID: {generateOrderId(order._id)}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white dark:bg-gray-800 px-6 py-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">What happened?</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your payment could not be processed. This might be due to insufficient wallet balance, 
                payment gateway issues, or network problems. Don't worry - your order is saved and you can retry the payment anytime.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-blue-600 dark:text-blue-400" />
                Your items are reserved
              </h5>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 ml-6">
                <li>• Product stock is reserved for you</li>
                <li>• Cart items are still available</li>
                <li>• Order details are saved</li>
              </ul>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Next Steps:</h4>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">Check your wallet balance</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ensure you have sufficient funds (₹{totalPrice} required)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">Click "Retry Payment" below</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred payment method and complete the transaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                onClick={handleAddPayment}
              >
                <FaCreditCard className="text-xl" />
                <span>Retry Payment</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
                onClick={() => navigate('/profile/wallet')}
              >
                <span>Add Money to Wallet</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Need help? <a href="/help" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackOrder

