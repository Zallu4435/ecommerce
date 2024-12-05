import { FaShoppingCart } from "react-icons/fa";
import { Button } from "../../StyledComponents";
import { useButtonHandlers } from "../../admin/ButtonHandlers";
import { useState } from "react";

const TableRow = ({ item, type }) => {
  const { handleDelete } = useButtonHandlers();
  const [quantity, setQuantity] = useState(0)

  const handleQuantityChange = (action) => {
    setQuantity((prevQuantity) => action === "increase" ? prevQuantity + 1 : Math.max(prevQuantity - 1, 0));
  };
  return (
    <tr key={item.id} className="hover:bg-slate-100">
      {type === 'cart' && (
        <>
        {/* Remove Button */}
        <td className="px-6 py-4">
          <button className="text-lg font-bold" onClick={() => alert("deleted")}>
            ❌ Remove
          </button>
        </td>


        {/* Product Name */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-4 group">
            {/* Add 'group' class to the parent container */}
            <img
              src="https://via.placeholder.com/400"
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg transition-transform duration-300 group-hover:scale-125"
            />
            <div className="flex flex-col">
              <h3 className="text-lg font-medium">{item.name}</h3>
              <div className="flex items-center mb-1">
                <span className="text-yellow-500 mr-1">⭐</span>
                <span>{item.rating}</span>
                <span className="ml-2 text-sm text-gray-500">{item.reviewCount}(12k) reviews</span>
              </div>
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="px-6 py-4 text-xl font-semibold text-gray-900">${item.price}</td>

        {/* Stock */}
        <td className="px-6 py-4 text-xl font-semibold text-gray-900">
          <div className="flex items-center">
            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => handleQuantityChange("decrease")}
            >
              -
            </button>

            <span className="mx-4">{quantity}</span>

            <button
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => handleQuantityChange("increase")}
            >
              +
            </button>
          </div>
        </td>

        <td className="px-6 py-4 text-xl font-semibold text-gray-900">1212</td>

        <td className="px-6 py-4 text-xl font-semibold text-gray-900">1212</td>

      </>
    )}

      {type === 'wishlist' && (
        <>
          {/* Remove Button */}
          <td className="px-6 py-4">
            <button className="text-lg font-bold" onClick={() => alert("deleted")}>
              ❌ Remove
            </button>
          </td>


          {/* Product Name */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-4 group">
              {/* Add 'group' class to the parent container */}
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg transition-transform duration-300 group-hover:scale-125"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <div className="flex items-center mb-1">
                  <span className="text-yellow-500 mr-1">⭐</span>
                  <span>{item.rating}</span>
                  <span className="ml-2 text-sm text-gray-500">{item.reviewCount}(12k) reviews</span>
                </div>
              </div>
            </div>
          </td>

          {/* Price */}
          <td className="px-6 py-4 text-xl font-semibold text-gray-900">${item.price}</td>

          {/* Stock */}
          <td className="px-6 py-4 text-xl font-semibold text-gray-900">{item.stock}</td>

          {/* Actions */}
          <td className="py-6">
            <button className="py-4 px-12 flex justify-center items-center gap-2 rounded-full border border-gray-700 font-semibold text-xl transition">
              Add to Cart
              <FaShoppingCart />
            </button>

          </td>
        </>
      )}
    </tr>
  );
};



// Configuration for Cart and Wishlist
export const config = {
  cart: {
    headers: ['Remove', 'Product Name', 'Price', 'Quantity', 'Total Amount', 'Subtotal'],
    rowRenderer: (item) => <TableRow item={item} type="cart" />,
  },
  wishlist: {
    headers: ['Remove', 'Product Name', 'Price', 'Stock', 'Actions'],
    rowRenderer: (item) => <TableRow item={item} type="wishlist" />,
  },
};
