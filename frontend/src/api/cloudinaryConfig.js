import { Cloudinary } from 'cloudinary-core';

const cloudinaryInstance = new Cloudinary({
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloudinary_cloud_name',
    secure: true
  });
  
  export default cloudinaryInstance;