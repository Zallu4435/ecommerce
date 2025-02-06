import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useGetUsersQuery } from "../../redux/apiSliceFeatures/userApiSlice";
import { useSearchUsersQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: allData = {},
    isLoading,
    isError,
  } = useGetUsersQuery({
    page: currentPage,
    limit,
  });

  const { data: searchData = {}, refetch: refetchSearch } = useSearchUsersQuery(
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
    : allData?.users || [];

  const totalUsers = debouncedSearch
    ? searchData?.totalUsers || 0
    : allData?.totalUsers || 0;

  const totalPages = Math.ceil(totalUsers / limit);

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
    <div className="flex dark:bg-black h-screen fixed top-10 left-[420px] right-0">
      <div className="p-6 w-full px-14 dark:bg-gray-900 dark:text-white bg-orange-50">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6 text-gray-400">
            User Management
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
          type="users"
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

export default UserManagement;
