import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserDetailsQuery } from '../../../redux/apiSliceFeatures/AdminApiSlice';

const ViewUserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id , 'from thw view user ')
  
  // Fetching user details, orders, and addresses from API
  const { data: userDetails, error: userError, isLoading: userLoading } = useUserDetailsQuery(id);
  console.log(userDetails, "userDetails")

  const user = userDetails?.user 
  const address = userDetails?.addresses;
  const orders = userDetails?.orders;

  console.log(user, address, orders, "fromth")

  // Loading states for user details and orders
  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  // Error handling
  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {userError?.message || 'Something went wrong!'}
      </div>
    );
  }

  // User details
  const userInfo = [
    { label: 'Name', value: user.username },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone },
    { label: 'Joined', value: new Date(user.joinedAt).toLocaleDateString() },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen dark:bg-black p-4">
      <div className="container mx-auto w-[1200px] bg-white shadow-md rounded-lg p-8 dark:bg-gray-900 dark:text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
        >
          Back
        </button>

        {/* User Profile Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">User Profile</h2>
          <ul className="space-y-4">
            {userInfo.map((detail, index) => (
              <li key={index} className="text-gray-600 dark:text-gray-300 font-medium flex justify-between">
                <span>{detail.label}:</span> <span className="text-gray-900 dark:text-gray-100">{detail.value}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* User Addresses Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">User Addresses</h2>
          <div className="space-y-4">
            {address?.length > 0 ? (
              address.map((address, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Address {index + 1}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{address.street}, {address.city}, {address.state}, {address.zipCode}</p>
                  <p className="text-gray-600 dark:text-gray-300">Country: {address.country}</p>
                  <p className="text-gray-600 dark:text-gray-300">Phone: {address.phone}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No addresses available.</p>
            )}
          </div>
        </div>

        {/* User Orders Section */}
        <div>
          <h2 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Order History</h2>
          <table className="min-w-full table-auto bg-white dark:bg-gray-900 shadow-md rounded-lg">
            <thead className="bg-indigo-500 text-white">
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
                <tr key={order.id}>
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => navigate(`/order/${order.id}`)} // Navigate to order details page
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;
