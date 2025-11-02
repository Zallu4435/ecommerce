import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEntityMutation } from "../../redux/apiSliceFeatures/crudApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
} from "../../redux/apiSliceFeatures/categoryApiSlice";
import { ArrowLeft } from "lucide-react";
import { categorySchema } from "../../validation/admin/categoryFormValidation";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminCategoryUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateEntity] = useUpdateEntityMutation();
  const { refetch } = useGetCategoriesQuery();
  const { data, error, isLoading } = useGetCategoryByIdQuery(id);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (data) {
      setValue("categoryName", data?.category?.categoryName);
      setValue("categoryOffer", data?.category?.categoryOffer);
      setValue("categoryDescription", data?.category?.categoryDescription);
    }
  }, [data, setValue]);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await updateEntity({
        entity: "category",
        data,
        id,
      }).unwrap();
      if (response?.error) {
        toast.error(response.error.message);
        return;
      }
      refetch();
      toast.success("Category updated successfully");

      navigate(-1);
    } catch (error) {
      toast.error(
        error?.data?.message || "An error occurred while updating the category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dark:bg-gray-900 bg-orange-50 min-h-screen px-6 lg:px-10 mt-10 py-10 text-gray-700 dark:text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-400 ml-10">
          Update Category
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
          <label className="font-bold text-lg">Category Description</label>
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
            disabled={isSubmitting}
            className="py-3 w-full  mt-4 text-lg font-bold dark:bg-blue-600 bg-orange-500 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCategoryUpdateForm;
