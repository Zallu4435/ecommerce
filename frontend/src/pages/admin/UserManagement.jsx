import { useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import AdminSidebar from '../../components/admin/AdminSidebar';

const UserManagement = () => {
  const [search, setSearch] = useState('');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Samuel Green', email: 'samuel@example.com', role: 'Manager' },
    // Add more sample users here
  ];

  return (
    <div className="flex dark:bg-black">
      <AdminSidebar />

      <div className="p-6 w-full mx-16 px-20 my-10 dark:bg-gray-900 dark:text-white bg-orange-50">
        <h1 className="text-3xl font-bold ml-[-60px] mb-6 text-gray-400">User Management</h1>

        {/* Use the UserTable component */}
        <AdminTable type="users" data={users} search={search} setSearch={setSearch} />  
        
      </div>
    </div>
  );
};

export default UserManagement;
