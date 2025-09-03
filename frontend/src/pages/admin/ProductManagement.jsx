import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useGetProductsQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import { useButtonHandlers } from "../../components/admin/ButtonHandlers";
import { useSearchAdminProductsQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const ProductManagement = () => {
  const [search, setSearch] = useState("");
  const { handleCreate } = useButtonHandlers();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: allData = [],
    isLoading,
    isError,
  } = useGetProductsQuery({ page: currentPage, limit });

  const { data: searchData = {}, refetch: refetchSearch } =
    useSearchAdminProductsQuery(
      { search: debouncedSearch, page: currentPage, limit },
      {
        skip: !debouncedSearch,
      }
    );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const dataToDisplay = debouncedSearch
    ? searchData || []
    : allData?.products || [];

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
    <div className="min-h-screen dark:bg-gray-900 fixed top-10 right-0 left-[420px] dark:text-white bg-orange-50 py-6 px-14">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-400">Product Management</h1>
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
        <button
          className="border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
          onClick={() => handleCreate("products")}
        >
          Create New Product
        </button>
      </div>

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
