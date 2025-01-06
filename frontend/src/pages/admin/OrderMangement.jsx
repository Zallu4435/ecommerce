// import { useEffect, useState } from 'react'
// import AdminTable from '../../components/admin/AdminTable'
// import { useGetUsersOrdersQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';
// import { useSearchAdminOrdersQuery } from '../../redux/apiSliceFeatures/AdminApiSlice';
// // import { useGetOrdersQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';

// const OrderManagement = () => {

//   const [search, setSearch] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');

//   const { data: allData =  [], isLoading, isError } = useGetUsersOrdersQuery();
//   const { data: searchData = {}, refetch: refetchSearch } = useSearchAdminOrdersQuery(debouncedSearch, {
//     skip: !debouncedSearch, // Skip API call if search is empty
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search); // Update debounced search after a delay
//     }, 500); // Delay in milliseconds

//     // Clean up timer
//     return () => clearTimeout(timer);
//   }, [search]);

//   // Data to pass to AdminTable
//   const dataToDisplay = debouncedSearch
//     ? searchData || [] // Use searchData.users if available
//     : allData || [];   // Use allData.users if available

//   return (
//       <div className="dark:bg-gray-900 py-2 h-screen fixed left-[420px] top-10 right-0 dark:text-white bg-orange-50 px-14">
//           <h1 className="text-3xl mt-5 font-bold text-gray-400">
//             Order Management
//           </h1>

//           <AdminTable
//           type="orders"
//           data={dataToDisplay}
//           search={search}
//           setSearch={setSearch}
//           isLoading={isLoading}
//           isError={isError}
//           refetch={debouncedSearch ? refetchSearch : undefined}
//         />

//       </div>
//   )
// }

// export default OrderManagement

import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useGetUsersOrdersQuery } from "../../redux/apiSliceFeatures/OrderApiSlice";
import { useSearchAdminOrdersQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";
// import { useGetOrdersQuery } from '../../redux/apiSliceFeatures/OrderApiSlice';

const OrderManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Items per page

  const {
    data: allData = [],
    isLoading,
    isError,
  } = useGetUsersOrdersQuery({ page: currentPage, limit });

  const { data: searchData = {}, refetch: refetchSearch } =
    useSearchAdminOrdersQuery(
      debouncedSearch,
      { search: debouncedSearch, page: currentPage, limit },
      {
        skip: !debouncedSearch, // Skip API call if search is empty
      }
    );

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
    : allData || []; // Use allData.users if available

  const totalProducts = debouncedSearch
    ? searchData?.totalProducts || 0
    : allData?.totalProducts || 0;

  const totalPages = Math.ceil(totalProducts / limit);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="dark:bg-gray-900 py-2 h-screen fixed left-[420px] top-10 right-0 dark:text-white bg-orange-50 px-14">
      <div className="flex justify-between">
        <h1 className="text-3xl mt-5 font-bold text-gray-400">
          Order Management
        </h1>
        <div className="flex justify-between space-x-4 items-center mb-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600 dark:text-gray-300">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>

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
  );
};

export default OrderManagement;
