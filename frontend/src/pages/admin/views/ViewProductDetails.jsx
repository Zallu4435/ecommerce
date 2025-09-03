import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../redux/apiSliceFeatures/productApiSlice";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";

const ViewProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetProductByIdQuery(id);

  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (data?.product?.image) {
      setMainImageIndex(0);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error.message || "Something went wrong!"}
      </div>
    );
  }

  const product = data?.product;

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: Product not found
      </div>
    );
  }

  const allImages = [product.image, ...(product.variantImages || [])];

  const productDetails = [
    { label: "Category", value: product.category },
    { label: "Brand", value: product.brand },
    { label: "Return Policy", value: product.returnPolicy },
    {
      label: "Price",
      value: (
        <>
          <span className="line-through text-gray-400 mr-2">
            ₹{product.originalPrice}
          </span>{" "}
          <span className="text-purple-500 font-semibold">
            ₹{product.offerPrice}
          </span>
        </>
      ),
    },
    { label: "Stock", value: `${product.stockQuantity} items available` },
    { label: "Available Sizes", value: product.sizeOption.join(", ") },
    { label: "Available Colors", value: product.colorOption.join(", ") },
  ];

  return (
    <div className="relative flex justify-center mt-10 bg-orange-50 items-center min-h-screen dark:bg-gray-900 p-4">
      <div className="container w-full bg-orange-50 shadow-md rounded-lg p-8 mx-10 dark:bg-gray-900 dark:text-white">
        {/* Back Button at Top Right */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 right-[60px] flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 ml-[-60px] gap-8 items-start">
          <div className="w-full lg:w-3/4 mx-auto">
            <div className="mb-4">
                <TransformWrapper
                  wheel={{ step: 0.2 }}
                  zoomIn={{ step: 0.5 }} 
                  zoomOut={{ step: 0.5 }} 
                  pan={{ disabled: false }}
                >
                  <TransformComponent>
                    <img
                      src={
                        allImages[mainImageIndex] ||
                        "https://via.placeholder.com/400"
                      }
                      alt={product.productName}
                      className="w-[300px] h-[400px] ml-[50px] object-cover rounded-lg shadow-lg"
                    />
                  </TransformComponent>
                </TransformWrapper>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[...Array(3)].map((_, index) => {
                const imageIndex =
                  (mainImageIndex + index + 1) % allImages.length;
                return (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                      imageIndex === mainImageIndex
                        ? "border-indigo-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setMainImageIndex(imageIndex)}
                  >
                    <img
                      src={allImages[imageIndex]}
                      alt={`Variant ${imageIndex + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="shadow-lg md:shadow-xl lg:shadow-2xl px-10 py-10 ml-[-60px] transition-all duration-300 dark:shadow-xl dark:shadow-gray-800 hover:dark:shadow-3xl">
            <h2 className="text-4xl font-bold mb-4 text-red-400 dark:text-red-400">
              {product.productName}
            </h2>
            <p className="text-gray-800 dark:text-gray-200 mb-6">
              {product.description}
            </p>

            <ul className="space-y-4">
              {productDetails.map((detail, index) => (
                <li
                  key={index}
                  className="text-gray-600 dark:text-gray-300 font-medium flex justify-between"
                >
                  <span>{detail.label}:</span>{" "}
                  <span className="text-gray-900 dark:text-gray-100">
                    {detail.value}
                  </span>
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
