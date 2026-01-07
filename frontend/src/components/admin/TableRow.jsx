import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../user/StyledComponents/StyledComponents";
import { useButtonHandlers } from "./ButtonHandlers";
import ConfirmDeleteModal from "../../modal/admin/ConfirmDeleteModal";
import { defaultProfile } from "../../assets/images";
import { STATUS_CONFIG } from "./StatusDropdown";

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
              <div className="flex items-center gap-2">
                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-bold text-gray-700 dark:text-gray-300">
                  {item.couponCode || "N/A"}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.couponCode);
                    // toast.success("Copied!"); 
                  }}
                  title="Copy Code"
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
            </td>
            <td className="px-6 py-4 border border-gray-600">
              <div className="font-medium text-gray-800 dark:text-gray-200">{item.title || "N/A"}</div>
            </td>
            <td className="px-6 py-4 border border-gray-600">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900">
                {item.discount ? `${item.discount}%` : "N/A"}
              </span>
            </td>
            <td className="px-6 py-4 border border-gray-600">
              {(() => {
                const isExpired = new Date(item.expiry) < new Date();
                const isLimitReached = item.usageLimit !== null && item.usageCount >= item.usageLimit;

                if (isExpired) {
                  return <span className="text-red-700 bg-red-100 border border-red-200 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Expired</span>;
                } else if (isLimitReached) {
                  return <span className="text-orange-700 bg-orange-100 border border-orange-200 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Sold Out</span>;
                } else {
                  return <span className="text-green-700 bg-green-100 border border-green-200 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">Active</span>;
                }
              })()}
            </td>
            <td className="px-6 py-4 border border-gray-600 text-sm">
              <div className="flex flex-col">
                <span className="font-medium">{item.expiry ? new Date(item.expiry).toLocaleDateString() : "N/A"}</span>
                <span className="text-xs text-gray-500">{item.expiry ? new Date(item.expiry).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
              </div>
            </td>
            <td className="px-6 flex py-4 gap-3">
              <Button
                $borderColor="#d97706"
                $textColor="#d97706"
                $hoverColor="white"
                onClick={() => handleView(item.id, "coupons")}
                className="!px-3 !py-1 text-xs"
              >
                View
              </Button>
              <Button
                $borderColor="#16a34a"
                $textColor="#16a34a"
                $hoverColor="white"
                onClick={() => handleUpdate(item.id, "coupons")}
                className="!px-3 !py-1 text-xs"
              >
                Edit
              </Button>
              <Button
                $borderColor="#B34D4D"
                $textColor="#B34D4D"
                $hoverColor="white"
                onClick={() => openModal(item)}
                className="!px-3 !py-1 text-xs"
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

        {type === "allOrders" && (
          <>
            <td className="px-6 py-4 border border-gray-600 font-medium whitespace-nowrap">
              {item.orderId}
            </td>
            <td className="px-6 py-4 border border-gray-600">
              <div className="flex -space-x-2 overflow-hidden">
                {item.productImages?.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="inline-block h-10 w-10 rounded-lg ring-2 ring-white dark:ring-gray-800 object-cover shadow-sm bg-gray-50 dark:bg-gray-700"
                    alt="Product"
                  />
                ))}
                {item.itemCount > 3 && (
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg ring-2 ring-white dark:ring-gray-800 bg-gray-100 dark:bg-gray-700 text-[10px] font-bold text-gray-500">
                    +{item.itemCount - 3}
                  </div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 border border-gray-600 min-w-[200px]">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-9 w-9 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                  {item.userName?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">{item.userName}</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{item.userEmail}</span>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 border border-gray-600 text-sm whitespace-nowrap text-center">
              <span className="font-bold text-gray-700 dark:text-gray-300">{item.itemCount}</span> items
            </td>
            <td className="px-6 py-4 border border-gray-600 whitespace-nowrap font-black text-gray-900 dark:text-gray-100">
              ₹{item.totalAmount?.toFixed(2)}
            </td>
            <td className="px-6 py-4 border border-gray-600 min-w-[140px] text-center">
              <span className={`inline-block px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border ${STATUS_CONFIG[item.orderStatus]?.color || "bg-gray-100 text-gray-700"}`}>
                {item.orderStatus}
              </span>
            </td>
            <td className="px-6 py-4 border border-gray-600 text-[11px] font-semibold text-gray-500 whitespace-nowrap">
              {new Date(item.orderDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </td>
            <td className="px-6 py-4 border border-gray-600 whitespace-nowrap">
              <Button
                $borderColor="#3b82f6"
                $textColor="#3b82f6"
                $hoverColor="white"
                onClick={() => navigate(`/admin/order-details/${item._id}`)}
                className="!px-3 !py-1.5 text-[11px] font-black uppercase tracking-tighter"
              >
                Details
              </Button>
            </td>
          </>
        )}


        {type === "reviews" && (
          <>
            <td className="px-6 py-4 border border-gray-600">
              <div className="flex items-center gap-3">
                <img
                  src={item.productId?.image}
                  alt="Prod"
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm font-medium max-w-[150px] truncate" title={item.productId?.productName}>
                  {item.productId?.productName}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 border border-gray-600">
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{item.userId?.username || "Unknown"}</span>
                <span className="text-xs text-gray-400">{item.userId?.email}</span>
              </div>
            </td>
            <td className="px-6 py-4 border border-gray-600">
              <span className={`font-bold ${item.rating >= 4 ? "text-green-500" : item.rating >= 3 ? "text-yellow-500" : "text-red-500"}`}>
                {item.rating} / 5
              </span>
            </td>
            <td className="px-6 py-4 border border-gray-600 max-w-[250px]">
              <p className="truncate text-sm text-gray-300" title={item.review}>
                {item.review}
              </p>
            </td>
            <td className="px-6 py-4 border border-gray-600 text-sm">
              {new Date(item.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 flex py-4 gap-6">
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
      "Code",
      "Title",
      "Discount",
      "Status",
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
  allOrders: {
    headers: [
      "Order ID",
      "Product",
      "Customer",
      "Items",
      "Amount",
      "Status",
      "Date",
      "Actions",
    ],

    rowRenderer: (item, refetch) => <TableRow item={item} type="allOrders" refetch={refetch} />,
  },
  reviews: {
    headers: [
      "Product",
      "User",
      "Rating",
      "Review",
      "Date",
      "Actions",
    ],
    rowRenderer: (item, refetch) => <TableRow item={item} type="reviews" refetch={refetch} />,
  },
};
