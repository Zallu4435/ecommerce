import { useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import { useGetUsersQuery } from '../../redux/apiSliceFeatures/userApiSlice';

const UserManagement = () => {
  const [search, setSearch] = useState('');

  const { data = [], isLoading, isError } = useGetUsersQuery();

  return (
    <div className="flex dark:bg-black h-screen ml-[120px]">

      <div className="p-6 w-full px-14  my-12 dark:bg-gray-900 dark:text-white bg-orange-50">
        <h1 className="text-3xl font-bold mb-6 text-gray-400">User Management</h1>

        {/* Use the UserTable component */}
        <AdminTable 
          type="users" 
          data={data} 
          search={search} 
          setSearch={setSearch} 
          isLoading={isLoading}
          isError={isError}
        />  
        
      </div>
    </div>
  );
};

export default UserManagement;
