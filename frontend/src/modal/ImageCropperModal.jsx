import React, { useState } from "react";
import Cropper from "react-easy-crop"; // Ensure you have the package installed
 const getCroppedImg = (imageSrc, pixelCrop, rotation = 0) => {
    const image = new Image();
    image.src = imageSrc;
  
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Set canvas size
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        // Apply rotation if needed
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotation * (Math.PI / 180));
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
  
        // Draw the image to canvas (cropped and rotated)
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        // Get data URL for the cropped image
        const base64Image = canvas.toDataURL("image/jpeg");
        resolve(base64Image);
      };
    });
  };
  

const ImageCropper = ({ imageToCrop, updateAvatar, closeModal }) => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    // Crop the image based on the area and pixels
    getCroppedImg(imageToCrop, croppedAreaPixels, rotation).then((croppedImage) => {
      setCroppedImage(croppedImage); // Set the cropped image to state
    });
  };

  const handleSave = () => {
    updateAvatar(croppedImage); // Save the cropped image to the parent
    closeModal(); // Close the modal after saving
  };

  return (
    <div className="p-4">
      <div className="relative w-full h-[60vh]">
        <Cropper
          image={imageToCrop}
          crop={crop}
          zoom={zoom}
          aspect={1} // Aspect ratio of the crop area (1:1 for square)
          rotation={rotation} // Apply rotation to the image if needed
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="mt-4 flex justify-between">
        <button 
          className="bg-red-600 text-white px-4 py-2 rounded" 
          onClick={closeModal}
        >
          Cancel
        </button>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded" 
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;