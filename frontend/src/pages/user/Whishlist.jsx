import React from 'react';
import ProductTable from '../../components/user/ProductTable/ProductTable';
import Header from '../../components/user/Header';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';

const Wishlist = () => {
  const products = [
    {
      id: 1,
      name: 'Product 1',
      price: 99.99,
      image: 'https://via.placeholder.com/400',
      rating: 4.5,
      stock: 'In stock',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 129.99,
      image: 'https://via.placeholder.com/400',
      rating: 4.2,
      stock: 'In stock',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 89.99,
      image: 'https://via.placeholder.com/400',
      rating: 4.7,
      stock: 'In stock',
    },
  ];

  const handleRemove = (id) => {
    alert(`Removed product with id: ${id}`);
  };

  return (
    <>

      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen p-10">
        <div className="max-w-7xl mx-auto">
          <ProductTable type="wishlist" data={products} onRemove={handleRemove} />
        </div>
      </div>

    </>
  );
};

export default Wishlist;
