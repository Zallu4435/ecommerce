import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserDetailsQuery } from "../../../redux/apiSliceFeatures/AdminApiSlice";
import { ArrowLeft } from "lucide-react";
import OrderDetailsModal from "../../../modal/user/OrderDetailsModal";

const ViewUserDetails = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const closeModal = () => setSelectedOrder(null);
  const toggleOrderDetails = (order) => setSelectedOrder(order);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: userDetails,
    error: userError,
    isLoading: userLoading,
  } = useUserDetailsQuery(id);

  const user = userDetails?.user;
  const address = userDetails?.addresses;
  const orders = userDetails?.orders;

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {userError?.message || "Something went wrong!"}
      </div>
    );
  }

  const userInfo = [
    { label: "Name", value: user.username },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Joined", value: new Date(user.joinedAt).toLocaleDateString() },
  ];

  return (
    <div className="flex justify-center min-h-screen mt-10 bg-gray-50 dark:bg-black">
      <div className="container mx-auto w-full shadow-md rounded-lg p-8 bg-orange-50 dark:bg-gray-900 dark:text-white">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center ml-auto text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2" />
          <span>Back to Products</span>
        </button>

        <div className="mb-8">
          <h2 className="text-4xl font-bold text-red-400 dark:text-red-400 mb-4">
            User Profile
          </h2>
          <ul className="space-y-4">
            {userInfo.map((detail, index) => (
              <li
                key={index}
                className="text-gray-600 dark:text-gray-300 font-medium flex justify-between"
              >
                <span>{detail.label}:</span>{" "}
                <span className="text-gray-900 dark:text-gray-100">
                  {detail.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-red-400 dark:text-red-400 mb-4">
            User Addresses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {address?.length > 0 ? (
              address.map((address, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-700 dark:text-white"
                >
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Address {index + 1}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.zipCode}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Country: {address.country}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Phone: {address.phone}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300 col-span-2">
                No addresses available.
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-red-400 dark:text-red-400 mb-4">
            Order History
          </h2>
          {orders && orders.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No orders available.
            </p>
          ) : (
            <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-lg">
              <thead className="bg-red-200 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Total Amount</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-gray-300 dark:border-gray-700"
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-white">
                      {order._id}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                      {order.TotalAmount !== undefined &&
                      order.TotalAmount !== null
                        ? `₹${order.TotalAmount.toFixed(2)}`
                        : `₹0.00`}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                      {order.items.length > 0 ? order.items[0].Status : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleOrderDetails(order)}
                        className="px-4 py-2 border-2 border-yellow-600 font-semibold text-yellow-600 rounded-lg hover:bg-red-200 transition duration-300"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedOrder && selectedOrder.items && selectedOrder.items.length > 0 && (
          <OrderDetailsModal 
            order={{
              ...selectedOrder.items[0],
              TotalAmount: selectedOrder.TotalAmount,
              createdAt: selectedOrder.createdAt,
              _id: selectedOrder._id
            }} 
            onClose={closeModal} 
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
};

export default ViewUserDetails;
