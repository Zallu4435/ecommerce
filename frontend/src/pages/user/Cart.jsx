import ProductTable from '../../components/user/ProductTable/ProductTable';

const Cart = () => {

    const cartItems = [
        {
          id: 1,
          name: "Wireless Mouse",
          price: 25.99,
          quantity: 2,
          subtotal: 25.99 * 2, // 51.98
        },
        {
          id: 2,
          name: "Mechanical Keyboard",
          price: 75.49,
          quantity: 1,
          subtotal: 75.49, // 75.49
        },
        {
          id: 3,
          name: "HD Monitor",
          price: 199.99,
          quantity: 1,
          subtotal: 199.99, // 199.99
        },
        {
          id: 4,
          name: "External Hard Drive",
          price: 89.99,
          quantity: 3,
          subtotal: 89.99 * 3, // 269.97
        },
      ];

  return (
    <>
      <h1 className='font-bold text-3xl ml-10 my-5'>Cart Page</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6'>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <ProductTable 
                  type="cart"
                  data={cartItems}
              />
          </div>

          <div className="p-8 bg-white rounded-lg shadow-xl col-span-1 mt-6 lg:mt-0">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cart Total</h2>
              {['Subtotal', 'Estimated Delivery', 'Estimated Taxes'].map((label, idx) => (
                  <div key={idx} className="mb-6 flex justify-between text-gray-700">
                      <span className="font-medium">{label}</span>
                      <span className="font-medium">{`$${[597.44, 10.00, 45.24][idx].toFixed(2)}`}</span>
                  </div>
              ))}
              <div className="mb-8 flex justify-between border-t pt-4 text-gray-800">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg text-blue-600">${(597.44 + 10.00 + 45.24).toFixed(2)}</span>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                  <input
                      type='text'
                      placeholder='Enter coupon code'
                      className='border border-gray-400 w-full p-2 rounded-md'
                  />
              </div>

              <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all transform mt-5 hover:scale-105">
                  Proceed to Checkout
              </button>
          </div>
      </div>
    </>
  )
}

export default Cart;
