// // src/components/UserTable.js
// import { Button } from './StyledComponents';

// const AdminTable = ({ users, search, setSearch }) => {
//   const tableRow = ['Username', 'Email', 'Role', 'Actions'];

//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       {/* Search Bar */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search User"
//           className="w-full p-3 rounded-md border border-gray-600"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* User Table */}
//       <table className="w-full table-auto border-collapse border border-gray-600">
//         <thead>
//           <tr>
//             {tableRow.map((row, index) => (
//               <th key={index} className="px-6 py-4 border border-gray-600 text-left">{row}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {filteredUsers.length === 0 ? (
//             <tr>
//               <td colSpan="4" className="text-center py-4">No user found</td>
//             </tr>
//           ) : (
//             filteredUsers.map((user) => (
//               <tr key={user.id} className="dark:hover:bg-gray-800 border border-gray-600 hover:bg-slate-100">
//                 <td className="px-6 py-4 flex items-center gap-3">
//                   <img
//                     src="https://via.placeholder.com/50"
//                     alt="Profile"
//                     className="w-12 h-12 rounded-full"
//                   />
//                   {user.name}
//                 </td>
//                 <td className="px-6 py-4 border border-gray-600">{user.email}</td>
//                 <td className="px-6 py-4 border border-gray-600">{user.role}</td>
//                 <td className="px-6 flex py-4 gap-6">
//                   <Button borderColor="#16a34a" textColor="#16a34a" hoverColor="white">Update</Button>
//                   <Button borderColor="#d97706" textColor="#d97706" hoverColor="white">Ban</Button>
//                   <Button borderColor="#B34D4D" textColor="#B34D4D" hoverColor="white">Delete</Button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminTable;



// // Define table configurations based on the type
// const config = {
//   users: {
//     headers: ['Username', 'Email', 'Role', 'Actions'],
//     rowRenderer: (item) => (
//       <tr key={item.id} className="dark:hover:bg-gray-800 border border-gray-600 hover:bg-slate-100">
//         <td className="px-6 py-4 flex items-center gap-3                        ">
//           <img
//             src="https://via.placeholder.com/50"
//             alt="Profile"
//             className="w-12 h-12 rounded-full"
//           />
//           {item.name}
//         </td>
//         <td className="px-6 py-4 border border-gray-600">{item.email}</td>
//         <td className="px-6 py-4 border border-gray-600">{item.role}</td>
//         <td className="px-6 flex py-4 gap-6">
//           <Button borderColor="#16a34a" textColor="#16a34a" hoverColor="white">Update</Button>
//           <Button borderColor="#d97706" textColor="#d97706" hoverColor="white">Ban</Button>
//           <Button borderColor="#B34D4D" textColor="#B34D4D" hoverColor="white">Delete</Button>
//         </td>
//       </tr>
//     ),
//   },
//   categories: {
//     headers: ['Category Name', 'Product Count', 'Created At', 'Updated At', 'Actions'],
//     rowRenderer: (item) => (
//       <tr key={item.id} className="dark:hover:bg-gray-800 border border-gray-600 hover:bg-slate-100">
//         <td className="px-6 py-4">{item.name}</td>
//         <td className="px-6 py-4 border border-gray-600">{item.productCount}</td>
//         <td className="px-6 py-4 border border-gray-600">{item.createdAt}</td>
//         <td className="px-6 py-4 border border-gray-600">{item.updatedAt}</td>
//         <td className="px-6 flex py-4 gap-6">
//           <Button borderColor="#16a34a" textColor="#16a34a" hoverColor="white">Update</Button>
//           <Button borderColor="#B34D4D" textColor="#B34D4D" hoverColor="white">Delete</Button>
//         </td>
//       </tr>
//     ),
//   },
// };




// import { Button } from './StyledComponents';
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
