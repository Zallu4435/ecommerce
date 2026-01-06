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
  ]

  const currentStep = trackingSteps.findIndex((step) => step.label === order.Status)

  const calculateLineProgress = () => {
    if (currentStep === -1) return 0
    // For failed or cancelled orders, don't show full progress
    if (order.Status === "Cancelled" || order.Status === "Payment Failed") {
      return 0 // No progress for failed/cancelled orders
    }
    // Only count progress for successful flow (first 5 steps)
    const successfulSteps = 5 // Order Placed, Processing, Shipped, Out for Delivery, Delivered
    return ((currentStep + 1) / successfulSteps) * 100
  }

  const getStatusColor = () => {
    const status = order.originalStatus || order.Status;
    const statusColors = {
      Delivered: "text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800",
      Shipped: "text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800",
      "Out for Delivery": "text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800",
      Processing: "text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
      Packed: "text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-100 dark:border-amber-800",
      Confirmed: "text-violet-700 bg-violet-50 dark:bg-violet-900/30 dark:text-violet-400 border border-violet-100 dark:border-violet-800",
      "Order Placed": "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
      Pending: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
      Cancelled: "text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800",
      Returned: "text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800",
      "Return Requested": "text-orange-700 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-800",
      Refunded: "text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-100 dark:border-teal-800",
      "Payment Failed": "text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800",
    };
    return statusColors[status] || statusColors[order.Status] || "text-gray-600 bg-gray-50 border border-gray-100";
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header & Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-fit"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Order Details</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
              Track Shipment
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Order ID: <span className="font-mono font-medium text-gray-900 dark:text-gray-200">{order.orderId || generateOrderId(order._id)}</span>
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm self-start sm:self-center ${getStatusColor()}`}>
            {order.Status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tracking Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <span className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                <FaTruck className="text-blue-600 dark:text-blue-400" />
              </span>
              Tracking History
            </h2>

            <div className="relative pl-4 sm:pl-6">
              {/* Timeline Items */}
              {trackingSteps
                .filter((step) => {
                  if (step.cancel || step.failed) return step.label === order.Status;
                  return true;
                })
                .map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  const isFailed = step.failed || step.cancel;

                  // Connector Line
                  const showLine = index !== trackingSteps.length - 1;

                  return (
                    <div key={index} className="relative pb-10 last:pb-0">
                      {index < trackingSteps.filter(s => !(s.cancel || s.failed) || s.label === order.Status).length - 1 && (
                        <div className={`absolute top-8 left-[15px] sm:left-[19px] w-0.5 h-[calc(100%-20px)] ${isCompleted && !isFailed ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                          }`} />
                      )}

                      <div className="flex gap-4 sm:gap-6">
                        {/* Icon/Dot */}
                        <div className={`relative z-10 flex items-center justify-center flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 ${isCurrent && isFailed ? 'bg-red-500 border-red-100 dark:border-red-900' :
                          isCompleted ? 'bg-blue-600 border-blue-100 dark:border-blue-900' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          }`}>
                          {isCompleted ? (
                            isFailed ? <FaTimesCircle className="text-white text-sm" /> : <FaCheckCircle className="text-white text-sm" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'} pt-1`}>
                          <h3 className={`font-bold text-base sm:text-lg ${isCurrent ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                            {step.label}
                          </h3>
                          <p className="text-sm mt-1 mb-2 max-w-xs leading-relaxed opacity-80">
                            {step.label === 'Order Placed' && 'We have received your order.'}
                            {step.label === 'Processing' && 'We are preparing your items.'}
                            {step.label === 'Shipped' && 'Your order is on the way.'}
                            {step.label === 'Out for Delivery' && 'Agent is out to deliver.'}
                            {step.label === 'Delivered' && 'Package delivered successfully.'}
                            {step.label === 'Cancelled' && 'This order was cancelled.'}
                            {step.label === 'Payment Failed' && 'Transaction was unsuccessful.'}
                          </p>
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              Current Status
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Item Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-4">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Item Details</h3>

            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6 relative group">
              <img
                src={order.ProductImage || "/placeholder.svg"}
                alt={order.ProductName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-gray-900 dark:text-white shadow-sm">
                x{order.Quantity} Units
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
                {order.ProductName}
              </h4>

              <div className="flex justify-between items-center py-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400">Total Price</span>
                <span className="font-bold text-xl text-gray-900 dark:text-white">₹{totalPrice}</span>
              </div>

              {order.deliveryDate && order.Status !== 'Cancelled' && order.Status !== 'Payment Failed' && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                  <p className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wide mb-1">
                    Expected Delivery
                  </p>
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    {order.deliveryDate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Failure / Retry Section */}
      {order.Status === "Payment Failed" && (
        <div className="mt-8 bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 border border-red-100 dark:border-red-900/30">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400 text-xl">
              <FaCreditCard />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Payment Required</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
                We reserved your items, but the transaction didn't go through. Please retry payment to confirm your order.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleAddPayment}
                  className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-gray-200 dark:shadow-none"
                >
                  <span>Retry Payment Now</span>
                  <FaCreditCard />
                </button>
                <button
                  onClick={() => navigate('/profile/wallet')}
                  className="px-6 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  Check Wallet Balance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackOrder

