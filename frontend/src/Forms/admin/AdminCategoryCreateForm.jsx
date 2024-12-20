import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAddEntityMutation } from '../../redux/apiSliceFeatures/crudApiSlice'
import { useGetCategoriesQuery } from '../../redux/apiSliceFeatures/categoryApiSlice'
import { ArrowLeft } from 'lucide-react'

// Define validation schema using zod
const schema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  categoryDescription: z
    .string()
    .min(10, 'Category description is required')
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
    <div className='dark:bg-gray-900 bg-orange-50 ml-[300px] px-10 py-[50px] mt-[90px] text-gray-700 dark:text-white'>
                    <div className="flex ml-[-10px] mt-[-20px] items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            <span>Back to Products</span>
          </button>
        </div>
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
          <label className="font-bold text-lg">Category Description</label>
          <textarea
            placeholder="Write your category description here"
            {...register('categoryDescription')}
            className={`w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg ${
              errors.categoryDescription ? 'border-red-500' : ''
            }`}
            rows="5"
          ></textarea>
          {errors.categoryDescription && (
            <p className="text-red-500 text-sm">{errors.categoryDescription.message}</p>
          )}
        </div>


        <button
          type="submit"
          className="py-3 w-[400px] ml-10 mt-4 text-lg font-bold dark:bg-blue-600 bg-orange-500 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default AdminCategoryCreateForm
