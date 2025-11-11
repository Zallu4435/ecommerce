import React, { useState, useEffect, useCallback } from 'react';
import usePreventBodyScroll from '../../../hooks/usePreventBodyScroll';

const ProductModal = ({ showModal, setShowModal, products, handleProductSelect, selectedProducts, loadMoreProducts, hasMoreProducts, isProductFetching }) => {
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productPage, setProductPage] = useState(1);
  
  // Prevent body scroll when modal is open
  usePreventBodyScroll(showModal);

  const loadMore = useCallback(() => {
    if (!isProductFetching && hasMoreProducts) {
      setProductPage((prevPage) => prevPage + 1);
      loadMoreProducts(productPage + 1);
    }
  }, [isProductFetching, hasMoreProducts, loadMoreProducts, productPage]);

  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        loadMore();
      }
    };

    const modalContent = document.getElementById('product-modal-content');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (modalContent) {
        modalContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadMore]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-2/4 max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 flex justify-between items-center rounded-t-lg">
          <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-100">
            Select Products
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-8 py-2 bg-red-400 font-bold text-white rounded-md hover:bg-red-500 transition duration-200"
            >
              Close
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-8 py-2 bg-blue-500 font-bold text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
              Confirm
            </button>
          </div>
        </div>

        <div className="sticky top-16 bg-white dark:bg-gray-800 p-4 rounded-t-lg">
          <input
            type="text"
            placeholder="Search products..."
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div id="product-modal-content" className="p-4 overflow-y-auto flex-grow" style={{ maxHeight: 'calc(80vh - 180px)' }}>
          <div className="space-y-2">
            {products
              ?.filter((product) =>
                product.productName
                  .toLowerCase()
                  .includes(productSearchQuery.toLowerCase())
              )
              .map((product) => (
                <div
                  key={product.id}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center rounded-md"
                  onClick={() =>
                    handleProductSelect(product.id, product.productName)
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.some(
                      (p) => p.productId === product.id
                    )}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  <span className="text-gray-800 dark:text-gray-100">
                    {product.productName}
                  </span>
                </div>
              ))}
          </div>
          {isProductFetching && (
            <div className="text-center mt-4">
              <p className="text-gray-600 dark:text-gray-400">Loading more products...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

