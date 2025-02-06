import { useState, useEffect } from "react";
import { Camera, X, Upload, PencilIcon } from "lucide-react";
import ImageCropper from "../ImageCropperModal";
import ReactDOM from "react-dom";

const ProductImageVariantAddModal = ({
  isOpen,
  onClose,
  onImageUpload,
  // initialImages = [null, null, null],
  initialImages 
}) => {
  // const [imageFiles, setImageFiles] = useState(
  //   initialImages.map((file) =>
  //     file ? { url: file.url, isExisting: true } : null
  //   )
  // );

  const [imageFiles, setImageFiles] = useState([null, null, null]);

  useEffect(() => { 
    setImageFiles(initialImages?.map((file) => file ? { url: file.url, isExisting: true } : null))
  }, [isOpen, initialImages])

  const [previews, setPreviews] = useState(new Array(3).fill(null));
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [imageToCrop, setImageToCrop] = useState(null);

  useEffect(() => {
    const newPreviews = imageFiles.map((file) => {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      } else if (file && typeof file.url === "string") {
        return file.url;
      } else if (file && file.file instanceof File) {
        return URL.createObjectURL(file.file);
      }
      return null;
    });
    setPreviews(newPreviews);

    return () =>
      newPreviews.forEach((preview) => {
        if (preview && typeof preview !== "string") {
          URL.revokeObjectURL(preview);
        }
      });
  }, [imageFiles]);

  const updateAvatar = (croppedImage) => {
    const byteString = atob(croppedImage.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uintArray], { type: "image/jpeg" });
    const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });

    const updatedFiles = [...imageFiles];
    updatedFiles[currentImageIndex] = { file, isExisting: false };
    setImageFiles(updatedFiles);

    setModalOpen(false);
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedFiles = [...imageFiles];
      updatedFiles[index] = { file, isExisting: false };

      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);

      setImageFiles(updatedFiles);
    }
  };

  const handleSubmit = () => {
    const filesToUpload = imageFiles.map((fileObj) =>
      fileObj ? (fileObj.isExisting ? fileObj.url : fileObj.file) : null
    );
    onImageUpload(filesToUpload);
    onClose();
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...imageFiles];
    updatedFiles[index] = null;
    setImageFiles(updatedFiles);
  };

  const handleOpenCropper = (index) => {
    setCurrentImageIndex(index);
    setImageToCrop(previews[index]);
    setModalOpen(true);
  };

  const handleClose = () => {
    setImageFiles(
      initialImages.map((file) =>
        file ? { url: file.url, isExisting: true } : null
      )
    );
    setPreviews(new Array(3).fill(null));
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
                      <button
                        className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
                        title="Edit photo"
                        onClick={() => handleOpenCropper(index)}
                      >
                        <PencilIcon className="text-white" />
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        aria-label={`Upload image ${index + 1}`}
                        onChange={(e) => handleImageChange(index, e)}
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
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <Upload size={20} />
                {imageFiles.every((file) => file === null)
                  ? "Confirm No Images"
                  : "Upload Images"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
              <ImageCropper
                imageToCrop={imageToCrop}
                updateAvatar={updateAvatar}
                closeModal={() => setModalOpen(false)}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ProductImageVariantAddModal;
