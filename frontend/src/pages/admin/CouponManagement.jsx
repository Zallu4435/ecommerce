import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useButtonHandlers } from "../../components/admin/ButtonHandlers";
import { useGetAllCouponsQuery } from "../../redux/apiSliceFeatures/CouponApiSlice";
import { useSearchAdminCouponsQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const CouponManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { handleCreate } = useButtonHandlers();

  const {
    data: allData = [],
    isLoading,
    isError,
  } = useGetAllCouponsQuery({
    page: currentPage,
    limit,
  });
  const { data: searchData = {}, refetch: refetchSearch } =
    useSearchAdminCouponsQuery(debouncedSearch, {
      skip: !debouncedSearch,
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const dataToDisplay = debouncedSearch ? searchData || [] : allData || [];

  const totalCoupons = debouncedSearch
    ? searchData?.totalCoupons || 0
    : allData?.totalCoupons || 0;

  const totalPages = Math.ceil(totalCoupons / limit);

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
    <div className="dark:bg-black h-screen fixed left-[420px] top-10 right-0 flex">
      <div className="dark:bg-gray-900 w-full bg-orange-50 px-20 dark:text-white text-gray-800">
        <div className="flex justify-between mt-5 items-center">
          <h1 className="text-3xl font-bold text-gray-400">
            Coupon Management
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
          <button
            className="border border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
            onClick={() => handleCreate("coupons")}
          >
            Create New Coupon
          </button>
        </div>

        <AdminTable
          type="coupons"
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

export default CouponManagement;
