import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAddEntityMutation } from '../../redux/apiSliceFeatures/crudApiSlice'
import { useGetCategoriesQuery } from '../../redux/apiSliceFeatures/categoryApiSlice'

// Define validation schema using zod
const schema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  productCount: z
    .string()
    .min(1, 'Product count is required')
    .transform((value) => Number(value)), // Transform the string to a number
});

const AdminCategoryCreateForm = () => {

  const navigate = useNavigate(); 
  const [addEntity] = useAddEntityMutation();
  const { refetch: refetchCategory } = useGetCategoriesQuery();

  // Initialize react-hook-form with zod resolver for validation
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data, e) => {
    e.preventDefault();

    await addEntity({ entity: "category", data }).unwrap();
    refetchCategory();
    
    console.log("Final data sent to backend:", data);
    navigate(-1)
  }

  return (
    <div className='dark:bg-gray-900 bg-orange-50 ml-[400px] px-10 py-[50px] mt-[200px] text-gray-700 dark:text-white'>
      <h1 className="text-3xl font-bold ml-[-60px] mb-6 text-gray-400  px-24">Create New Category</h1>
        
      <form onSubmit={handleSubmit(onSubmit)} method="POST">
        <div className="mb-6 mx-10">
          <label className='font-bold text-xl'>Category Name</label>
          <input
            type="text"
            placeholder="Enter Category Name"
            {...register('categoryName')}
            className={`w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg ${errors.categoryName ? 'border-red-500' : ''}`}
          />
          {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName.message}</p>}
        </div>

        <div className="mb-6 mx-10">
          <label className='font-bold text-lg'>Product Count</label>
          <input
            type="text"
            placeholder="Enter Products Count"
            {...register('productCount')}
            className={`w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg ${errors.productCount ? 'border-red-500' : ''}`}
          />
          {errors.productCount && <p className="text-red-500 text-sm">{errors.productCount.message}</p>}
        </div>

        <button
          type="submit"
          className="py-3 w-[371px] ml-10 mt-4 text-lg font-bold dark:bg-blue-600 bg-orange-500 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default AdminCategoryCreateForm
