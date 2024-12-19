
import { useState } from 'react';
import AdminTable from '../../components/admin/AdminTable';
import { useGetCategoriesQuery } from '../../redux/apiSliceFeatures/categoryApiSlice';
import { useButtonHandlers } from "../../components/admin/ButtonHandlers";

const CategoryManagement = () => {
  const [search, setSearch] = useState('');
  const { handleCreate } = useButtonHandlers();
  const { data = [], isLoading, isError,refetch } = useGetCategoriesQuery();
  
  return (
    <div className='flex h-screen dark:bg-black  dark:text-white space-x-16'>

      <div className='dark:bg-gray-900 bg-orange-50 ml-10 px-14 my-12'>
      <div className="flex justify-between mt-5 items-center">
          <h1 className="text-3xl font-bold text-gray-400">
            Category Management
          </h1>
          <button 
            className="border border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200"
            onClick={() => handleCreate('category')}
          >
            Create New Product 
          </button>
        </div>

          <AdminTable
            type="categories" 
            data={data} 
            search={search} 
            setSearch={setSearch}
            isLoading={isLoading}
            isError={isError} 
            refetch={refetch}
          />

      </div>


    </div>
  );
}

export default CategoryManagement;
