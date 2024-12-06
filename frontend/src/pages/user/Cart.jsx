import React, { useState } from 'react';
import ProductTableForCartlist from '../../components/user/ProductTable/ProductTableForCartlist';
import Header from '../../components/user/Header';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Mouse',
      price: 25.99,
      quantity: 2,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      price: 75.49,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'HD Monitor',
      price: 199.99,
      quantity: 1,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      name: 'External Hard Drive',
      price: 89.99,
      quantity: 3,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const calculateTax = (subtotal) => (subtotal * 0.08).toFixed(2); // Example: 8% tax
  const shippingCost = 15.0; // Flat shipping cost
  const calculateTotal = (subtotal) =>
    (parseFloat(subtotal) + parseFloat(calculateTax(subtotal)) + shippingCost).toFixed(2);

  const subtotal = calculateSubtotal();

  return (
    <>

      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 p-6">
          {/* Product List */}
          <div className="col-span-1 lg:col-span-8">
            <ProductTableForCartlist
              type="cart"
              data={cartItems}
              onRemove={handleRemove}
            />
          </div>

          {/* Cart Total */}
          <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl lg:mt-10 md:w-[350px] w-[300px] lg:col-span-3 mx-auto lg:mx-0 mt-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Cart Total</h2>
            <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
              <span className="font-medium">Tax (8%)</span>
              <span className="font-medium">${calculateTax(subtotal)}</span>
            </div>
            <div className="mb-4 flex justify-between text-gray-700 dark:text-gray-300">
              <span className="font-medium">Shipping</span>
              <span className="font-medium">${shippingCost.toFixed(2)}</span>
            </div>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
            <div className="mb-6 flex justify-between text-gray-800 dark:text-gray-100 text-lg font-bold">
              <span>Total</span>
              <span>${calculateTotal(subtotal)}</span>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all transform mt-5 hover:scale-105 dark:bg-blue-700 dark:hover:bg-blue-600">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Cart;
