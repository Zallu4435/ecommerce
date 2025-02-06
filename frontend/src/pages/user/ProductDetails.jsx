import { useState, useEffect } from "react";
import ProductImage from "../../components/user/ProductDetails/ProductImage";
import ProductInfo from "../../components/user/ProductDetails/ProductInfo";
import RatingsAndReviews from "../../components/user/ProductDetails/RatingsAndReviews";
import AddToCart from "../../components/user/ProductDetails/AddToCart";
import AddToWishlist from "../../components/user/ProductDetails/AddToWhishlist";
import AddReview from "../../components/user/ProductDetails/AddReview";
import RelatedProduct from "../../components/user/ProductDetails/RelatedProducts";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../redux/apiSliceFeatures/productApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const ProductDetails = () => {
  const [scrolled, setScrolled] = useState(false);
  const { id } = useParams();
  const {
    data: productDetails = {},
    error,
    isLoading,
  } = useGetProductByIdQuery(id);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const {
    image,
    variantImages,
    productName,
    originalPrice,
    description,
    _id,
    colorOption,
    sizeOption,
    stockQuantity,
    category,
    averageRating,
    totalReviews,
    offerPrice
  } = productDetails.product || {};

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error fetching product details.</div>;
  }

  if (!productDetails || Object.keys(productDetails).length === 0) {
    return <div>No product details available.</div>;
  }

  return (
    <div className="bg-gray-50 space-y-24 lg:my-16 lg:mb-28 my-10 mb-20 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="space-y-14">
        <div className="mt-6 max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.5)] rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2">
              <ProductImage image={image} variantImages={variantImages} />
            </div>

            <div className="lg:col-span-1 space-y-4">
              <AddToCart
                productId={_id}
                stockQuantity={stockQuantity}
                productImage={image}
                productName={productName}
                colorOption={colorOption}
                sizeOption={sizeOption}
                originalPrice={originalPrice}
                offerPrice={offerPrice}
              />
              <AddToWishlist productId={_id} />
            </div>
          </div>

          <ProductInfo
            className="mt-8"
            productName={productName}
            originalPrice={originalPrice}
            offerPrice={offerPrice}
            description={description}
            totalReviews={totalReviews}
            averageRating={averageRating}
          />

          <AddReview className="mt-8" productId={_id} />

          <RatingsAndReviews className="mt-8" productId={_id} />
        </div>
      </div>

      <RelatedProduct category={category} className="mt-8" />
    </div>
  );
};

export default ProductDetails;
