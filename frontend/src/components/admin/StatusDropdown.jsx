import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaChevronDown, FaSync } from "react-icons/fa";

export const STATUS_CONFIG = {
    Pending: { color: "bg-gray-100 text-gray-700", next: ["Confirmed", "Cancelled"] },
    Confirmed: { color: "bg-indigo-100 text-indigo-700", next: ["Processing", "Cancelled"] },
    Processing: { color: "bg-yellow-100 text-yellow-700", next: ["Packed", "Cancelled"] },
    Packed: { color: "bg-orange-100 text-orange-700", next: ["Shipped", "Cancelled"] },
    Shipped: { color: "bg-blue-100 text-blue-700", next: ["Out for Delivery", "Cancelled"] },
    "Out for Delivery": { color: "bg-blue-200 text-blue-900", next: ["Delivered", "Failed"] },
    Delivered: { color: "bg-green-100 text-green-700", next: ["Returned"] },
    "Return Requested": { color: "bg-purple-50 text-purple-600", next: ["Returned", "Delivered"] },
    Returned: { color: "bg-purple-100 text-purple-700", next: [] },
    Cancelled: { color: "bg-red-100 text-red-700", next: [] },
    Refunded: { color: "bg-green-100 text-green-800", next: [] },
    Failed: { color: "bg-red-50 text-red-700", next: ["Processing", "Cancelled"] },
};

const StatusDropdown = ({ currentStatus, orderId, itemIds, onUpdate, onStatusChange, isLoading: parentLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const dropdownRef = useRef(null);

    const isLoading = parentLoading || localLoading;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusChangeAction = async (newStatus) => {
        if (newStatus === currentStatus) return;

        if (["Cancelled", "Returned"].includes(newStatus) && !onStatusChange) {
            if (!window.confirm(`Are you sure you want to change status to ${newStatus}? This will trigger any applicable refunds.`)) {
                return;
            }
        }

        if (onStatusChange) {
            onStatusChange(newStatus);
            setIsOpen(false);
            return;
        }

        try {
            setLocalLoading(true);
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/orders/update-bulk`,
                { orderId, status: newStatus, itemsIds: itemIds },
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success(`Status updated to ${newStatus}`);
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            console.error("Status update failed:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setLocalLoading(false);
            setIsOpen(false);
        }
    };

    const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.Pending;
    const nextStatuses = config.next;

    return (
        <div className="relative inline-block text-left w-full min-w-[140px]" ref={dropdownRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoading && nextStatuses.length > 0) setIsOpen(!isOpen);
                }}
                disabled={isLoading || nextStatuses.length === 0}
                className={`flex items-center justify-between w-full px-3 py-1.5 text-[11px] font-bold rounded-full transition-all border border-transparent shadow-sm ${config.color} ${isLoading ? "opacity-70 cursor-wait" :
                    nextStatuses.length === 0 ? "cursor-default" : "hover:shadow-md cursor-pointer border-gray-200 dark:border-gray-600"
                    }`}
            >
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    {isLoading ? <FaSync className="animate-spin" size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />}
                    {currentStatus}
                </span>
                {nextStatuses.length > 0 && !isLoading && <FaChevronDown className={`ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} size={10} />}
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-1 w-44 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 z-[70] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-1.5">
                        <div className="px-3 py-2 text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 mb-1 border-b border-gray-50 dark:border-gray-700/50">Update Status</div>
                        {nextStatuses.map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChangeAction(status)}
                                className="flex items-center w-full px-2.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group/item"
                            >
                                <div className={`w-2 h-2 rounded-full mr-2.5 ${STATUS_CONFIG[status]?.color?.split(' ')[0]}`} />
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatusDropdown;
