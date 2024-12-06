import React, { useState, useEffect } from 'react';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';
import RatingsAndReviews from './RatingsAndReviews';
import AddToCart from './AddToCart';
import AddToWishlist from './AddToWhishlist';
import AddReview from './AddReview';
import CompareButton from './CompareButton';
import RelatedProduct from './RelatedProducts';
import Header from '../Header';
import Navbar from '../Navbar';
import Footer from '../Footer';

const ProductDetails = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 100;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className='bg-gray-50 space-y-24 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
    <div className='space-y-14'>
      <div>
        <Header />
        <Navbar scrolled={scrolled} />
      </div>

        <div className="mt-6 max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] dark:shadow-[0_0_20px_10px_rgba(0,0,0,0.5)] rounded-lg">
          {/* Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Product Image */}
            <div className="lg:col-span-2">
              <ProductImage />
            </div>

            {/* Add to Cart and Wishlist Section */}
            <div className="lg:col-span-1 space-y-4">
              <AddToCart />
              <AddToWishlist />
            </div>
          </div>

          {/* Product Information */}
          <ProductInfo className="mt-8" />

          {/* Compare Button */}
          <CompareButton className="mt-8" />

          {/* Add Review Section */}
          <AddReview className="mt-8" />

          {/* Reviews Section */}
          <RatingsAndReviews className="mt-8" />
        </div>
      </div>

      <RelatedProduct className="mt-8" />

      <Footer />
    </div>
  );
};

export default ProductDetails;
