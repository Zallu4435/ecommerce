import { useEffect, useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import { useGetUsersQuery } from '../../redux/apiSliceFeatures/userApiSlice'; // Add your search query
import { useSearchUsersQuery } from '../../redux/apiSliceFeatures/AdminApiSlice';

const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // API requests
  const { data: allData = {}, isLoading, isError } = useGetUsersQuery();
  const { data: searchData = {}, refetch: refetchSearch } = useSearchUsersQuery(debouncedSearch, {
    skip: !debouncedSearch, // Skip API call if search is empty
  });

  // Debounce logic
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
    <div className="flex dark:bg-black h-screen fixed top-10 left-[420px] right-0">
      <div className="p-6 w-full px-14 dark:bg-gray-900 dark:text-white bg-orange-50">
        <h1 className="text-3xl font-bold mb-6 text-gray-400">User Management</h1>

        {/* AdminTable Component */}
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
