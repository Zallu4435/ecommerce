import { useState } from 'react'

const ShippingAddress = () => {
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

  const fields = [
    "fullName",
    "phone",
    "pincode",
    "address",
    "areaStreet",
    "landmark",
    "city",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
      <>
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
      </>
  )
}

export default ShippingAddress
