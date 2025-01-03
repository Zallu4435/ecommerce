import { useEffect, useState } from 'react'
import AdminTable from '../../components/admin/AdminTable'
import { useGetUsersOrdersQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';
import { useSearchAdminOrdersQuery } from '../../redux/apiSliceFeatures/AdminApiSlice';
// import { useGetOrdersQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';

const OrderManagement = () => {

  const [search, setSearch] = useState('');     
  const [debouncedSearch, setDebouncedSearch] = useState('');
 

  const { data: allData =  [], isLoading, isError } = useGetUsersOrdersQuery();
  const { data: searchData = {}, refetch: refetchSearch } = useSearchAdminOrdersQuery(debouncedSearch, {
    skip: !debouncedSearch, // Skip API call if search is empty
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search); // Update debounced search after a delay
    }, 500); // Delay in milliseconds

    // Clean up timer
    return () => clearTimeout(timer);
  }, [search]);

  // Data to pass to AdminTable
  const dataToDisplay = debouncedSearch
    ? searchData || [] // Use searchData.users if available
    : allData || [];   // Use allData.users if available


  return (
      <div className="dark:bg-gray-900 py-2 h-screen fixed left-[420px] top-10 right-0 dark:text-white bg-orange-50 px-14">
          <h1 className="text-3xl mt-5 font-bold text-gray-400">
            Order Management
          </h1>

          <AdminTable
          type="orders"
          data={dataToDisplay}
          search={search}
          setSearch={setSearch}
          isLoading={isLoading}
          isError={isError}
          refetch={debouncedSearch ? refetchSearch : undefined}
        />

      </div>    
  )
}

export default OrderManagement
