import { useState } from 'react';

const Compare = () => {
  const [compareItems, setCompareItems] = useState([
    {
      id: 1,
      name: "Wireless Mouse",
      price: 25.99,
      rating: 4.5,
      image: "https://via.placeholder.com/500x500",
      description: "A wireless mouse for precise control and comfort.",
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      price: 75.49,
      rating: 4.7,
      image: "https://via.placeholder.com/500x500",
      description: "A mechanical keyboard with high-quality switches for gamers.",
    },
    {
      id: 3,
      name: "HD Monitor",
      price: 199.99,
      rating: 4.2,
      image: "https://via.placeholder.com/500x500",
      description: "A high-definition monitor with vibrant colors and wide viewing angles.",
    },
  ]);

  const products = [
    {
      id: 1,
      name: "Wireless Mouse",
      price: 25.99,
      rating: 4.5,
      image: "https://via.placeholder.com/500x500",
      description: "A wireless mouse for precise control and comfort.",
    },
    {
      id: 2,
      name: "Mechanical Keyboard",
      price: 75.49,
      rating: 4.7,
      image: "https://via.placeholder.com/500x500",
      description: "A mechanical keyboard with high-quality switches for gamers.",
    },
    {
      id: 3,
      name: "HD Monitor",
      price: 199.99,
      rating: 4.2,
      image: "https://via.placeholder.com/500x500",
      description: "A high-definition monitor with vibrant colors and wide viewing angles.",
    },
  ];

  const handleAddProduct = (newProduct) => {
    if (compareItems.length >= 3) {
      const userConfirmed = window.confirm(
        "The compare list is full. Do you want to add this item and remove the first one?"
      );
      if (userConfirmed) {
        setCompareItems((prevItems) => [...prevItems.slice(1), newProduct]);
      }
    } else {
      setCompareItems((prevItems) => [...prevItems, newProduct]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-center mb-8">Product Comparison</h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`border p-4 rounded-lg shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 ${
              index === 2 ? 'lg:col-span-1 lg:mx-auto md:ml-[160px] md:w-[400px] lg:w-full' : ''
            }`}
          >           
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{product.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">${product.price.toFixed(2)}</span>
              <div className="text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleAddProduct(product)}
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              >
                Remove from Compare
              </button>

              <button
                onClick={() => handleAddProduct(product)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-10 overflow-x-auto hidden lg:block md:block">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Comparison Table</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm sm:text-base">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-gray-800 dark:text-gray-100">Feature</th>
              {compareItems.map((product) => (
                <th key={product.id} className="py-3 px-4 text-center text-gray-800 dark:text-gray-100">{product.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">Price</td>
              {compareItems.map((product) => (
                <td key={product.id} className="py-3 px-4 text-center text-gray-800 dark:text-gray-100">${product.price.toFixed(2)}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">Rating</td>
              {compareItems.map((product) => (
                <td key={product.id} className="py-3 px-4 text-center text-gray-800 dark:text-gray-100">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={i < product.rating ? "text-yellow-500" : "text-gray-300"}
                    >
                      ★
                    </span>
                  ))}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-100">Description</td>
              {compareItems.map((product) => (
                <td key={product.id} className="py-3 px-4 text-center text-gray-800 dark:text-gray-100">{product.description}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
