import { useState } from 'react'
import AdminTable from '../../components/admin/AdminTable';
import { useGetCouponsQuery } from '../../redux/apiSliceFeatures/couponApiSlice';
import { useButtonHandlers } from '../../components/admin/ButtonHandlers';

const CouponManagement = () => {

  const [search, setSearch] = useState('');
  
  const { data = [], isLoading, isError } = useGetCouponsQuery();
    const { handleCreate } = useButtonHandlers();
  
  
  return (
    <div className='dark:bg-black h-screen mx-16 flex'>

      <div className='dark:bg-gray-900 bg-orange-50 px-20 my-12 dark:text-white text-gray-800'>
        <div className="flex justify-between mt-5 items-center">
          <h1 className="text-3xl font-bold text-gray-400">
            Coupon Management
          </h1>
          <button 
            className="border border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
            onClick={() => handleCreate('coupons')}
          >
            Create New Coupon 
          </button>
        </div>

        <AdminTable 
        type="coupons" 
        data={data} 
        search={search} 
        setSearch={setSearch} 
        isError={isError}
        isLoading={isLoading}
      />

      </div>
    </div>
  )
}

export default CouponManagement
