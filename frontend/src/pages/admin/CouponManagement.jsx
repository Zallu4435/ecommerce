import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useGetAllCouponsQuery } from "../../redux/apiSliceFeatures/CouponApiSlice";
import { useButtonHandlers } from "../../components/admin/ButtonHandlers";
import { useSearchAdminCouponsQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const CouponManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { handleCreate } = useButtonHandlers();

  const { data: allData = {}, isLoading, isError, refetch } = useGetAllCouponsQuery({ page, limit });
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

  const dataToDisplay = debouncedSearch ? searchData || [] : allData?.coupons || [];

  return (
    <div className="flex h-screen dark:bg-black top-10 fixed left-[420px] right-0 dark:text-white">
      <div className="dark:bg-gray-900 w-full bg-orange-50 px-14">
        <div className="flex justify-between mt-5 items-center">
          <h1 className="text-3xl font-bold text-gray-400">
            Coupon Management
          </h1>
          <button
            className="border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
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
          refetch={debouncedSearch ? refetchSearch : refetch}
          pagination={{
            currentPage: page,
            totalPages: allData?.totalPages || 1,
            onPageChange: setPage,
          }}
        />
      </div>
    </div>
  );
};

export default CouponManagement;
