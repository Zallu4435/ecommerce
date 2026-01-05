import React, { useState, useRef } from 'react';
import ImageCropper from './admin/ImageCropper';

const ImageInput = ({ initialValue = '', onChange, buttonText, className }) => {
  const [imageUrl, setImageUrl] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  // Sync state with prop change (essential for async data loading)
  React.useEffect(() => {
    if (initialValue) {
      setImageUrl(initialValue);
    }
  }, [initialValue]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempImage(e.target.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedFile) => {
    // Convert cropped file to data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
      // Pass the cropped file to parent AFTER preview is set
      onChange(croppedFile);
    };
    reader.readAsDataURL(croppedFile);

    setShowCropper(false);
    setTempImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleUrlBlur = () => {
    setIsEditing(false);
    onChange(imageUrl);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // If custom button text is provided, render simple button
  if (buttonText) {
    return (
      <>
        <button
          type="button"
          onClick={handleImageClick}
          className={className || "px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"}
        >
          {buttonText}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        {showCropper && tempImage && (
          <ImageCropper
            image={tempImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}
      </>
    );
  }

  // Default rendering for product form
  return (
    <div className="space-y-2 w-[350px]">
      <div className="flex items-center space-x-4">
        {imageUrl ? (
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={imageUrl}
                alt="Selected"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md text-xs"
              onClick={handleEditClick}
            >
              Edit
            </button>
          </div>
        ) : (
          <div
            className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-gray-500 text-xs">Choose</p>
          </div>
        )}
        <p className="text-gray-500 cursor-pointer" onClick={handleImageClick}>
          {imageUrl ? 'Click to choose another' : 'Choose an image'}
        </p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      {isEditing && (
        <input
          type="text"
          value={imageUrl}
          onChange={handleUrlChange}
          onBlur={handleUrlBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          placeholder="Enter image URL"
        />
      )}
      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default ImageInput;
