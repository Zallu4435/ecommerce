import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useGetCategoriesQuery } from "../../redux/apiSliceFeatures/categoryApiSlice";
import { useButtonHandlers } from "../../components/admin/ButtonHandlers";
import { useSearchAdminCategoriesQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const CategoryManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { handleCreate } = useButtonHandlers();

  const { data: allData = [], isLoading, isError } = useGetCategoriesQuery();
  const { data: searchData = {}, refetch: refetchSearch } =
    useSearchAdminCategoriesQuery(debouncedSearch, {
      skip: !debouncedSearch,
    });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    // Clean up timer
    return () => clearTimeout(timer);
  }, [search]);

  const dataToDisplay = debouncedSearch ? searchData || [] : allData || [];
  return (
    <div className="flex h-screen dark:bg-black top-10 fixed left-[420px] right-0 dark:text-white">
      <div className="dark:bg-gray-900 w-full bg-orange-50 px-14">
        <div className="flex justify-between mt-5 items-center">
          <h1 className="text-3xl font-bold text-gray-400">
            Category Management
          </h1>
          <button
            className="border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
            onClick={() => handleCreate("category")}
          >
            Create New Category
          </button>
        </div>

        <AdminTable
          type="categories"
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

export default CategoryManagement;
