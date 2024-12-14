import { useParams, useNavigate } from 'react-router-dom'; 
import { useGetProductByIdQuery } from '../../../redux/apiSliceFeatures/productApiSlice'; 

const ViewProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // Hook for navigation

  // Destructure API response
  const { data, error, isLoading } = useGetProductByIdQuery(id);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error.message || 'Something went wrong!'}
      </div>
    );
  }

  // Get the product data from the response
  const product = data?.product;

  // Define an array of product details to map over
  const productDetails = [
    { label: 'Category', value: product.category },
    { label: 'Brand', value: product.brand },
    { label: 'Warranty', value: product.warranty },
    { label: 'Return Policy', value: product.returnPolicy },
    { label: 'Price', value: (
        <>
          <span className="line-through text-red-500">${product.originalPrice}</span>{' '}
          <span className="text-green-500">
            ${ (product.originalPrice * (1 - product.offerPercentage / 100)).toFixed(2) }
          </span>
        </>
    )},
    { label: 'Stock', value: `${product.stock} items available` },
    { label: 'Available Sizes', value: product.sizeOption.join(', ') },
    { label: 'Available Colors', value: product.colorOption.join(', ') },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="container mx-auto bg-white shadow-md rounded-lg p-8 dark:bg-gray-900 dark:text-white">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
        >
          Back
        </button>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Product Image */}
          <div className="w-full lg:w-3/4 mx-auto">
            <img
              src={ 'https://via.placeholder.com/400' || product.images[0]} // Use the first image in the images array or a placeholder
              alt={product.productName}
              className="w-full h-auto mx-auto sm:h-[450px] sm:w-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <h2 className="text-4xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">{product.productName}</h2>
            <p className="text-gray-800 dark:text-gray-200 mb-6">{product.description}</p>

            {/* Map over the productDetails array to display each item dynamically */}
            <ul className="space-y-4">
              {productDetails.map((detail, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-300 font-medium flex justify-between">
                  <span>{detail.label}:</span> <span className="text-gray-900 dark:text-gray-100">{detail.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductDetails;
