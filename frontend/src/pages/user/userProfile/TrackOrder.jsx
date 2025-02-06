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
  // const [updateWallet] = useUpdateWalletMutation()

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
  ]

  const currentStep = trackingSteps.findIndex((step) => step.label === order.Status)

  const calculateLineProgress = () => {
    if (currentStep === -1) return 0
    return ((currentStep + 1) / trackingSteps.length) * 100
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
      alert("Please enter a valid amount.")
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
        // const payload = {
        //   paymentId: response.razorpay_payment_id,
        //   amount: value,
        //   type: "Credit",
        // }

        try {
          // const result = await updateWallet(payload).unwrap()
          // if (result.success) {
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
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex z-20 flex-col items-center text-center relative">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full mb-1 ${
                  index <= currentStep ? "bg-green-500 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-500"
                } ${step.cancel ? "bg-red-500" : ""}`}
              >
                {step.icon}
              </div>
              <div
                className={`absolute top-10 sm:top-12 text-xs sm:text-sm font-semibold ${
                  index <= currentStep ? "text-green-500" : "text-gray-500 dark:text-gray-400"
                } ${step.cancel ? "text-red-500" : ""}`}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel}</span>
              </div>
            </div>
          ))}
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

      {order.Status === "Failed" && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-red-100 p-4 rounded-md shadow-md">
          <div className="text-xl text-red-600 font-semibold mb-4 sm:mb-0">
            <strong>Order has been Failed</strong>
          </div>
          <button
            className={`flex items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-5 py-2 rounded-lg shadow-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-transform`}
            onClick={handleAddPayment}
          >
            <FaCreditCard className="w-5 h-5 mr-2" />
            Add Payment
          </button>
        </div>
      )}
    </div>
  )
}

export default TrackOrder

