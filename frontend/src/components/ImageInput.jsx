import React, { useState, useRef } from 'react';

const ImageInput = ({ initialValue = '', onChange }) => {
  const [imageUrl, setImageUrl] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setImageUrl(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
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
    </div>
  );
};

export default ImageInput;

