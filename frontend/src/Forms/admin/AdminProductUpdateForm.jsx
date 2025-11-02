import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { productValidationSchema } from "../../validation/admin/ProductFormValidation";
import ProductImageVariantAddModal from "../../modal/admin/ProductImageVarientAddModal";
import {
  Input,
  InputContainer,
  TextArea,
  Label,
  CheckboxContainer,
  SizeOption,
} from "../../components/user/StyledComponents/StyledComponents";
import { toast } from "react-toastify";
import { useUpdateEntityMutation } from "../../redux/apiSliceFeatures/crudApiSlice";
import { uploadImageToCloudinary } from "../../server";
import { useGetProductByIdQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import ImageInput from "../../components/ImageInput";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminProductUpdateForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateEntity] = useUpdateEntityMutation();

  const { data, error, isLoading } = useGetProductByIdQuery(id);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(productValidationSchema),
    defaultValues: {
      sizeOption: [],
      variantImages: [],
      colorOption: [],
    },
  });


  useEffect(() => {
    if (data?.product) {
      const { product } = data;

      Object.keys(product).forEach((key) => {
        setValue(key, product[key]);
      });

      if (product.variantImages && product.variantImages.length > 0) {
        setImageFiles(
          product.variantImages.map((url) => ({ url, isExisting: true }))
        );
        setValue("variantImages", product.variantImages); 
      }
    }
  }, [data, setValue]);

  const handleImageUpload = (uploadedFiles) => {
    try {
      if (!Array.isArray(uploadedFiles)) {
        throw new Error("Uploaded files must be an array.");
      }

      const newImageFiles = uploadedFiles.map((file) => {
        if (file) {
          if (typeof file === "string") {
            return { url: file, isExisting: true };
          } else if (file instanceof File) {
            return { file, isExisting: false };
          } else {
            throw new Error("Invalid file type.");
          }
        }
        return null;
      });

      setImageFiles(newImageFiles);
      setValue("variantImages", newImageFiles);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to upload images");
    }
  };

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.image instanceof File) {
        const mainImage = await uploadImageToCloudinary(formData.image);
        formData.image = mainImage.secureUrl;
        formData.imagePublicId = mainImage.publicId;
      }

      if (imageFiles.length > 0) {
        const variantImageUrls = await Promise.all(
          imageFiles.map(async (fileObj) => {
            if (fileObj && !fileObj.isExisting) {
              const uploaded = await uploadImageToCloudinary(fileObj.file);
              return uploaded.secureUrl;
            }
            return fileObj?.url || null;
          })
        );
        formData.variantImages = variantImageUrls.filter((url) => url !== null);
      }

      await updateEntity({ entity: "products", data: formData, id }).unwrap();
      toast.success("Product updated successfully");
      navigate(-1);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSizeSelection = (size) => {
    const currentSizes = watch("sizeOption") || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setValue("sizeOption", newSizes);
  };

  const toggleColorSelection = (color) => {
    const currentColors = watch("colorOption") || [];
    const newColor = currentColors.includes(color)
      ? currentColors.filter((s) => s !== color)
      : [...currentColors, color];
    setValue("colorOption", newColor);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="dark:bg-black min-h-screen flex mt-10 items-center justify-center">
      <div className="w-full max-w-[1300px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
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
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <InputContainer>
              <Label className="dark:text-white">Product Name *</Label>
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
              <Label className="dark:text-white">Image URL</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageInput
                    initialValue={data?.product?.image || field.value}
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

            <InputContainer>
              <Label className="dark:text-white">Category *</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-3 border rounded-md dark:text-white dark:bg-gray-800"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Men</option>
                    <option value="Clothing">Women</option>
                    <option value="Books">Child</option>
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

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <InputContainer className="md:flex-[7]">
              <Label className="dark:text-white">Description *</Label>
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

            <div className="md:flex-[3]">
              <Label className="dark:text-white">Available Sizes</Label>
              <CheckboxContainer>
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <SizeOption key={size}>
                    <Label className="dark:text-white">{size}</Label>
                    <input
                      type="checkbox"
                      id={`size-${size}`}
                      checked={watch("sizeOption")?.includes(size)}
                      onChange={() => toggleSizeSelection(size)}
                    />
                  </SizeOption>
                ))}
              </CheckboxContainer>
              {errors.sizeOption && (
                <p className="text-red-500 text-sm mt-3 ml-[-30px]">
                  {errors.sizeOption.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <InputContainer>
              <Label className="dark:text-white">Brand Name *</Label>
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
              <Label className="dark:text-white">Original Price *</Label>
              <Controller
                name="originalPrice"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter original Price"
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.originalPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.originalPrice.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Offer Price *</Label>
              <Controller
                name="offerPrice"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter Offer Price"
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.offerPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.offerPrice.message}
                </p>
              )}
            </InputContainer>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <InputContainer>
              <Label className="dark:text-white">Stock Quantity *</Label>
              <Controller
                name="stockQuantity"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter Stock Quantity"
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="dark:text-white dark:bg-gray-800"
                  />
                )}
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stockQuantity.message}
                </p>
              )}
            </InputContainer>

            <InputContainer>
              <Label className="dark:text-white">Return Policy *</Label>
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
            <div className="md:flex-[3] ml-10">
              <Label className="dark:text-white">Available Colors</Label>
              <CheckboxContainer>
                {["white", "black", "red", "green", "yellow", "blue"].map(
                  (color) => (
                    <div key={color} className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        id={`color-${color}`}
                        checked={watch("colorOption")?.includes(color)}
                        onChange={() => toggleColorSelection(color)}
                        className="h-5 w-5"
                      />
                      <Label className="dark:text-white">{color}</Label>
                    </div>
                  )
                )}
              </CheckboxContainer>
              {errors.colorOption && (
                <p className="text-red-500 text-sm mt-3 ml-[-30px]">
                  {errors.colorOption.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4 flex flex-col md:flex-row justify-center items-center gap-6">
            <button
              type="button"
              className="dark:bg-red-600 bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600 flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <Upload className="mr-2" />
              Add Image Variants
            </button>

            <div className="flex justify-center gap-4">
              {imageFiles.map(
                (fileObj, index) =>
                  fileObj && (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={
                          fileObj.isExisting
                            ? fileObj.url
                            : fileObj.file instanceof File
                            ? URL.createObjectURL(fileObj.file)
                            : ""
                        }
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-full shadow-md"
                      />
                      <p className="text-sm text-gray-500">
                        {fileObj.isExisting
                          ? "Existing Image"
                          : fileObj.file instanceof File
                          ? fileObj.file.name
                          : "Invalid File"}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>

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

        <ProductImageVariantAddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageUpload={handleImageUpload}
          initialImages={imageFiles}
        />
      </div>
    </div>
  );
};

export default AdminProductUpdateForm;
