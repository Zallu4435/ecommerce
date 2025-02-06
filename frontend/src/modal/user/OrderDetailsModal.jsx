import { useEffect } from "react"
import { useGetAddressByOrderIdQuery } from "../../redux/apiSliceFeatures/OrderApiSlice"
import { FaTimes } from "react-icons/fa"
import LoadingSpinner from "../../components/LoadingSpinner"

const OrderDetailsModal = ({ order, onClose }) => {
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
      <div className="bg-orange-50 dark:bg-gray-900 p-4 lg:p-6 rounded-lg shadow-2xl w-full max-w-[90%] lg:w-1/2 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 lg:top-3 lg:right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 lg:mb-6">Order Details</h2>

        <div className="mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg shadow-lg border-2 border-indigo-500">
          <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-4 text-indigo-700 dark:text-indigo-400">
            Order Information
          </h3>
          <p className="text-sm lg:text-base">
            <strong>Status:</strong> {order.Status}
          </p>
          <p className="text-sm lg:text-base">
            <strong>Total Amount:</strong> ₹{order.TotalAmount}
          </p>
          <p className="text-sm lg:text-base">
            <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {address && (
          <div className="mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg shadow-lg border-2 border-green-500">
            <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-4 text-green-700 dark:text-green-400">
              Shipping Address
            </h3>
            <p className="text-sm lg:text-base">
              <strong>Street:</strong> {address.street}
            </p>
            <p className="text-sm lg:text-base">
              <strong>City:</strong> {address.city}
            </p>
            <p className="text-sm lg:text-base">
              <strong>State:</strong> {address.state}
            </p>
            <p className="text-sm lg:text-base">
              <strong>Zip Code:</strong> {address.zipCode}
            </p>
            <p className="text-sm lg:text-base">
              <strong>Country:</strong> {address.country}
            </p>
          </div>
        )}

        <div className="mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg shadow-lg border-2 border-purple-500">
          <h3 className="text-lg lg:text-xl font-semibold mb-2 lg:mb-4 text-purple-700 dark:text-purple-400">
            Product Information
          </h3>
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
            <img
              src={order.ProductImage || "/placeholder.svg"}
              alt={order.ProductName}
              className="w-16 h-16 object-cover rounded-lg shadow-lg"
            />
            <div>
              <p className="text-sm lg:text-base">
                <strong>Product Name:</strong> {order.ProductName}
              </p>
              <p className="text-sm lg:text-base">
                <strong>Quantity:</strong> {order.Quantity}
              </p>
              <p className="text-sm lg:text-base">
                <strong>Price per unit:</strong> ₹ {order.offerPrice}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4 lg:mt-6">
          <button
            onClick={onClose}
            className="bg-red-400 dark:bg-red-500 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition duration-300 shadow-lg text-sm lg:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal

