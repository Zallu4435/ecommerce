import TableRowForCartlist from "./TableRowForCartList";

const ProductTableForCartlist = ({ type, data, onRemove }) => {
  const renderTableHeader = () => (
    <tr>
      <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
        Remove
      </th>
      <th className="px-6 py-4 text-left border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
        Product Name
      </th>
      <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
        Stock
      </th>
      <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
        Quantity
      </th>
      <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
        Price
      </th>
      <th className="px-6 py-4 text-center border-b bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
        Subtotal
      </th>
    </tr>
  );

  const renderItems = () => {
    if (!data || data.length === 0) {
      return (
        <tr>
          <td
            colSpan="5"
            className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
          >
            No items found in the cart.
          </td>
        </tr>
      );
    }

    return data.map((item) => (
      <TableRowForCartlist key={item.id} item={item} onRemove={onRemove} />
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center md:m-10 m-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      {/* Heading */}
      {type === "cart" && (
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Your Cart
        </h2>
      )}

      {/* Full Table for Larger Screens */}
      <div className="overflow-x-auto w-full max-w-6xl hidden md:block">
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700">
          <thead>{renderTableHeader()}</thead>
          <tbody>{renderItems()}</tbody>
        </table>
      </div>

      {/* Collapsed Table for Small Screens */}
      <div className="grid gap-6 w-full md:hidden mt-6">{renderItems()}</div>
    </div>
  );
};

export default ProductTableForCartlist;
