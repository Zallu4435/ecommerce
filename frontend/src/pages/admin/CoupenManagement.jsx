import { useState } from 'react'
import AdminTable from '../../components/admin/AdminTable';
import { useButtonHandlers } from '../../components/admin/ButtonHandlers';
import { useGetAllCouponsQuery } from '../../redux/apiSliceFeatures/CouponApiSlice';

const CouponManagement = () => {

  const [search, setSearch] = useState('');
  
  const { data = [], isLoading, isError } = useGetAllCouponsQuery();
    const { handleCreate } = useButtonHandlers();
  
  
  return (
    <div className='dark:bg-black h-screen fixed left-[420px] top-10 right-0 flex'>

      <div className='dark:bg-gray-900 w-full bg-orange-50 px-20 dark:text-white text-gray-800'>
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
