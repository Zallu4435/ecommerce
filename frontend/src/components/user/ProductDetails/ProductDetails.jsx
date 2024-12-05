import React from 'react';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import RatingsAndReviews from './RatingsAndReviews';
import AddToCart from './AddToCart';
import AddToWishlist from './AddToWhishlist';
import AddReview from './AddReview';
import CompareButton from './CompareButton';
import RelatedProduct from './RelatedProducts';

const ProductDetails = () => {
  return (
    <>
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Image */}
        <div className="lg:col-span-2">
          <ProductImage />
        </div>

        {/* Add to Cart and Wishlist Section */}
        <div className="lg:col-span-1">
          <AddToCart />
          <AddToWishlist />
        </div>
      </div>

      {/* Product Information */}
      <ProductInfo />

      {/* Compare Button */}
      <CompareButton />

      {/* Add Review Section */}
      <AddReview />

      {/* Reviews Section */}
      <RatingsAndReviews />


    </div>

        <RelatedProduct />
    
    </>
  );
};

export default ProductDetails;
