import { FaShoppingCart } from "react-icons/fa";
import TableRowForCartlist from "../components/user/ProductTable/TableRowForCartList";
import TableRow from '../components/user/ProductTable/ProductTable'

// config.js
// export const config = {
//   wishlist: {
//     headers: ['Remove', 'Product Name', 'Price', 'Stock', 'Actions'],
//     rowRenderer: (item) => (
//       <tr key={item.id}>
//         <td className="px-6 py-4 border-b text-center">
//           <button className="text-red-500" onClick={() => alert('Deleted')}>
//             ❌ Remove
//           </button>
//         </td>
//         <td className="px-6 py-4 border-b">{item.name}</td>
//         <td className="px-6 py-4 border-b">${item.price}</td>
//         <td className="px-6 py-4 border-b">{item.stock}</td>
//         <td className="px-6 py-4 border-b">
//           <button
//             className="py-2 px-4 flex justify-center items-center gap-2 rounded-full border border-gray-700 font-semibold text-sm transition hover:bg-gray-700 hover:text-white"
//             onClick={() => alert('Added to cart')}
//           >
//             Add to Cart <FaShoppingCart />
//           </button>
//         </td>
//       </tr>
//     ),
//   },
// };

export const config1 = {
  cart: {
    headers: ['Remove', 'Product Name', 'Price', 'Stock', 'Action'],
    rowRenderer: (item, onRemoveFromCart, onUpdateQuantity) => (
      <TableRow
        key={item.id}
        item={item}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
      />
    ),
  },
};

// config.js
export const config2 = {
  cart: {
    headers: ['Remove', 'Product Name', 'Price', 'Quantity', 'Subtotal'],
    rowRenderer: (item, onRemoveFromCart, onUpdateQuantity) => (
      <TableRowForCartlist
        key={item.id}
        item={item}
        onRemoveFromCart={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
      />
    ),
  },
};
