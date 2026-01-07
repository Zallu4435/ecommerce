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
import { ArrowLeft, Upload } from "lucide-react";
import { categorySchema } from "../../validation/admin/categoryFormValidation";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Input,
  InputContainer,
  TextArea,
  Label,
} from "../../components/user/StyledComponents/StyledComponents";

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

      // Populate new offer details
      setValue("offerName", data?.category?.offerName || "");
      setValue("isOfferActive", data?.category?.isOfferActive || false);

      if (data?.category?.startDate) {
        setValue("startDate", new Date(data.category.startDate).toISOString().split('T')[0]);
      }

      if (data?.category?.endDate) {
        setValue("endDate", new Date(data.category.endDate).toISOString().split('T')[0]);
      }
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
    <div className="dark:bg-black min-h-screen flex mt-10 items-center justify-center">
      <div className="w-full max-w-[1000px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 shadow-md">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">
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

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Category Name */}
          <InputContainer>
            <Label className="text-gray-700 dark:text-white">Category Name *</Label>
            <Input
              type="text"
              placeholder="Enter Category Name"
              {...register("categoryName")}
              className="dark:text-white dark:bg-gray-800"
            />
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryName.message}
              </p>
            )}
          </InputContainer>

          {/* Offer Details Section */}
          <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-md mb-6 bg-white dark:bg-gray-800/50">
            <h3 className="text-lg font-bold mb-4 text-orange-600 dark:text-orange-500 border-b border-gray-200 dark:border-gray-700 pb-2">
              Promo Offer Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <InputContainer>
                <Label className="text-gray-700 dark:text-white">Offer Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. Summer Sale"
                  {...register("offerName")}
                  className="dark:text-white dark:bg-gray-800"
                />
              </InputContainer>

              <InputContainer>
                <Label className="text-gray-700 dark:text-white">Discount Percentage (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  {...register("categoryOffer")}
                  className="dark:text-white dark:bg-gray-800"
                />
                {errors.categoryOffer && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.categoryOffer.message}
                  </p>
                )}
              </InputContainer>

              <InputContainer>
                <Label className="text-gray-700 dark:text-white">Valid From</Label>
                <Input
                  type="date"
                  {...register("startDate")}
                  className="dark:text-white dark:bg-gray-800"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </InputContainer>

              <InputContainer>
                <Label className="text-gray-700 dark:text-white">Valid To</Label>
                <Input
                  type="date"
                  {...register("endDate")}
                  className="dark:text-white dark:bg-gray-800"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </InputContainer>
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="isOfferActive"
                {...register("isOfferActive")}
                className="w-5 h-5 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
              />
              <Label htmlFor="isOfferActive" className="ml-2 mb-0 cursor-pointer text-gray-700 dark:text-white">
                Activate Offer
              </Label>
            </div>
          </div>

          {/* Description */}
          <InputContainer>
            <Label className="text-gray-700 dark:text-white">Category Description *</Label>
            <TextArea
              placeholder="Write your category description here"
              {...register("categoryDescription")}
              rows="5"
              className="dark:text-white dark:bg-gray-800"
            />
            {errors.categoryDescription && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryDescription.message}
              </p>
            )}
          </InputContainer>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full dark:bg-blue-600 bg-orange-500 text-white px-6 py-3 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 flex items-center justify-center font-bold text-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="mr-2" />
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryUpdateForm;
