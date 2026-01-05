import { Button } from "../user/StyledComponents/StyledComponents";
import { useButtonHandlers } from "./ButtonHandlers";
import ConfirmDeleteModal from "../../modal/admin/ConfirmDeleteModal";
import { useState } from "react";
import { defaultProfile } from "../../assets/images";
import { useNavigate } from "react-router-dom";

const TableRow = ({ item, type, refetch }) => {
  const { handleBan, handleDelete, handleUpdate, handleView } =
    useButtonHandlers(refetch);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

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
                $borderColor="#d97706"
                $textColor="#d97706"
                $hoverColor="white"
                onClick={() => handleBan("admin", item.id)}
              >
                {item.isBlocked ? "Unban" : "Ban"}
              </Button>
              <Button
                $borderColor="#D4A017"
                $textColor="#D4A017"
                $hoverColor="white"
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
            <td className="px-6 py-4 border border-gray-600 max-w-[300px] truncate" title={item.categoryDescription}>
              {item.categoryDescription}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {item.isOfferActive ? (
                <div>
                  <span className="font-semibold text-green-600">{item.offerName}</span>
                  <span className="text-xs ml-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {item.categoryOffer}%
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.endDate ? `Ends: ${new Date(item.endDate).toLocaleDateString()}` : ""}
                  </div>
                </div>
              ) : (
                <span className="text-gray-400 italic">No Active Offer</span>
              )}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {new Date(item.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-[40px] flex gap-6">
              <Button
                $borderColor="#16a34a"
                $textColor="#16a34a"
                $hoverColor="white"
                onClick={() => handleUpdate(item._id, "category")}
              >
                Update
              </Button>
              <Button
                $borderColor="#B34D4D"
                $textColor="#B34D4D"
                $hoverColor="white"
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
                $borderColor="#D4A017"
                $textColor="#D4A017"
                $hoverColor="white"
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
                $borderColor="#d97706"
                $textColor="#d97706"
                $hoverColor="white"
                onClick={() => handleView(item.id, "coupons")}
              >
                View
              </Button>
              <Button
                $borderColor="#16a34a"
                $textColor="#16a34a"
                $hoverColor="white"
                onClick={() => handleUpdate(item.id, "coupons")}
              >
                Update
              </Button>
              <Button
                $borderColor="#B34D4D"
                $textColor="#B34D4D"
                $hoverColor="white"
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
              ₹{item.basePrice || item.originalPrice}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              ₹{item.baseOfferPrice !== undefined ? item.baseOfferPrice : (item.offerPrice || "0")}
            </td>
            <td className="px-6 flex py-4 gap-6">
              <Button
                $borderColor="#d97706"
                $textColor="#d97706"
                $hoverColor="white"
                onClick={() => handleView(item.id, "products")}
              >
                View
              </Button>
              <Button
                $borderColor="#16a34a"
                $textColor="#16a34a"
                $hoverColor="white"
                onClick={() => handleUpdate(item.id, "products")}
              >
                Update
              </Button>
              <Button
                $borderColor="#B34D4D"
                $textColor="#B34D4D"
                $hoverColor="white"
                onClick={() => openModal(item)}
              >
                Delete
              </Button>
            </td>
          </>
        )}
      </tr>

      <ConfirmDeleteModal
        show={showModal}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.productName || itemToDelete?.categoryName || itemToDelete?.couponCode}
      />

      {/* <OrdersModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} userId={userId} /> */}
    </>
  );
};

export const config = {
  users: {
    headers: ["Username", "Email", "Role", "Join Date", "Actions"],
    rowRenderer: (item, refetch) => <TableRow item={item} type="users" refetch={refetch} />,
  },
  categories: {
    headers: ["Category Name", "Category Description", "Active Offer", "Created At", "Actions"],
    rowRenderer: (item, refetch) => <TableRow item={item} type="categories" refetch={refetch} />,
  },
  orders: {
    headers: [
      "User Email",
      "Total Orders",
      "Total Amount",
      "Last Order Date",
      "Actions",
    ],
    rowRenderer: (item, refetch) => <TableRow item={item} type="orders" refetch={refetch} />,
  },
  coupons: {
    headers: [
      "Coupon Code",
      "Coupon Title",
      "Discount",
      "Valid Until",
      "Actions",
    ],
    rowRenderer: (item, refetch) => <TableRow item={item} type="coupons" refetch={refetch} />,
  },
  products: {
    headers: [
      "Product Name",
      "Category",
      "Brand",
      "Base Price",
      "Base Offer Price",
      "Actions",
    ],
    rowRenderer: (item, refetch) => <TableRow item={item} type="products" refetch={refetch} />,
  },
};
