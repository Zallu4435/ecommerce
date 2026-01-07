import { useParams, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../redux/apiSliceFeatures/productApiSlice";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import VariantDetailsDisplay from "../../../components/admin/VariantDetailsDisplay";
import ProductImageGallery from "../../../components/admin/ProductImageGallery";

const ViewProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetProductByIdQuery({ id, includeInactive: "true" });

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

  const productDetails = [
    { label: "Category", value: product.category },
    { label: "Brand", value: product.brand },
    { label: "Return Policy", value: product.returnPolicy },
    {
      label: "Price",
      value: (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {product.offerInfo && product.offerInfo.type !== 'none' ? (
              <>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{product.offerPrice.toLocaleString()}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>

                {/* Offer Badge */}
                <span className={`text-base px-3 py-1 rounded-full font-bold flex items-center gap-1 ${product.offerInfo.type === 'category'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                  {product.offerInfo.type === 'category' ? '🏷️' : '🎁'} {product.offerInfo.percentage}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{product.basePrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.offerInfo && product.offerInfo.type !== 'none' && (
            <div className="w-full text-sm text-gray-600 dark:text-gray-400 font-medium">
              Active Offer: <span className="font-bold">{product.offerInfo.name}</span>
              {product.offerInfo.endDate && ` (Ends: ${new Date(product.offerInfo.endDate).toLocaleDateString()})`}
            </div>
          )}
        </div>
      ),
    },
    { label: "Total Stock", value: `${product.totalStock || 0} items available` },
    { label: "Total Variants", value: `${product.variants?.length || 0} variants` },
    {
      label: "Available Sizes",
      value: (product.availableSizes && product.availableSizes.length > 0)
        ? product.availableSizes.map(s => s.toUpperCase()).join(", ")
        : "N/A"
    },
    {
      label: "Available Colors",
      value: (product.availableColors && product.availableColors.length > 0)
        ? product.availableColors.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
        : "N/A"
    },
    {
      label: "Available Genders",
      value: (product.availableGenders && product.availableGenders.length > 0)
        ? product.availableGenders.map(g => g === "Male" ? "Boy" : g === "Female" ? "Girl" : g).join(", ")
        : "N/A"
    },
  ];

  return (
    <div className="relative flex justify-center mt-10 bg-orange-50 items-center min-h-screen dark:bg-gray-900 p-4">
      <div className="container w-full bg-orange-50 shadow-md rounded-lg p-8 mx-10 dark:bg-gray-900 dark:text-white">
        {/* Back Button at Top Right */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 right-[60px] flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8">
          {/* Image Gallery Section */}
          <ProductImageGallery product={product} />

          {/* Product Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-3xl font-bold mb-4 text-orange-600 dark:text-red-500">
              {product.productName}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                Product Information
              </h3>
              <ul className="space-y-3">
                {productDetails.map((detail, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[140px]">
                      {detail.label}:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 text-right flex-1 font-semibold">
                      {detail.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Variant Details Section - Using Component */}
        <VariantDetailsDisplay
          variants={product.variants}
          totalStock={product.totalStock}
          availableColors={product.availableColors}
          availableSizes={product.availableSizes}
        />
      </div>
    </div>
  );
};

export default ViewProductDetails;
