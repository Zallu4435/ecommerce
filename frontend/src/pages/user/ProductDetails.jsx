import { useState, useEffect } from "react";
import ProductImage from "../../components/user/ProductDetails/ProductImage";
import RatingsAndReviews from "../../components/user/ProductDetails/RatingsAndReviews";
import AddToCart from "../../components/user/ProductDetails/AddToCart";
import AddToWishlist from "../../components/user/ProductDetails/AddToWhishlist";
import AddReview from "../../components/user/ProductDetails/AddReview";
import RelatedProduct from "../../components/user/ProductDetails/RelatedProducts";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Star, Truck, Shield, Award, Package, ChevronRight, FileText, MessageSquare, Edit3, Info } from "lucide-react";

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("details");
  const { id } = useParams();

  const {
    data: productDetails = {},
    error,
    isLoading,
  } = useGetProductByIdQuery(id);

  const {
    image,
    productName,
    basePrice,
    baseOfferPrice,
    description,
    _id,
    category,
    brand,
    returnPolicy,
    averageRating,
    totalReviews,
    variants = [],
    totalStock,
    availableColors = [],
    availableSizes = [],
  } = productDetails.product || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !productDetails || Object.keys(productDetails).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {error ? "Error loading product" : "Product not found"}
          </p>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
              }`}
          />
        ))}
      </div>
    );
  };

  const discountPercentage = basePrice > baseOfferPrice
    ? Math.round(((basePrice - baseOfferPrice) / basePrice) * 100)
    : 0;

  const tabs = [
    { id: "details", label: "Product Details", icon: Info },
    { id: "specifications", label: "Specifications", icon: FileText },
    { id: "reviews", label: `Reviews (${totalReviews || 0})`, icon: MessageSquare },
    { id: "write-review", label: "Write Review", icon: Edit3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <a href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Home</a>
            <ChevronRight className="w-4 h-4" />
            <a href="/shop" className="hover:text-gray-900 dark:hover:text-white transition-colors">Shop</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium truncate">{category}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Section: Images + Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Product Info + Images */}
            <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 space-y-6">
              {/* Product Title & Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full uppercase">
                    {brand || category}
                  </span>
                  {totalStock > 0 && totalStock < 10 && (
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold rounded-full">
                      Only {totalStock} left!
                    </span>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {productName}
                </h1>

                {/* Category Offer Badge */}
                {/* Offer Badge (Category or Product) */}
                {productDetails.product?.offerInfo?.type === 'category' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏷️</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-purple-900 dark:text-purple-100">
                          {productDetails.product.offerInfo.name}
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          <span className="font-bold">{productDetails.product.offerInfo.percentage}% OFF</span>
                          {productDetails.product.offerInfo.endDate && (
                            <span className="ml-2">
                              • Ends {new Date(productDetails.product.offerInfo.endDate).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {productDetails.product?.offerInfo?.type === 'product' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎁</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-green-900 dark:text-green-100">
                          {productDetails.product.offerInfo.name}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          <span className="font-bold">{productDetails.product.offerInfo.percentage}% OFF</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  {renderStars(averageRating || 0)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {averageRating?.toFixed(1) || "0.0"} ({totalReviews || 0} reviews)
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₹{baseOfferPrice?.toLocaleString()}
                  </span>
                  {discountPercentage > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{basePrice?.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold rounded">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Product Images */}
              <ProductImage
                image={image}
                variantImages={variants.map(v => v.image).filter(Boolean)}
              />
            </div>

            {/* Right: Order Summary Only */}
            <div className="p-6 lg:p-8 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <AddToCart
                productId={_id}
                productImage={image}
                productName={productName}
                basePrice={basePrice ?? 0}
                baseOfferPrice={baseOfferPrice ?? basePrice ?? 0}
                variants={variants}
                availableColors={availableColors}
                availableSizes={availableSizes}
                availableGenders={productDetails.product?.availableGenders}
                totalStock={totalStock ?? 0}
                offerInfo={productDetails.product?.offerInfo} // Pass offerInfo
              />
              <AddToWishlist productId={_id} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabbed Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                      ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-white dark:bg-gray-800"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {/* Product Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    About This Product
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {description || "No description available."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Free Delivery</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">On orders above ₹500</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Easy Returns</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{returnPolicy || "7 Days Return Policy"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">100% Authentic</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Genuine products only</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                      <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Secure Packaging</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Safe & protected delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Brand</span>
                    <span className="text-gray-900 dark:text-white font-medium">{brand || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Category</span>
                    <span className="text-gray-900 dark:text-white font-medium">{category || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Available Sizes</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {availableSizes?.length > 0 ? availableSizes.join(", ") : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Available Colors</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {availableColors?.length > 0 ? availableColors.join(", ") : "N/A"}
                    </span>
                  </div>
                  {/* Added Gender Spec */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Gender</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {productDetails.product?.availableGenders?.length > 0
                        ? productDetails.product.availableGenders.map(g => g === "Male" ? "Boy" : g === "Female" ? "Girl" : g).join(", ")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Stock Status</span>
                    <span className={`font-semibold ${totalStock > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {totalStock > 0 ? `${totalStock} in stock` : "Out of stock"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Return Policy</span>
                    <span className="text-gray-900 dark:text-white font-medium">{returnPolicy || "N/A"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <RatingsAndReviews
                productId={_id}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            )}

            {/* Write Review Tab */}
            {activeTab === "write-review" && (
              <AddReview productId={_id} />
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <RelatedProduct category={category} />
      </div>
    </div>
  );
};

export default ProductDetails;
