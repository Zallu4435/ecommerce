export const server = `${import.meta.env.VITE_SERVER_URL}/api`;

export const uploadImageToCloudinary = async (file, folder = (import.meta.env.VITE_CLOUDINARY_FOLDER || "ecommerce")) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "first_time_using_cloudinary");
  formData.append("folder", folder);

  try {
    const response = await fetch(
      import.meta.env.VITE_CLOUDINARY_URL,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      secureUrl: data.secure_url,
      publicId: data.public_id,
      folder: data.folder,
      width: data.width,
      height: data.height,
      format: data.format,
      bytes: data.bytes,
      createdAt: data.created_at,
      assetId: data.asset_id,
      version: data.version,
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};
