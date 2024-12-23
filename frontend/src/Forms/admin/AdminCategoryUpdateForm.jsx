import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateEntityMutation } from '../../redux/apiSliceFeatures/crudApiSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetCategoriesQuery, useGetCategoryByIdQuery } from '../../redux/apiSliceFeatures/categoryApiSlice'
import { ArrowLeft } from 'lucide-react'

// Define validation schema using zod
const schema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  categoryDescription: z
    .string()
    .min(10, 'Category description is required')
});

const AdminCategoryUpdateForm = () => {

  const { id } = useParams(); // Get id from URL
  const navigate = useNavigate(); 
  const [updateEntity] = useUpdateEntityMutation();
const { refetch } = useGetCategoriesQuery();
  const { data, error, isLoading } = useGetCategoryByIdQuery(id);

  console.log(id, "id")

  // Initialize react-hook-form with zod resolver for validation
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

    useEffect(() => {
      // Populate the form with the fetched data once it's available
      if (data) {
        setValue("categoryName", data?.category?.categoryName);
        setValue("categoryDescription", data?.category?.categoryDescription);
      }
    }, [data, setValue]);

  const onSubmit = async (data, e) => {
    e.preventDefault();

     await updateEntity({ entity: "category", data, id }).unwrap();
     refetch()
          toast.success("Product saved successfully");
    
          navigate(-1);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='dark:bg-gray-900 bg-orange-50 text-gray-700 ml-[300px] py-[50px] px-14 mt-[90px]  dark:text-white'>
              <div className="flex ml-[-10px] mt-[-20px] items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            <span>Back to Products</span>
          </button>
        </div>
      <h1 className="text-3xl font-bold ml-[-60px] mb-6 text-gray-400 px-24">Update Category</h1>
        
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
          Update
        </button>
      </form>
    </div>
  )
}

export default AdminCategoryUpdateForm
