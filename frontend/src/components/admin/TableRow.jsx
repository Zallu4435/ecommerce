import { Button } from "../user/StyledComponents/StyledComponents";
import { useButtonHandlers } from "./ButtonHandlers";
import DeleteConfirmationModal from "../../modal/admin/ConfirmDeleteModal";
import { useState } from "react";
import { defaultProfile } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import { useGetAllCouponsQuery } from "../../redux/apiSliceFeatures/CouponApiSlice";

const TableRow = ({ item, type }) => {
  const { handleBan, handleDelete, handleUpdate, handleView } =
    useButtonHandlers();
  const [showModal, setShowModal] = useState(false); 
  const [itemToDelete, setItemToDelete] = useState(null); 
  const navigate = useNavigate();
  const { refetch: refetchCoupon } = useGetAllCouponsQuery();

  const openModal = (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleConfirmDelete = async () => {
    handleDelete(
      itemToDelete.id ? itemToDelete.id : itemToDelete._id,
      type === "categories" ? "category" : type
    );
    await refetchCoupon();
    closeModal();
  };

  const handleOrderView = (orderId, username, email) => {
    navigate(`view/orders/${orderId}`, {
      state: { username, email }, 
    });
  };
  

  return (
    <>
      <tr
        key={item.id}
        className="dark:hover:bg-gray-800 border border-gray-600 hover:bg-slate-100"
      >
        {type === "users" && (
          <>
            <td className="px-6 py-4 w-[200px] overflow-hidden flex items-center gap-3">
              <img
                src={item.avatar || defaultProfile}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <strong className="">{item.name}</strong>
            </td>
            <td className="px-6 py-4 border border-gray-600">{item.email}</td>
            <td className="px-6 py-4 border border-gray-600">{item.role}</td>
            <td className="px-6 py-4 border border-gray-600">
              {new Date(item.joinDate).toLocaleDateString()}
            </td>
            <td className="px-6 flex py-4 gap-6">
              <Button
                borderColor="#d97706"
                textColor="#d97706"
                hoverColor="white"
                onClick={() => handleBan("admin", item.id)}
              >
                {item.isBlocked ? "Ban" : "Unban"}
              </Button>
              <Button
                borderColor="#D4A017"
                textColor="#D4A017"
                hoverColor="white"
                onClick={() => handleView(item.id, "users")}
              >
                View
              </Button>
            </td>
          </>
        )}

        {type === "categories" && (
          <>
            <td className="px-6 py-4">{item.categoryName}</td>
            <td className="px-6 py-4 border w-[550px] h-[50px] overflow-hidden border-gray-600">
              {item.categoryDescription}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {new Date(item.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-[40px] flex gap-6">
              <Button
                borderColor="#16a34a"
                textColor="#16a34a"
                hoverColor="white"
                onClick={() => handleUpdate(item._id, "category")}
              >
                Update
              </Button>
              <Button
                borderColor="#B34D4D"
                textColor="#B34D4D"
                hoverColor="white"
                onClick={() => openModal(item)}
              >
                Delete
              </Button>
            </td>
          </>
        )}

        {type === "orders" && (
          <>
            <td className="px-6 py-4">{item.email}</td>
            <td className="px-6 py-4 border border-gray-600">
              {item.ordersCount}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.totalAmount ? item.totalAmount?.toFixed(2) : item.totalAmount}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.lastOrderDate}
            </td>
            <td className="px-6 flex text-nowrap py-4 gap-6">
              <Button
                borderColor="#D4A017"
                textColor="#D4A017"
                hoverColor="white"
                onClick={() => handleOrderView(item._id, item.username, item.email)}
                >
                View Individual Orders
              </Button>
            </td>
          </>
        )}

        {type === "coupons" && (
          <>
            <td className="px-6 py-4 border border-gray-600">
              {item.couponCode || "N/A"}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.title || "N/A"}
            </td>
            <td className="px-6 py-4 border border-gray-600">
            {item.discount ? `${item.discount} %` : "N/A"}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.expiry ? new Date(item.expiry).toLocaleDateString() : "N/A"}
            </td>
            <td className="px-6 flex py-4 gap-6">
              <Button
                borderColor="#d97706"
                textColor="#d97706"
                hoverColor="white"
                onClick={() => handleView(item.id, "coupons")}
              >
                View
              </Button>
              <Button
                borderColor="#16a34a"
                textColor="#16a34a"
                hoverColor="white"
                onClick={() => handleUpdate(item._id, "coupons")}
              >
                Update
              </Button>
              <Button
                borderColor="#B34D4D"
                textColor="#B34D4D"
                hoverColor="white"
                onClick={() => openModal(item)}
              >
                Delete
              </Button>
            </td>
          </>
        )}

        {type === "products" && (
          <>
            <td className="px-6 py-4 border border-gray-600">
              {item.productName}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.category}
            </td>
            <td className="px-6 py-4 border border-gray-600">{item.brand}</td>
            <td className="px-6 py-4 border border-gray-600">
              {item.originalPrice}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.offerPrice ? item.offerPrice.toString() : "0"}
            </td>
            <td className="px-6 flex py-4 gap-6">
              <Button
                borderColor="#d97706"
                textColor="#d97706"
                hoverColor="white"
                onClick={() => handleView(item.id, "products")}
              >
                View
              </Button>
              <Button
                borderColor="#16a34a"
                textColor="#16a34a"
                hoverColor="white"
                onClick={() => handleUpdate(item.id, "products")}
              >
                Update
              </Button>
              <Button
                borderColor="#B34D4D"
                textColor="#B34D4D"
                hoverColor="white"
                onClick={() => openModal(item)}
              >
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
        itemName={itemToDelete?.productName || itemToDelete?.categoryName || itemToDelete?.couponCode}
      />

      {/* <OrdersModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} userId={userId} /> */}
    </>
  );
};

// Define table configurations based on the type
export const config = {
  users: {
    headers: ["Username", "Email", "Role", "Join Date", "Actions"],
    rowRenderer: (item) => <TableRow item={item} type="users" />,
  },
  categories: {
    headers: ["Category Name", "Category Description", "Created At", "Actions"],
    rowRenderer: (item) => <TableRow item={item} type="categories" />,
  },
  orders: {
    headers: [
      "User Email",
      "Total Orders",
      "Total Amount",
      "Last Order Date",
      "Actions",
    ],
    rowRenderer: (item) => <TableRow item={item} type="orders" />,
  },
  coupons: {
    headers: [
      "Coupon Code",
      "Coupon Title",
      "Discount",
      "Valid Until",
      "Actions",
    ],
    rowRenderer: (item) => <TableRow item={item} type="coupons" />,
  },
  products: {
    headers: [
      "Product Name",
      "Category",
      "Brand",
      "Original Price",
      "Offer Price",
      "Actions",
    ],
    rowRenderer: (item) => <TableRow item={item} type="products" />,
  },
};
