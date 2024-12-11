import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {

  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    address: "",
    areaStreet: "",
    landmark: "",
    city: "",
    state: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("");
  const [coupon, setCoupon] = useState("");

  const products = [
    { id: 1, name: "Product 1", image: "https://via.placeholder.com/100", price: 20.0, quantity: 1 },
    { id: 2, name: "Product 2", image: "https://via.placeholder.com/100", price: 30.0, quantity: 2 },
  ];

  const fields = [
    "fullName",
    "phone",
    "pincode",
    "address",
    "areaStreet",
    "landmark",
    "city",
  ];

  const paymentMethods = [
    { label: "Pay Online", value: "online" },
    { label: "Cash on Delivery", value: "cod" },
  ];

  const onlineMethods = [
    { label: "Razorpay", value: "razorpay", img: "https://via.placeholder.com/50?text=Razorpay" },
    { label: "Credit/Debit Card", value: "card", img: "https://via.placeholder.com/50?text=Card" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    const { value } = e.target;
    setPaymentMethod(value === paymentMethod ? "" : value);
    setOnlinePaymentMethod("");
  };

  const handleOnlinePaymentMethodChange = (method) => {
    setOnlinePaymentMethod(method === onlinePaymentMethod ? "" : method);
  };

  const calculateTotal = () =>
    products.reduce((total, product) => total + product.price * product.quantity, 0);

  return (
    <div className="container mx-auto grid grid-cols-1 space-x-52 lg:grid-cols-2 py-10 px-4">
      <div className="grid gap-10">
        {/* Shipping Address Form */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={shippingAddress[field]}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              ))}
              <div className="">
                <label className="block text-sm font-medium">State</label>
                <select
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select State</option>
                  <option value="state1">State 1</option>
                  <option value="state2">State 2</option>
                </select>
              </div>
            </div>
          </form>
        </div>

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
      </div>

      <div className="grid h-[600px] py-10 w-[550px] justify-center border-2 gap-y-10">
        {/* Payment Method */}
        <div
          className={`bg-white p-6 shadow-md rounded-md w-[440px] transition-all duration-300 ${
            paymentMethod === "online" ? "h-auto" : "h-[200px]"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          {paymentMethods.map((method) => (
            <div className="flex items-center mb-2" key={method.value}>
              <input
                type="radio"
                name="paymentMethod"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={handlePaymentMethodChange}
                className="mr-2"
              />
              <label className="font-medium">{method.label}</label>
            </div>
          ))}
          {paymentMethod === "online" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Select Online Payment Option</h3>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {onlineMethods.map((method) => (
                  <div
                    key={method.value}
                    onClick={() => handleOnlinePaymentMethodChange(method.value)}
                    className={`cursor-pointer border p-4 rounded-md flex flex-col items-center ${
                      onlinePaymentMethod === method.value
                        ? "border-indigo-500"
                        : "border-gray-300"
                    } hover:shadow-md`}
                  >
                    <img
                      src={method.img}
                      alt={method.label}
                      className="mb-2 w-12 h-12 object-cover"
                    />
                    <span className="text-sm font-medium">{method.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply Coupon */}
        <div className="bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-semibold mb-4">Apply Coupon</h2>
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter coupon code"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="w-full mt-4 bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
            Apply Coupon
          </button>
        </div>

        {/* Proceed Button */}
        <button
          onClick={() => navigate('/payment-success')}
          className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;