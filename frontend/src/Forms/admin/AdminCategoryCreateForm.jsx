import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAddEntityMutation } from "../../redux/apiSliceFeatures/crudApiSlice";
import { useGetCategoriesQuery } from "../../redux/apiSliceFeatures/categoryApiSlice";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { categorySchema } from "../../validation/admin/categoryFormValidation";

const AdminCategoryCreateForm = () => {
  const navigate = useNavigate();
  const [addEntity] = useAddEntityMutation();
  const { refetch: refetchCategory } = useGetCategoriesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      await addEntity({ entity: "category", data }).unwrap();
      refetchCategory();
      navigate(-1);
    } catch (error) {
      console.error("Error occurred while adding category:", error);
      toast.error(
        error?.data?.message || "An error occurred while adding the category"
      );
    }
  };

  return (
    <div className="dark:bg-gray-900 bg-orange-50 min-h-screen px-6 lg:px-10 mt-10 py-10 text-gray-700 dark:text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-400 ml-10">
          Create New Category
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2" />
          <span>Back to Products</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        method="POST"
        className="space-y-6"
      >
        <div className="flex">
          <div className="mb-6 mx-10 w-1/2">
            <label className="font-bold text-xl block mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter Category Name"
              {...register("categoryName")}
              className={`w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg ${
                errors.categoryName ? "border-red-500" : ""
              }`}
            />
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </div>

          <div className="mb-6 mx-10 w-1/2">
            <label className="font-bold text-xl block mb-2">
              Category Offer
            </label>
            <input
              type="text"
              placeholder="Enter Category Offer"
              {...register("categoryOffer")}
              className={`w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg ${
                errors.categoryOffer ? "border-red-500" : ""
              }`}
            />
            {errors.categoryOffer && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryOffer.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6 mx-10">
          <label className="font-bold text-lg block mb-2">
            Category Description
          </label>
          <textarea
            placeholder="Write your category description here"
            {...register("categoryDescription")}
            className={`w-full p-4 border mt-1 border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg ${
              errors.categoryDescription ? "border-red-500" : ""
            }`}
            rows="5"
          ></textarea>
          {errors.categoryDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.categoryDescription.message}
            </p>
          )}
        </div>

        <div className="mx-10">
          <button
            type="submit"
            className="py-3 w-full  mt-4 text-lg font-bold dark:bg-blue-600 bg-orange-500 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCategoryCreateForm;
