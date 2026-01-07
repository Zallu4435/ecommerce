import { useNavigate, useParams } from "react-router-dom";
import { useUserDetailsQuery } from "../../../redux/apiSliceFeatures/AdminApiSlice";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, Package, User } from "lucide-react";

const ViewUserDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: userDetails,
    error: userError,
    isLoading: userLoading,
  } = useUserDetailsQuery(id);

  const user = userDetails?.user;
  const addresses = userDetails?.addresses;
  const orders = userDetails?.orders;

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50 dark:bg-gray-900">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-bold">Error Loading User Details</p>
          <p>{userError?.message || "Something went wrong!"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-orange-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Users</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {user?.username}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Phone className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium">{user?.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                    <p className="font-medium">
                      {new Date(user?.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Package className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
                    <p className="font-medium">{orders?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Referral Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User's Referral Code */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">User's Referral Code</p>
              <div className="flex items-center gap-3">
                <code className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                  {user?.referralCode || "N/A"}
                </code>
                {user?.referralCode && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.referralCode);
                    }}
                    className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Share this code to refer new users
              </p>
            </div>

            {/* Referred By */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Referred By</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.referredBy || "Direct Signup"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {user?.referredBy ? "Used referral code during signup" : "No referral code used"}
              </p>
            </div>

            {/* Referral Reward Status */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Signup Bonus Status</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${user?.isReferralRewardClaimed
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                  {user?.isReferralRewardClaimed ? "✓ Claimed" : "Not Claimed"}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {user?.referredBy ? "₹50 signup bonus" : "No referral bonus"}
              </p>
            </div>

            {/* Referral Stats Placeholder */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Referral Earnings</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                ₹0
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Total earned from referrals
              </p>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Saved Addresses
          </h2>

          {addresses && addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {address.name || `Address ${index + 1}`}
                    </h3>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {address.country}
                  </p>
                  {address.phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      📞 {address.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No addresses saved yet
            </p>
          )}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            Recent Orders
          </h2>

          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {order.items?.length || 0} item(s)
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{order.TotalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : order.orderStatus === "Processing" || order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : order.orderStatus === "Cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}>
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => navigate(`/admin/order-details/${order._id}`)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No orders placed yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;
