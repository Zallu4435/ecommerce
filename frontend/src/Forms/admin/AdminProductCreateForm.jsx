import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productValidationSchema, validateImageVariants } from '../../validation/admin/ProductFormValidation';
import ProductImageVarientAddModal from '../../modal/admin/ProductImageVarientAddModal';
import { 
  Input, 
  InputContainer, 
  TextArea, 
  Label, 
  CheckboxContainer, 
  SizeOption 
} from '../../components/user/StyledComponents/StyledComponents';
import { toast } from 'react-toastify';
import { useAddEntityMutation } from '../../redux/apiSliceFeatures/crudApiSlice';
import { uploadImageToCloudinary } from '../../server';

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
    watch
  } = useForm({
    resolver: zodResolver(productValidationSchema),
    defaultValues: {
      sizes: [],
      variants: []
    }
  });
  

  const handleImageUpload = (uploadedFiles) => {
    try {
      // Validate uploaded files
      validateImageVariants(uploadedFiles);
  
      // Store original File objects for uploading
      setImageFiles(uploadedFiles);
  
      // Update images for display
      setImages(uploadedFiles.map((file) => file?.name || null));
  
      // Update the variants in form state (this ensures the form recognizes the selected images)
      setValue('variants', uploadedFiles); // Even if one image is selected, this will update correctly
      setIsModalOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };
  


  const onSubmit = async (data, e) => {
    e.preventDefault();
  
    console.log("Form data submitted:", data);
  
    try {
      // Convert the input file into a File object
      const fileInput = document.querySelector('input[name="imageUrl"]');
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        data.imageUrl = file; // Update the data object with the main image file
      }
  
      // Upload the main image to Cloudinary
      if (data.imageUrl) {
        console.log("Uploading main image...");
        const mainImageUrl = await uploadImageToCloudinary(data.imageUrl);
        data.imageUrl = mainImageUrl; // Replace the file with the Cloudinary URL
        console.log("Main image uploaded:", mainImageUrl);
      }
  
      // Upload variant images to Cloudinary
      if (imageFiles && imageFiles.length > 0) {
        const variantImageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            if (file) {
              const uploadedUrl = await uploadImageToCloudinary(file);
              return uploadedUrl;
            }
            return null; // If there's no file, return null
          })
        );
  
        // Update the variants field with the Cloudinary URLs
        data.variants = variantImageUrls.filter((url) => url !== null);
      }
  
      // Send the final data to the backend
      await addEntity({ entity: "products", data }).unwrap();
      console.log("Final data sent to backend:", data);
      navigate(-1); // Redirect to the previous page
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  

  const toggleSizeSelection = (size) => {
    const currentSizes = watch('sizes') || [];
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter(s => s !== size)
      : [...currentSizes, size];
    
    setValue('sizes', newSizes);
  };

  return (
    <div className="dark:bg-black min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[1300px] dark:bg-gray-900 bg-orange-50 p-6 md:p-8 rounded-md shadow-md">
        {/* Back Button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            <span>Back to Products</span>
          </button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6 dark:text-gray-400 text-gray-700">
          Add Product
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Product Name and Image URL */}
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
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    type="file" 
                    placeholder="Enter image URL" 
                  />
                )}
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.imageUrl.message}
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
                    className="w-full p-3 border rounded-md"
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home Appliances">Home Appliances</option>
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

          {/* Description and Sizes */}
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
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <SizeOption key={size}>
                    <Label className="dark:text-white">{size}</Label>
                    <input 
                      type="checkbox" 
                      id={`size-${size}`}
                      checked={watch('sizes')?.includes(size)}
                      onChange={() => toggleSizeSelection(size)}
                    />
                  </SizeOption>
                ))}
              </CheckboxContainer>
              {errors.sizes && (
                <p className="text-red-500 text-sm mt-3 ml-[-30px]">
                  {errors.sizes.message}
                </p>
              )}
            </div>
          </div>

          {/* Pricing and Stock Details */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <InputContainer>
              <Label className="dark:text-white">Brand Name *</Label>
              <Controller
                name="brandName"
                control={control}
                render={({ field }) => (
                  <Input 
                    {...field} 
                    type="text" 
                    placeholder="Enter Brand Name" 
                  />
                )}
              />
              {errors.brandName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.brandName.message}
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

          {/* Additional Details */}
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
              <Label className="dark:text-white">Warranty Time</Label>
              <Controller
                name="warrantyTime"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <Input 
                    {...field} 
                    type="number" 
                    placeholder="Enter Warranty Time"
                    onChange={(e) => onChange(Number(e.target.value))} 
                  />
                )}
              />
              {errors.warrantyTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.warrantyTime.message}
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

          {/* Image Variant Upload */}
          <div className="mb-4 flex flex-col md:flex-row justify-center items-center gap-6">
            <button 
              type="button" 
              className="dark:bg-red-600 bg-pink-500 text-white px-6 py-3 rounded-md hover:bg-pink-600 flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <Upload className="mr-2" />
              Add Image Variants
            </button>

            {/* Display Selected Images */}
            <div className="flex justify-center gap-4">
              {imageFiles.map((file, index) => (
                file && (
                  <div key={index} className="flex flex-col items-center">
                    <img 
                      src={file} 
                      alt={`Image ${index + 1}`} 
                      className="w-20 h-20 object-cover rounded-full shadow-md"
                    />
                    <p className="text-sm text-gray-500">{images[index]}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Submit Button */}
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

        {/* Image Upload Modal */}
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