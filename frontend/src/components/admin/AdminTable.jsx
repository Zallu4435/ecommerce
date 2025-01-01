import LoadingSpinner from "../LoadingSpinner";
import { config } from "./TableRow";
import { headerToFieldMap } from "../../config/searchConfig";

const AdminTable = ({
  type,
  data,
  isLoading,
  isError,
  search,
  setSearch,
  refetch,
}) => {
  // Header to field mapping for each data type (users, orders, etc.)

  // Get the current configuration based on the type
  const { headers, rowRenderer } = config[type];

  const types = {
    users: "Users",
    categories: "Category",
    coupons: "Coupons",
    orders: "Orders",
    products: "Products",
  };

    // Filter data based on the search term
  const filteredData = data[type]?.filter((item) => {
    return config[type].headers.some((header) => {
      const field = headerToFieldMap[type][header]; // Get the field name from the mapping
      const value = item[field]; // Use the field to access the data
      // If search is empty, return all items
      if (!search) return true;

      // Handle different types of values
      if (value === null || value === undefined) return false;

      // Special handling for MongoDB Decimal type
      if (value && typeof value === "object" && value.$numberDecimal) {
        return value.$numberDecimal
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase());
      }

      // Handle other object types (like dates)
      if (typeof value === "object") {
        return JSON.stringify(value)
          .toLowerCase()
          .includes(search.toLowerCase());
      }

      // String and primitive type conversion
      return value.toString().toLowerCase().includes(search.toLowerCase());
    });
  });

  // console.log(filteredData, "filteredData");

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4 sticky overflow-hidden top-0 z-10 dark:bg-gray-900 py-4">
        <input
          type="text"
          placeholder={`Search for ${types[type]}`}
          className="w-full p-3 rounded-md border border-gray-600 text-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Scrollable Table */}
      <div className="overflow-y-auto max-h-[600px] scrollbar-hidden">
        <table className="w-full table-auto border-collapse border border-gray-600">
          {/* Table Header */}
          <thead className="bg-gray-100 dark:bg-gray-900 sticky top-0 z-20 border-t-4 border-gray-600">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  Error loading state
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  {`No ${types[type]} Found` || "No results found"}
                </td>
              </tr>
            ) : (
              filteredData.map(rowRenderer)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
