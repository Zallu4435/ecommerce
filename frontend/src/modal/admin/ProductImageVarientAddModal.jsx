import React, { useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { validateImageVariants } from '../../validation/admin/ProductFormValidation'; // Import the validation function

const ProductImageVariantAddModal = ({ 
  isOpen, 
  onClose, 
  onImageUpload, 
  initialImages = [null, null, null] 
}) => {
  const [imageFiles, setImageFiles] = useState(initialImages);
  const [previews, setPreviews] = useState(new Array(3).fill(null));

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedFiles = [...imageFiles];
      updatedFiles[index] = file;
      setImageFiles(updatedFiles);

      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...previews];
        updatedPreviews[index] = reader.result;
        setPreviews(updatedPreviews);
      };
      reader.onerror = () => {
        alert("Failed to read the file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    try {
      // Filter out null values from imageFiles before validation
      const validImages = imageFiles.filter(file => file !== null);
      if (validImages.length === 0) {
        alert("Please select at least one image to upload.");
        return;
      }

      validateImageVariants(validImages);

      onImageUpload(validImages);
      handleClose();
    } catch (error) {
      alert("Error: " + error.message); 
    }
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...previews];
    
    updatedFiles[index] = null;
    updatedPreviews[index] = null;
    
    setImageFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const handleClose = () => {
    // Reset state on modal close
    setImageFiles(new Array(3).fill(null));
    setPreviews(new Array(3).fill(null));
    onClose();
  };

  if (!isOpen) return null;

  // Check if at least one image is selected
  const isSubmitDisabled = imageFiles.every(file => file === null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-11/12 max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 relative">
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-200">
          Upload Product Images
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((index) => (
            <div 
              key={index} 
              className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center relative"
            >
              {previews[index] ? (
                <>
                  <img 
                    src={previews[index]} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    aria-label={`Upload image ${index + 1}`}
                    onChange={(e) => {
                      handleImageChange(index, e);
                      e.target.value = ""; // Reset input value
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Camera size={40} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload Image {index + 1}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitDisabled} // Disable button if no images are selected
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            Upload Images
          </button>
        </div>
      </div>
    </div>
  );
};

ProductImageVariantAddModal.defaultProps = {
  initialImages: [null, null, null],
};

export default ProductImageVariantAddModal;
