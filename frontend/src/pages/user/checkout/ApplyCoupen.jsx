import { useState } from 'react'

const ApplyCoupen = () => {

    const [coupon, setCoupon] = useState("");


  return (
    <>
        {/* Apply Coupon */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Apply Coupon</h2>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
            Apply Coupon
          </button>
        </div>
    </>
  )
}

export default ApplyCoupen
