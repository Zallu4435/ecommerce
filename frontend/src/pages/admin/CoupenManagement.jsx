import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useButtonHandlers } from "../../components/admin/ButtonHandlers";
import { useGetAllCouponsQuery } from "../../redux/apiSliceFeatures/CouponApiSlice";
import { useSearchAdminCouponsQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const CouponManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { handleCreate } = useButtonHandlers();

  const { data: allData = [], isLoading, isError } = useGetAllCouponsQuery();
  const { data: searchData = {}, refetch: refetchSearch } =
    useSearchAdminCouponsQuery(debouncedSearch, {
      skip: !debouncedSearch,
    });

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const dataToDisplay = debouncedSearch ? searchData || [] : allData || [];

  return (
    <div className="dark:bg-black h-screen fixed left-[420px] top-10 right-0 flex">
      <div className="dark:bg-gray-900 w-full bg-orange-50 px-20 dark:text-white text-gray-800">
        <div className="flex justify-between mt-5 items-center">
          <h1 className="text-3xl font-bold text-gray-400">
            Coupon Management
          </h1>
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
