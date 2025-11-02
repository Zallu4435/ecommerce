import { useEffect } from "react"
import { useGetAddressByOrderIdQuery } from "../../redux/apiSliceFeatures/OrderApiSlice"
import { FaTimes } from "react-icons/fa"
import LoadingSpinner from "../../components/LoadingSpinner"

const OrderDetailsModal = ({ order, onClose, isAdmin = false }) => {
  const {
    data: address,
    error,
    isLoading,
  } = useGetAddressByOrderIdQuery(order._id, {
    skip: !order._id,
  })

  useEffect(() => {
    if (order && order._id) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = "auto"
      }
    }
  }, [order])

  if (isLoading) return <LoadingSpinner />
  if (error)
    return <p className="text-center text-red-500 dark:text-red-400">Error fetching address details: {error.message}</p>

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4 lg:p-0">
      <div className={`${isAdmin ? 'bg-orange-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'} p-4 lg:p-6 rounded-lg shadow-2xl w-full max-w-[90%] lg:w-1/2 max-h-[90vh] overflow-y-auto relative`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 lg:top-3 lg:right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 lg:mb-6">Order Details</h2>

        <div className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg ${isAdmin ? 'shadow-lg border-2 border-indigo-500' : 'bg-blue-50 dark:bg-gray-700 border border-blue-200 dark:border-blue-900'}`}>
          <h3 className={`text-lg lg:text-xl font-semibold mb-2 lg:mb-4 ${isAdmin ? 'text-indigo-700 dark:text-indigo-400' : 'text-blue-600 dark:text-blue-400'}`}>
            Order Information
          </h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p className="text-sm lg:text-base">
              <strong className="text-gray-900 dark:text-gray-100">Status:</strong> {order.Status}
            </p>
            <p className="text-sm lg:text-base">
              <strong className="text-gray-900 dark:text-gray-100">Total Amount:</strong> ₹{order.TotalAmount}
            </p>
            <p className="text-sm lg:text-base">
              <strong className="text-gray-900 dark:text-gray-100">Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {address && (
          <div className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg ${isAdmin ? 'shadow-lg border-2 border-green-500' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'}`}>
            <h3 className={`text-lg lg:text-xl font-semibold mb-2 lg:mb-4 ${isAdmin ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-gray-100'}`}>
              Shipping Address
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">Street:</strong> {address.street}
              </p>
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">City:</strong> {address.city}
              </p>
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">State:</strong> {address.state}
              </p>
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">Zip Code:</strong> {address.zipCode}
              </p>
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">Country:</strong> {address.country}
              </p>
            </div>
          </div>
        )}

        <div className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg ${isAdmin ? 'shadow-lg border-2 border-purple-500' : 'bg-indigo-50 dark:bg-gray-700 border border-indigo-200 dark:border-indigo-900'}`}>
          <h3 className={`text-lg lg:text-xl font-semibold mb-2 lg:mb-4 ${isAdmin ? 'text-purple-700 dark:text-purple-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
            Product Information
          </h3>
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            <img
              src={order.ProductImage || "/placeholder.svg"}
              alt={order.ProductName}
              className={`${isAdmin ? 'w-16 h-16 shadow-lg' : 'w-20 h-20 lg:w-24 lg:h-24 border border-gray-200 dark:border-gray-600'} object-cover rounded-lg`}
            />
            <div className="space-y-1 text-gray-700 dark:text-gray-300">
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">Product Name:</strong> {order.ProductName}
              </p>
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">Quantity:</strong> {order.Quantity}
              </p>
              <p className="text-sm lg:text-base">
                <strong className="text-gray-900 dark:text-gray-100">Price per unit:</strong> ₹{order.offerPrice}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 lg:mt-6">
          <button
            onClick={onClose}
            className={`${isAdmin ? 'bg-red-400 dark:bg-red-500 hover:bg-red-600 dark:hover:bg-red-700 shadow-lg' : 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 shadow-md'} text-white px-4 lg:px-6 py-2 rounded-lg transition duration-300 text-sm lg:text-base`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal

