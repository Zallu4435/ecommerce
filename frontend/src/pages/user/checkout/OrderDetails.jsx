import React from 'react'

const OrderDetails = () => {

    const calculateTotal = () =>
        products.reduce((total, product) => total + product.price * product.quantity, 0);

    const products = [
        { id: 1, name: "Product 1", image: "https://via.placeholder.com/100", price: 20.0, quantity: 1 },
        { id: 2, name: "Product 2", image: "https://via.placeholder.com/100", price: 30.0, quantity: 2 },
      ];
    

  return (
    <>
        {/* Order Details */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center border-b border-gray-200 py-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-grow ml-4">
                <span className="font-medium">{product.name}</span>
              </div>
              <div>
                <span>
                  {product.quantity} x ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
    </>
  )
}

export default OrderDetails
