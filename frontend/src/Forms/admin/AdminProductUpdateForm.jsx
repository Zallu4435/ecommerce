import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { productValidationSchema } from "../../validation/admin/ProductFormValidation";
import VariantBuilder from "../../components/admin/VariantBuilder";
import {
  Input,
  InputContainer,
  TextArea,
  Label,
} from "../../components/user/StyledComponents/StyledComponents";
import { toast } from "react-toastify";
import { useUpdateEntityMutation } from "../../redux/apiSliceFeatures/crudApiSlice";
import { uploadImageToCloudinary } from "../../server";
import { useGetProductByIdQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import ImageInput from "../../components/ImageInput";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetCategoriesQuery } from "../../redux/apiSliceFeatures/categoryApiSlice";
import axios from "axios";

const AdminProductUpdateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingVariants, setExistingVariants] = useState([]);
  const [updateEntity] = useUpdateEntityMutation();

  const { data, error, isLoading } = useGetProductByIdQuery({ id, includeInactive: "true" });
  const { data: categoriesData } = useGetCategoriesQuery();
  const categoryOptions = categoriesData?.categories || [];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(productValidationSchema),
    defaultValues: {
      variants: [],
    },
  });

  // Load product data and variants
  useEffect(() => {
    if (data?.product) {
      const { product } = data;

      // Set form values
      setValue("productName", product.productName);
      setValue("brand", product.brand);
      setValue("category", product.category);
      setValue("description", product.description);
      setValue("basePrice", product.basePrice);
      setValue("baseOfferPrice", product.baseOfferPrice);
      setValue("returnPolicy", product.returnPolicy);
      setValue("image", product.image);

      // Load variants
      if (product.variants && product.variants.length > 0) {
        setExistingVariants(product.variants);
        setValue("variants", product.variants);
      }
    }
  }, [data, setValue]);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload main product image if changed (File object or Base64 string)
      if (formData.image && (typeof formData.image !== 'string' || formData.image.startsWith('data:image'))) {
        const mainImage = await uploadImageToCloudinary(formData.image);
        formData.image = mainImage.secureUrl;
        formData.imagePublicId = mainImage.publicId;
      }

      // Prepare product update (without variants)
      const productUpdate = {
        productName: formData.productName,
        brand: formData.brand,
        category: formData.category,
        description: formData.description,
        basePrice: formData.basePrice,
        baseOfferPrice: formData.baseOfferPrice,
        returnPolicy: formData.returnPolicy,
        image: formData.image,
        imagePublicId: formData.imagePublicId,
      };

      // Update product
      await updateEntity({ entity: "products", data: productUpdate, id }).unwrap();

      // Handle variants separately
      // Handle variants updates intelligently (Diffing)
      if (formData.variants) {
        // 1. Process images for all variants provided in the form
        const processedVariants = await Promise.all(
          formData.variants.map(async (variant) => {
            // Upload if it's NOT a string OR if it's a Base64 string (starts with data:image)
            if (variant.image && (typeof variant.image !== 'string' || variant.image.startsWith('data:image'))) {
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

        // 2. Identify variants to DELETE (Existed before but not in current form)
        const currentVariantIds = processedVariants.map(v => v._id).filter(Boolean);
        const variantsToDelete = existingVariants.filter(v => !currentVariantIds.includes(v._id));

        for (const variant of variantsToDelete) {
          try {
            await axios.delete(`${import.meta.env.VITE_SERVER}/api/variants/delete/${variant._id}`);
          } catch (err) {
            console.error(`Error deleting variant ${variant._id}:`, err);
          }
        }

        // 3. Separate UPDATES and CREATES
        const variantsToUpdate = processedVariants.filter(v => v._id);
        const variantsToCreate = processedVariants.filter(v => !v._id);

        // 4. Perform Updates
        for (const variant of variantsToUpdate) {
          try {
            await axios.put(`${import.meta.env.VITE_SERVER}/api/variants/update/${variant._id}`, variant);
          } catch (err) {
            console.error(`Error updating variant ${variant._id}:`, err);
            toast.error(`Failed to update variant: ${variant.sku || variant.color}`);
          }
        }

        // 5. Perform Bulk Create for new ones
        if (variantsToCreate.length > 0) {
          try {
            await axios.post(`${import.meta.env.VITE_SERVER}/api/variants/bulk-create`, {
              productId: id,
              variants: variantsToCreate,
            });
          } catch (err) {
            console.error("Error creating new variants:", err);
            toast.error("Some new variants failed to create");
          }
        }
      }

      toast.success("Product updated successfully!");
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  return (
    <div className="dark:bg-black min-h-screen flex mt-10 items-center justify-center">
      <div className="w-full max-w-[1300px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 shadow-md">
        {/* Back Button */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">
            Update Product
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
              {isSubmitting ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductUpdateForm;
