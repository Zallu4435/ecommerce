import { useState } from 'react'
import AdminTable from '../../components/admin/AdminTable'
import { useGetUsersOrdersQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';
// import { useGetOrdersQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';

const OrderManagement = () => {

  const [search, setSearch] = useState('');      

  const { data: ordersData =  [], isLoading, isError } = useGetUsersOrdersQuery();

  // console.log(data, "data")

  return (
      <div className="dark:bg-gray-900 py-2 h-screen fixed left-[420px] top-10 right-0 dark:text-white bg-orange-50 px-14">
          <h1 className="text-3xl mt-5 font-bold text-gray-400">
            Order Management
          </h1>

            <AdminTable 
              type="orders" 
              data={{ orders: ordersData }}
              search={search} 
              setSearch={setSearch} 
              isLoading={isLoading}
              isError={isError}
            />

      </div>    
  )
}

export default OrderManagement
