import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { productValidationSchema } from "../../validation/admin/ProductFormValidation";
import VariantBuilder from "../../components/admin/VariantBuilder";
import {
  Input,
  InputContainer,
  TextArea,
  Label,
} from "../../components/user/StyledComponents/StyledComponents";
import { toast } from "react-toastify";
import { useAddEntityMutation } from "../../redux/apiSliceFeatures/crudApiSlice";
import { uploadImageToCloudinary } from "../../server";
import ImageInput from "../../components/ImageInput";
import { useGetCategoriesQuery } from "../../redux/apiSliceFeatures/categoryApiSlice";

const AdminProductCreateForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addEntity] = useAddEntityMutation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(productValidationSchema),
    defaultValues: {
      variants: [],
    },
  });

  const { data: categoriesData } = useGetCategoriesQuery();
  const categoryOptions = categoriesData?.categories || [];

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload main product image
      if (data.image) {
        const mainImage = await uploadImageToCloudinary(data.image);
        data.image = mainImage.secureUrl;
        data.imagePublicId = mainImage.publicId;
      }

      // Upload variant images
      if (data.variants && data.variants.length > 0) {
        const variantsWithImages = await Promise.all(
          data.variants.map(async (variant) => {
            // Upload if it's NOT a string OR if it's a Base64 string (starts with data:image)
            if (variant.image && (typeof variant.image !== 'string' || variant.image.startsWith('data:image'))) {
              // Upload variant image to Cloudinary
              const uploaded = await uploadImageToCloudinary(variant.image);
              return {
                ...variant,
                image: uploaded.secureUrl,
                imagePublicId: uploaded.publicId,
              };
            }
            return variant;
          })
        );
        data.variants = variantsWithImages;
      }

      await addEntity({ entity: "products", data }).unwrap();
      toast.success("Product added successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const basePrice = watch("basePrice");
  const baseOfferPrice = watch("baseOfferPrice");

  return (
    <div className="dark:bg-black min-h-screen flex mt-10 items-center justify-center">
      <div className="w-full max-w-[1300px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 shadow-md">
        {/* Back Button */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">
            Add Product
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
          {/* Basic Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Product Name *</Label>
              <Controller
                name="productName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter product name"
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.productName.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Brand *</Label>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Brand Name"
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.brand.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Category *</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-gray-800"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((c) => (
                      <option key={c._id} value={c.categoryName}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </InputContainer>
          </div>

          {/* Description & Image */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Description *</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Enter product description"
                    rows="4"
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Product Image *</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageInput
                    initialValue={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
            </InputContainer>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Base Price *</Label>
              <Controller
                name="basePrice"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter base price"
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.basePrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.basePrice.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Base Offer Price</Label>
              <Controller
                name="baseOfferPrice"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter base offer price"
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.baseOfferPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.baseOfferPrice.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="text-gray-700 dark:text-white">Return Policy *</Label>
              <Controller
                name="returnPolicy"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter Return Policy"
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.returnPolicy && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.returnPolicy.message}
                </p>
              )}
            </InputContainer>
          </div>

          {/* Variants Section */}
          <div className="mb-6">
            <Controller
              name="variants"
              control={control}
              render={({ field }) => (
                <VariantBuilder
                  variants={field.value}
                  onChange={field.onChange}
                  basePrice={basePrice}
                  baseOfferPrice={baseOfferPrice}
                />
              )}
            />
            {errors.variants && (
              <p className="text-red-500 text-sm mt-2">
                {errors.variants.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full dark:bg-blue-600 bg-orange-500 text-white px-6 py-3 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="mr-2" />
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductCreateForm;
