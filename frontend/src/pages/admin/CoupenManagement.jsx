import { useState } from 'react'
import AdminTable from '../../components/admin/AdminTable';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CouponManagement = () => {

  const [search, setSearch] = useState('');

  const coupons = [
    {
      id: 1,
      couponCode: 'SUMMER20',
      discountValue: '20%',
      validFrom: '2024-06-01',
      validUntil: '2024-06-30',
      usageLimit: 50,
    },
    {
      id: 2, 
      couponCode: 'WINTER15',
      discountValue: '15%',
      validFrom: '2024-12-01',
      validUntil: '2024-12-31',
      usageLimit: 100,
    },
    {
      id: 3,
      couponCode: 'SPRING10',
      discountValue: '10%',
      validFrom: '2024-03-01',
      validUntil: '2024-03-31',
      usageLimit: 75,
    },
  ];
  
  
  return (
    <div className='dark:bg-black flex space-x-20'>
      <AdminSidebar />

      <div className='dark:bg-gray-900 bg-orange-50 px-20 my-12 dark:text-white text-gray-800'>
        <h1 className="text-3xl font-bold ml-[-60px] my-6 text-gray-400">Coupon Management</h1>

        <AdminTable type="coupons" data={coupons} search={search} setSearch={setSearch} />

      </div>
    </div>
  )
}

export default CouponManagement
