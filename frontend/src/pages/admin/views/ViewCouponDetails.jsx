import { useNavigate, useParams } from "react-router-dom";
import { useGetCouponQuery } from "../../../redux/apiSliceFeatures/CouponApiSlice";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ViewCouponDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCouponQuery(id);
  const coupon = data?.coupon;
  const navigate = useNavigate();

  const isExpired = () => {
    const currentDate = new Date(); 
    const expiryDate = new Date(data.coupon.expiry); 
  
    return currentDate > expiryDate; 
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !coupon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-bold text-red-500">
          Failed to load coupon details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 min-h-screen px-12 bg-orange-50 dark:bg-gray-900">
      <div className="flex justify-between mt-[-60px] mb-5 items-center w-full">
        {" "}
        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-300 mb-4">
          Coupon Details
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2" />
          <span>Back to Products</span>
        </button>
      </div>
      <div className="w-full bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-4 border-b pb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Coupon Code:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {coupon?.couponCode}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Title:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {coupon?.title}
            </span>
          </div>

          <div>
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Description:
            </span>
            <p className="text-gray-800 dark:text-gray-200 mt-2">
              {coupon?.description}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Discount:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {coupon?.discount}%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Minimum Amount:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              ₹{parseFloat(coupon?.minAmount).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Maximum Discount Amount:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              ₹{coupon?.maxAmount}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Expiry Date:
            </span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {new Date(coupon?.expiry).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Is Expired:
            </span>
            <span
              className={`font-medium px-5 py-1 rounded ${
                coupon?.isExpired
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {isExpired() ? "Expired" : "Active"}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
            Applicable Users
          </h3>
          {coupon?.applicableUsers && coupon?.applicableUsers.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-800 dark:text-gray-200 space-y-1">
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {coupon?.applicableUsers.map((user) => (
                  <li
                    key={user.id}
                    style={{ color: "blue", wordBreak: "break-word" }} // Change color to blue
                  >
                    {user.email}
                  </li>
                ))}
              </ul>
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No applicable users.
            </p>
          )}

          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-6 mb-4">
            Users Who Have Used the Coupon
          </h3>
          {coupon?.appliedUsers && coupon?.appliedUsers.length > 0 ? (
            <ul
              style={{ listStyleType: "none", padding: 0 }}
              className="list-disc ml-6 text-gray-800 dark:text-gray-200 space-y-1"
            >
              {coupon?.appliedUsers.map((user) => (
                <li
                  key={user.id}
                  style={{ color: "blue", wordBreak: "break-word" }} 
                >
                  {user.email}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No users have used this coupon yet.
            </p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
            Applicable Products
          </h3>
          {coupon?.applicableProducts &&
          coupon?.applicableProducts.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-800 dark:text-gray-200 space-y-1">
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {coupon?.applicableProducts.map((product) => (
                  <li
                    key={product.id}
                    style={{ color: "blue", wordBreak: "break-word" }} 
                  >
                    {product.productName}
                  </li>
                ))}
              </ul>
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No applicable Products.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCouponDetails;
