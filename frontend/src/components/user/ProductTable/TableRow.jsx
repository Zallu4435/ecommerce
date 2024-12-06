import { roundedImg_1 } from '../../../assets/images';

const TableRow = ({ item, onRemove }) => {

  return (
    <>
      {/* Full Row for Larger Screens */}
      <tr className="hidden md:table-row hover:bg-gray-100 dark:hover:bg-gray-700 transition">
        <td className="px-6 py-4 border-b text-center">
          <button
            className="text-red-500 hover:underline"
            onClick={() => onRemove(item.id)}
          >
            ❌ Remove
          </button>
        </td>
        <td className="px-6 py-4 md:px-0 border-b flex items-center gap-4">
          <img
            src={roundedImg_1}
            className="h-[60px] rounded-lg object-cover"
            alt={item.name}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">⭐ 4.5 (200)</p>
          </div>
        </td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</td>
        <td className="px-6 py-4 border-b text-center text-gray-900 dark:text-gray-100">{item.stock}</td>
        <td className="px-6 py-4 border-b text-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">
            Add to Cart
          </button>
        </td>
      </tr>

      {/* Collapsed Card for Smaller Screens */}
      <div className="block md:hidden border rounded-lg p-4 mb-4 shadow-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <button
            className="text-red-500 font-semibold hover:underline"
            onClick={() => onRemove(item.id)}
          >
            ❌ Remove
          </button>
          <span className="text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={roundedImg_1}
            className="h-[60px] rounded-lg object-cover"
            alt={item.name}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">⭐ 4.5 (200 reviews)</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700 dark:text-gray-300">Quantity:</span>
          <span>{item.stock}</span>
        </div>
        <div className="flex justify-center">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default TableRow;
