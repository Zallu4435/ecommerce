export const server = "http://localhost:5000/api"


export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'first_time_using_cloudinary'); // Upload preset configured in your Cloudinary account

  try {
    console.log("Uploading file to Cloudinary:", file);

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dbwdttzv4/image/upload',
      {
        method: 'POST',
        body: formData
      }
    );

    console.log(response, "response")

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Cloudinary upload response:", data);
    return data.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};
