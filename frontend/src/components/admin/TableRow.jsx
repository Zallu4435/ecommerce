import { Button } from '../user/StyledComponents/StyledComponents';
import { useButtonHandlers } from './ButtonHandlers';
import DeleteConfirmationModal from '../../modal/admin/ConfirmDeleteModal';
import { useState } from 'react';

// Define a new component for each row that calls the hook inside it
const TableRow = ({ item, type }) => {
  const { handleBan, handleDelete, handleUpdate, handleView } = useButtonHandlers();
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [itemToDelete, setItemToDelete] = useState(null); // Item to be deleted

  const openModal = (item) => {
    setItemToDelete(item); // Set the item to delete
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false); // Hide the modal
    setItemToDelete(null); // Clear the item
  };

  const handleConfirmDelete = () => {
    handleDelete(itemToDelete.id? itemToDelete.id : itemToDelete._id, type === "categories" ? "category" : type); // Trigger delete action
    closeModal(); // Close the modal after deletion
  };

  

  return (
    <>
      <tr key={item.id} className="dark:hover:bg-gray-800 border border-gray-600 hover:bg-slate-100">
        {type === 'users' && (
          <>
            <td className="px-6 py-4 w-[200px] overflow-hidden flex items-center gap-3">
              <img src="https://via.placeholder.com/50" alt="Profile" className="w-12 h-12 rounded-full" />
              <strong className=''>{item.name}</strong>
            </td>
            <td className="px-6 py-4 border border-gray-600">{item.email}</td>
            <td className="px-6 py-4 border border-gray-600">{item.role}</td>
            <td className="px-6 py-4 border border-gray-600">{new Date(item.joinDate).toLocaleDateString()}</td>          
            <td className="px-6 flex py-4 gap-6">
              <Button borderColor="#d97706" textColor="#d97706" hoverColor="white" onClick={() => handleBan('admin', item.id)}>
              {console.log(item.isBlocked ? 'ban': "unban")}
                {item.isBlocked ? 'Ban' : 'Unban'}
              </Button>
              <Button borderColor="#D4A017" textColor="#D4A017" hoverColor="white" onClick={() => handleView(item.id, 'users')}>
                View
              </Button>
            </td>
          </>
        )}

        {type === 'categories' && (
          <>
          {console.log(item, "categories")}
            <td className="px-6 py-4">{item.categoryName}</td>
            <td className="px-6 py-4 border border-gray-600">{item.productCount}</td>
            <td className="px-6 py-4 border border-gray-600">{new Date(item.createdAt).toLocaleDateString()}</td>
            <td className="px-6 flex py-4 gap-6">
              <Button borderColor="#16a34a" textColor="#16a34a" hoverColor="white" onClick={() => handleUpdate(item._id, 'category')}>
                Update
              </Button>
              <Button borderColor="#B34D4D" textColor="#B34D4D" hoverColor="white" onClick={() => openModal(item)}>
                Delete
              </Button>
            </td>
          </>
        )}

        {type === 'orders' && (
          <>
            <td className="px-6 py-4">{item.name}</td>
            <td className="px-6 py-4 border border-gray-600">{item.orders}</td>
            <td className="px-6 py-4 border border-gray-600">{item.totalAmount}</td>
            <td className="px-6 py-4 border border-gray-600">{item.lastOrder}</td>
            <td className="px-6 py-4 border border-gray-600">{item.status}</td>
            <td className="px-6 flex py-4 gap-6">
              <Button borderColor="#D4A017" textColor="#D4A017" hoverColor="white" onClick={() => handleView('orders')}>
                View
              </Button>
              <Button borderColor="#16a34a" textColor="#16a34a" hoverColor="white" onClick={() => handleUpdate(item.id, 'categories')}>
                Update
              </Button>
            </td>
          </>
        )}

        {type === 'coupons' && (
          <>
            <td className="px-6 py-4 border border-gray-600">{item.couponCode}</td>
            <td className="px-6 py-4 border border-gray-600">
              {item.discount?.$numberDecimal || item.discount || "N/A"}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.expiry ? new Date(item.expiry).toLocaleDateString() : "N/A"}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.maxDiscount.$numberDecimal || item.maxDiscount || "N/A"}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.minPurchase?.$numberDecimal || item.minPurchase || "N/A"}
            </td>

            <td className="px-6 flex py-4 gap-6">
              <Button borderColor="#16a34a" textColor="#16a34a" hoverColor="white" onClick={() => handleUpdate(item.id, 'coupons')}>
                Update
              </Button>
              <Button borderColor="#B34D4D" textColor="#B34D4D" hoverColor="white" onClick={() => openModal(item)}>
                Delete
              </Button>
            </td>
          </>
        )}

        {type === 'products' && (
          <>
          {console.log(item, 'item from the table ')}
            <td className="px-6 py-4 border border-gray-600">{item.productName}</td>
            <td className="px-6 py-4 border border-gray-600">{item.category}</td>
            <td className="px-6 py-4 border border-gray-600">{item.brand}</td>
            <td className="px-6 py-4 border border-gray-600">{item.originalPrice}</td>
            <td className="px-6 py-4 border border-gray-600">{item.offerPrice ? item.offerPrice.toString() : '0'}</td>
            <td className="px-6 flex py-4 gap-6">
              <Button borderColor="#d97706" textColor="#d97706" hoverColor="white" onClick={() => handleView(item.id, 'products')}>
                View
              </Button>
              <Button borderColor="#16a34a" textColor="#16a34a" hoverColor="white" onClick={() => handleUpdate(item.id, 'products')}>
                Update
              </Button>
              <Button borderColor="#B34D4D" textColor="#B34D4D" hoverColor="white" onClick={() => openModal(item)}>
                Delete
              </Button>
            </td>        
          </>
        )}
      </tr>

      <DeleteConfirmationModal
        show={showModal}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.productName || itemToDelete?.categoryName} // Show the name of the item being deleted
      />
    </>
  );
};

// Define table configurations based on the type
export const config = {
  users: {
    headers: ['Username', 'Email', 'Role', 'Join Date', 'Actions'],
    rowRenderer: (item) => <TableRow item={item} type="users" />,
  },
  categories: {
    headers: ['Category Name', 'Product Count', 'Created At', 'Actions'],
    rowRenderer: (item) => <TableRow item={item} type="categories" />,
  },
  orders: {
    headers: ['Username', 'Total Orders', 'Total Amount', 'Last Order Date', 'Status', 'Actions'],
    rowRenderer: (item) => <TableRow item={item} type="orders" />,
  },
  coupons: {
    headers: ['Coupon Code', 'Discount Value', 'Expiry Date', 'Max Discount', 'Min Purchase', 'Actions'],
    rowRenderer: (item) => <TableRow item={item} type="coupons" />,
  },
  products: {
    headers: ['Product Name', 'Category', 'Brand', 'Original Price', 'Offer Price', 'Actions'],
    rowRenderer: (item) => <TableRow item={item} type="products" />
  },
};

