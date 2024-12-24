import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../../redux/apiSliceFeatures/OrderApiSlice";
import { Search } from "lucide-react";

const ViewOrdersList = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate(); // Use navigate hook for navigation
  const { data: orders, error, isLoading } = useGetOrderByIdQuery(userId);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [orders, searchTerm]);

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    );
  if (!orders || orders.length === 0)
    return <div className="text-center p-4">No orders found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 ml-10 h-screen bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      {/* Back Button */}
      <div className="flex justify-between">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Your Orders
        </h2>
        <button
          onClick={() => navigate(-1)} // Navigates back to the previous page
          className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          &larr; Back
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search by Order ID or Status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ maxWidth: "600px", flex: "1 0 600px" }} // Ensuring each div takes 600px
          >
            <div className="p-6 flex flex-wrap items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="w-full lg:w-auto flex-shrink-0">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Order #{order._id.slice(-6)}
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Total: ₹{order.totalAmount?.toFixed(2)}
                </p>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Delivery Address:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}, {order.shippingAddress.zipCode}
                  , {order.shippingAddress.country}
                </p>
              </div>
              <div className="w-full lg:w-auto flex-grow">
                <h4 className="font-semibold text-gray-800 lg:mt-3 dark:text-gray-100 mb-2">
                  Items:
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center flex-col text-center">
                      <img
                        src={item.productImage || "/placeholder.png"}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-md mb-2"
                      />
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewOrdersList;
