import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { productValidationSchema } from "../../validation/admin/ProductFormValidation";
import ProductImageVarientAddModal from "../../modal/admin/ProductImageVarientAddModal";
import {
  Input,
  InputContainer,
  TextArea,
  Label,
  CheckboxContainer,
  SizeOption,
} from "../../components/user/StyledComponents/StyledComponents";
import { toast } from "react-toastify";
import { useAddEntityMutation } from "../../redux/apiSliceFeatures/crudApiSlice";
import { uploadImageToCloudinary } from "../../server";
import ImageInput from "../../components/ImageInput";

const AdminProductUpdateForm = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null]);
  const [imageFiles, setImageFiles] = useState([null, null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      sizeOption: [],
      variantImages: [],
      colorOption: [],
    },
  });
  const handleImageUpload = (uploadedFiles) => {
    try {
      setImageFiles(uploadedFiles);
      setImages(uploadedFiles.map((file) => file?.name || null));
      setValue("variantImages", uploadedFiles);
      setIsModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();

    try {
      if (data.image) {
        const mainImage = await uploadImageToCloudinary(data.image);
        data.image = mainImage.secureUrl;
        data.imagePublicId = mainImage.publicId;
      }

      if (imageFiles && imageFiles.length > 0) {
        const variantImageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            if (file) {
              const uploaded = await uploadImageToCloudinary(file);
              return uploaded.secureUrl;
            }
            return null;
          })
        );

        data.variantImages = variantImageUrls.filter((url) => url !== null);
      }

      await addEntity({ entity: "products", data }).unwrap();
      navigate(-1);
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err?.data?.message || "An error occurred");
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

  return (
    <div className="dark:bg-black min-h-screen flex mt-10 items-center justify-center">
      <pre>{JSON.stringify(errors.message)}</pre>
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
              <Label className="text-gray-700 dark:text-white">Image URL</Label>
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
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Child">Child</option>
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

            <div className="md:flex-[3]">
              <Label className="text-gray-700 dark:text-white">Available Sizes</Label>
              <CheckboxContainer>
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <SizeOption key={size}>
                    <Label className="text-gray-700 dark:text-white">{size}</Label>
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
              <Label className="text-gray-700 dark:text-white">Brand Name *</Label>
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
              <Label className="text-gray-700 dark:text-white">Original Price *</Label>
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
              <Label className="text-gray-700 dark:text-white">Offer Price *</Label>
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
              <Label className="text-gray-700 dark:text-white">Stock Quantity *</Label>
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
            <div className="md:flex-[3] ml-10">
              <Label className="text-gray-700 dark:text-white">Available Sizes</Label>
              <CheckboxContainer>
                {["white", "black", "red", "green", "yellow", "blue"].map(
                  (color) => (
                    <div
                      key={color}
                      className="flex gap-2 items-center"
                    >
                      <input
                        type="checkbox"
                        id={`color-${color}`}
                        checked={watch("colorOption")?.includes(color)}
                        onChange={() => toggleColorSelection(color)}
                        className="h-5 w-5"
                      />
                      <Label className="text-gray-700 dark:text-white">{color}</Label>
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
                (file, index) =>
                  file && (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-full shadow-md"
                      />
                      <p className="text-sm text-gray-500">{file.name}</p>
                    </div>
                  )
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={imageFiles.length === 0}
              className="w-full dark:bg-blue-600 bg-orange-500 text-white px-6 py-3 rounded-md dark:hover:bg-blue-700 hover:bg-orange-600 flex items-center justify-center"
            >
              <Upload className="mr-2" />
              Add Product
            </button>
          </div>
        </form>

        <ProductImageVarientAddModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onImageUpload={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default AdminProductUpdateForm;
