
import { useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CategoryManagement = () => {
    const [search, setSearch] = useState('');

    const categories = [
      { id: 1, name: 'John Doe', productCount: "212", createdAt: "04-Jan-2024", updatedAt: "04-Jan-2024"},
      { id: 3, name: 'Samuel Green', productCount: "212", createdAt: "04-Jan-2024", updatedAt: "04-Jan-2024" },
      { id: 2, name: 'Jane Smith', productCount: "212", createdAt: "04-Jan-2024", updatedAt: "04-Jan-2025"},
      // Add more sample categories here
    ];

  return (
    <div className='flex dark:bg-black dark:text-white space-x-16'>
      <AdminSidebar />

      <div className='dark:bg-gray-900 bg-orange-50 px-14 my-12'>
        <h1 className="text-3xl font-bold ml-[-30px] my-6 text-gray-400">Category Management</h1>
        
        <AdminTable type="categories" data={categories} search={search} setSearch={setSearch} />

      </div>

      <div className='dark:bg-gray-900 bg-orange-50 text-gray-700 dark:text-white'>
        <h1 className="text-3xl font-bold ml-[-60px] mb-6 text-gray-400 my-14 px-24">Create New Category</h1>
            
        <form action="#" method="POST" >
          <div className="mb-6 mx-10">
            <label className='font-bold text-xl'>Category Name</label>
            <input
              type="text"
              placeholder="Enter Category Name"
              className="w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg"
            />
          </div>
    
          <div className="mb-6 mx-10">
            <label className='font-bold text-lg'>Product Count</label>
            <input
              type="text"
              placeholder="Enter Products Count"
              className="w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg"
            />
          </div>
    
          <button
            type="submit"
            className="py-3 w-[371px] ml-10 mt-4 text-lg font-bold dark:bg-blue-600 bg-orange-500 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create
          </button>
        </form>
      </div>

    </div>
  );
}

export default CategoryManagement;
