// import { useState } from "react";
// import AdminTable from "../../components/admin/AdminTable";
// import { useGetProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
// import { useButtonHandlers } from "../../components/admin/ButtonHandlers";

// const ProductManagement = () => {
//   const [search, setSearch] = useState("");
//   const { handleCreate } = useButtonHandlers();

//   // Fetch product data using the API call                                                                     
//   const { data = [], isLoading, isError } = useGetProductsQuery();

//   return (

//       <div className="dark:bg-gray-900 fixed top-10 right-0 left-[420px] dark:text-white bg-orange-50 py-6 px-14">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold text-gray-400">
//             Product Management
//           </h1>
//           <button 
//             className="border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
//             onClick={() => handleCreate('products')}
//           >
//             Create New Product 
//           </button>
//         </div>


//         {/* Pass the fetched data and search state to AdminTable */}
//         <div className="overflow-y-auto scrollbar-hidden">
//           <AdminTable
//             type="products"
//             data={data}
//             isLoading={isLoading}
//             isError={isError}
//             search={search}
//             setSearch={setSearch}
//           />
//         </div>
//       </div>
//   );
// };

// export default ProductManagement;



import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useGetProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import { useButtonHandlers } from "../../components/admin/ButtonHandlers";
import { useSearchAdminProductsQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const ProductManagement = () => {
  const [search, setSearch] = useState("");
  const { handleCreate } = useButtonHandlers();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Fetch product data using the API call                                                                     
  const { data: allData = [], isLoading, isError } = useGetProductsQuery();
  const { data: searchData = {}, refetch: refetchSearch } = useSearchAdminProductsQuery(debouncedSearch, {
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

      <div className="dark:bg-gray-900 fixed top-10 right-0 left-[420px] dark:text-white bg-orange-50 py-6 px-14">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-400">
            Product Management
          </h1>
          <button 
            className="border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
            onClick={() => handleCreate('products')}
          >
            Create New Product 
          </button>
        </div>


        {/* Pass the fetched data and search state to AdminTable */}
        <div className="overflow-y-auto scrollbar-hidden">
        <AdminTable
          type="products"
          data={dataToDisplay}
          search={search}
          setSearch={setSearch}
          isLoading={isLoading}
          isError={isError}
          refetch={debouncedSearch ? refetchSearch : undefined}
        />
        </div>
      </div>
  );
};

export default ProductManagement;
