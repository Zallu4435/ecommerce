
import { config } from "./TableRow";  

const AdminTable = ({ type, data, search, setSearch }) => {

  // Get the current configuration based on the type
  const { headers, rowRenderer } = config[type];

  const types = {
    users: 'Users',
    categories: ' Categories',
    coupons: ' Coupons',
    orders: ' Orders',
    products: ' Products',
  };
  

  // Filter data based on the search query
  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );
  

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search for${types[type]}`}
          className="w-full p-3 rounded-md border border-gray-600 text-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse border border-gray-600">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 border border-gray-600 text-left whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                { `No ${types[type]} Found` || 'No results found' }
              </td>
            </tr>
          ) : (
            filteredData.map(rowRenderer)
          )}
        </tbody>

      </table>
    </div>
  );
};

export default AdminTable;
