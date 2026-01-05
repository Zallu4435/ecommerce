import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCouponQuery } from "../../../redux/apiSliceFeatures/CouponApiSlice";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Percent,
  Users,
  AlertCircle,
  CheckCircle,
  FileText,
  DollarSign
} from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ViewCouponDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetCouponQuery(id);
  const coupon = data?.coupon;
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  const isExpired = () => {
    if (!coupon?.expiry) return false;
    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiry);
    return currentDate > expiryDate;
  };

  const isSoldOut = () => {
    if (!coupon?.usageLimit) return false;
    return coupon.usageCount >= coupon.usageLimit;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !coupon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50 dark:bg-gray-900">
        <p className="text-lg font-bold text-red-500">
          Failed to load coupon details.
        </p>
      </div>
    );
  }

  const status = isExpired() ? "Expired" : isSoldOut() ? "Sold Out" : "Active";
  const statusColor = isExpired() ? "bg-red-500 text-white" : isSoldOut() ? "bg-orange-500 text-white" : "bg-green-500 text-white";

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-900 p-6 md:p-10 flex justify-center mt-10">
      <div className="w-full max-w-[1300px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-300 flex items-center gap-2">
              Coupon Details
            </h2>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Coupons
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Main Details Card */}
            <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                Basic Information
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Coupon Code:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{coupon.couponCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Title:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{coupon.title}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">Description:</span>
                  <p className="text-gray-800 dark:text-gray-200">{coupon.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Expiry Date:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(coupon.expiry).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Is Expired:</span>
                  <span className={`font-medium px-5 py-1 rounded ${statusColor}`}>
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                Usage Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">Times Used</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{coupon.usageCount}</span>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">Total Limit</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{coupon.usageLimit || "Unlimited"}</span>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500 dark:text-gray-400 block">Limit Per User</span>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">{coupon.perUserLimit || "1"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Financials */}
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-500" />
                Pricing Details
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">Discount:</span>
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{coupon.discount}%</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Min Amount:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">₹{parseFloat(coupon.minAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Max Discount:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">₹{coupon.maxAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Targeting Summary */}
            <div className="bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-gray-500" />
                Targeting
              </h3>
              <div className="space-y-6">

                {/* Applicable Users */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Applicable Users</span>
                    {coupon.applicableUsers && coupon.applicableUsers.length > 0 && (
                      <span className="text-xs bg-white dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        Total: {coupon.applicableUsers.length}
                      </span>
                    )}
                  </div>
                  {coupon.applicableUsers && coupon.applicableUsers.length > 0 ? (
                    <div className="max-h-[150px] overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 p-2">
                      <ul className="list-disc ml-4 space-y-1">
                        {coupon.applicableUsers.map(u => (
                          <li key={u.id} className="text-blue-600 break-words text-sm">
                            {u.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">No applicable users (All).</p>
                  )}
                </div>

                {/* Applicable Products */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Applicable Products</span>
                    {coupon.applicableProducts && coupon.applicableProducts.length > 0 && (
                      <span className="text-xs bg-white dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        Total: {coupon.applicableProducts.length}
                      </span>
                    )}
                  </div>
                  {coupon.applicableProducts && coupon.applicableProducts.length > 0 ? (
                    <div className="max-h-[200px] overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 p-2">
                      <ul className="list-disc ml-4 space-y-1">
                        {coupon.applicableProducts.map(p => (
                          <li key={p.id} className="text-blue-600 break-words text-sm">
                            {p.productName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">No applicable Products (All).</p>
                  )}
                </div>

                {/* Applied Users (Used By) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Used By</span>
                    {coupon.appliedUsers && coupon.appliedUsers.length > 0 && (
                      <span className="text-xs bg-white dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                        Total: {coupon.appliedUsers.length}
                      </span>
                    )}
                  </div>
                  {coupon.appliedUsers && coupon.appliedUsers.length > 0 ? (
                    <div className="max-h-[150px] overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 p-2">
                      <ul className="list-disc ml-4 space-y-1">
                        {coupon.appliedUsers.map(u => (
                          <li key={u.id} className="text-blue-600 break-words text-sm">
                            {u.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm italic">No usage yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCouponDetails;
