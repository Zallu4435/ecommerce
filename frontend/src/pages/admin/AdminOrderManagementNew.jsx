import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBox, FaEye, FaSort, FaCalendar, FaRupeeSign, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminTable from "../../components/admin/AdminTable";
import { useGetAllOrdersForAdminQuery } from "../../redux/apiSliceFeatures/OrderApiSlice";
import { useSearchAdminOrdersQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const AdminOrderManagementNew = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const limit = 10;

    // Fetch paginated orders
    const {
        data: ordersData,
        isLoading,
        isError,
        refetch: refetchOrders,
    } = useGetAllOrdersForAdminQuery(
        { page, limit, sort: sortOrder },
        { skip: Boolean(debouncedSearch) }
    );

    // Search orders
    const {
        data: searchData,
        isLoading: isSearchLoading,
        refetch: refetchSearch,
    } = useSearchAdminOrdersQuery(debouncedSearch, {
        skip: !debouncedSearch,
    });

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('🔍 [AdminOrderManagementNew] Setting debouncedSearch:', searchTerm);
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    console.log('📊 [AdminOrderManagementNew] State:', {
        searchTerm,
        debouncedSearch,
        skipPaginated: Boolean(debouncedSearch),
        skipSearch: !debouncedSearch,
        ordersData,
        searchData,
        isLoading,
        isSearchLoading,
    });

    const orders = debouncedSearch ? (searchData || []) : (ordersData?.orders || []);
    const totalPages = ordersData?.totalPages || 1;
    const loading = isLoading || (debouncedSearch && isSearchLoading);

    const handlePreviousPage = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setPage((prev) => Math.min(prev + 1, totalPages));
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
        setPage(1);
    };

    return (
        <div className="min-h-screen dark:bg-gray-900 fixed top-10 right-0 left-[420px] dark:text-white bg-orange-50 py-6 px-14 overflow-y-auto scrollbar-hidden">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-400">Order Management</h1>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-md font-bold transition-all ${page === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                            }`}
                    >
                        Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-300 font-bold">
                        Page {page} / {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-md font-bold transition-all ${page === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                            }`}
                    >
                        Next
                    </button>
                </div>

                <button
                    onClick={toggleSortOrder}
                    className="border-blue-600 border-4 hover:bg-white text-blue-500 font-bold h-[45px] py-1 px-4 rounded-md transition duration-200 flex items-center gap-2"
                >
                    <FaSort />
                    {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </button>
            </div>

            <div className="overflow-y-auto scrollbar-hidden">
                <AdminTable
                    type="allOrders"
                    data={orders}
                    search={searchTerm}
                    setSearch={setSearchTerm}
                    isLoading={loading}
                    isError={isError}
                    refetch={debouncedSearch ? refetchSearch : refetchOrders}
                />
            </div>
        </div>
    );
};

export default AdminOrderManagementNew;
