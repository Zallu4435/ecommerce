import LoadingSpinner from "../LoadingSpinner";
import { config } from "./TableRow";


const AdminTable = ({
  type,
  data = {},
  isLoading,
  isError,
  search,
  setSearch,
  refetch,
}) => {

  const displayTypes = {
    users: "Users",
    categories: "Categories",
    coupons: "Coupons",
    orders: "Orders",
    products: "Products",
    allOrders: "Orders",
  };

  const dataList = data?.[type] ? data?.[type] : data;

  const { headers, rowRenderer } = config[type];

  // Data is already filtered by backend search in parent component
  const displayData = Array.isArray(dataList) ? dataList : [];

  return (
    <div>
      <div className="mb-6 sticky overflow-hidden top-0 z-10 dark:bg-gray-900 bg-orange-50/80 backdrop-blur-sm py-4">
        <div className="relative group">
          <input
            type="text"
            placeholder={`Search ${displayTypes[type]} by ID, name, or other details...`}
            className="w-full p-3.5 pl-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
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
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  {`No ${displayTypes[type]} Found` || "No results found"}
                </td>
              </tr>
            ) : (
              displayData.map((item) => rowRenderer(item, refetch))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default AdminTable;
