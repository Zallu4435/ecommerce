import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCouponQuery } from '../../../redux/apiSliceFeatures/CouponApiSlice';
import { ArrowLeft } from 'lucide-react';

const ViewCouponDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetCouponQuery(id); // 'data' contains the entire response

  const coupon = data?.coupon; // Extracting 'coupon' from the API response

  const navigate = useNavigate();
  console.log(coupon, 'coupon details'); // Logging the correct 'coupon' object

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
          Loading coupon details...
        </p>
      </div>
    );
  }

  if (isError || !coupon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg font-bold text-red-500">Failed to load coupon details.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 min-h-screen px-12 bg-orange-50 dark:bg-gray-900">
      <div className='flex justify-between mt-[-60px] mb-5 items-center w-full'> {/* Adjusted margin-top here */}
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
        {/* General Details */}
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
            <p className="text-gray-800 dark:text-gray-200 mt-2">{coupon?.description}</p>
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
              className={`font-medium px-5 py-1 rounded ${coupon?.isExpired ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
            >
              {coupon?.isExpired ? 'Expired' : 'Active'}
            </span>
          </div>
        </div>

        {/* Applicables and Users Taken */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
            Applicable Users
          </h3>
          {coupon?.applicables && coupon?.applicables.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-800 dark:text-gray-200 space-y-1">
              {coupon?.applicables.map((user, index) => (
                <li key={index} className="break-words">
                  {user}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No applicable users.</p>
          )}

          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-6 mb-4">
            Users Who Have Used the Coupon
          </h3>
          {coupon?.usersTaken && coupon?.usersTaken.length > 0 ? (
            <ul className="list-disc ml-6 text-gray-800 dark:text-gray-200 space-y-1">
              {coupon?.usersTaken.map((user, index) => (
                <li key={index} className="break-words">
                  {user}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No users have used this coupon yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCouponDetails;
