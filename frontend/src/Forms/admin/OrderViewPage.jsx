import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the dynamic order ID from the URL
  const navigate = useNavigate();

  // Dummy Order Data (replace with API data if needed)
  const order = {
    id: orderId,
    customer: 'John Doe',
    date: '2024-11-30',
    items: [
      { name: 'Smartphone', price: '$699', quantity: 1 },
      { name: 'Headphones', price: '$199', quantity: 2 },
    ],
    total: '$1097',
    address: '1234 Elm Street, Springfield, USA',
    status: 'Delivered',
  };

  return (
    <div className="dark:bg-black min-h-screen p-8">
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-gray-600"
      >
        Back
      </button>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 dark:text-gray-300 text-gray-800">
          Order Details - {order.id}
        </h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold dark:text-gray-300 text-gray-700">
            Customer: {order.customer}
          </h2>
          <p className="dark:text-gray-400 text-gray-600">Date: {order.date}</p>
          <p className="dark:text-gray-400 text-gray-600">
            Status: 
            <span
              className={`ml-2 ${
                order.status === 'Delivered'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold dark:text-gray-300 text-gray-700">
            Shipping Address:
          </h2>
          <p className="dark:text-gray-400 text-gray-600">{order.address}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold dark:text-gray-300 text-gray-700">
            Items Ordered:
          </h2>
          <ul className="dark:text-gray-400 text-gray-600">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between py-2">
                <span>{item.name}</span>
                <span>{item.quantity} x {item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-right">
          <h2 className="text-lg font-semibold dark:text-gray-300 text-gray-700">
            Total: 
            <span className="text-xl font-bold text-green-600 dark:text-green-400 ml-2">
              {order.total}
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
