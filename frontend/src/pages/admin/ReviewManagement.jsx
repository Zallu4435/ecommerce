import { useEffect, useState } from "react";
import AdminTable from "../../components/admin/AdminTable";
import { useGetAdminReviewsQuery } from "../../redux/apiSliceFeatures/AdminApiSlice";

const ReviewManagement = () => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError, refetch } = useGetAdminReviewsQuery({
        search: debouncedSearch,
        page: currentPage,
        limit,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1); // Reset to page 1 on search
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const totalReviews = data?.totalReviews || 0;
    const totalPages = Math.ceil(totalReviews / limit);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className="flex h-screen dark:bg-black top-10 fixed left-[420px] right-0 dark:text-white">
            <div className="dark:bg-gray-900 w-full bg-orange-50 px-14">
                <div className="flex justify-between mt-5 items-center">
                    <h1 className="text-3xl font-bold text-gray-400">
                        Review Management
                    </h1>

                    {totalReviews > 0 && (
                        <div className="flex justify-between space-x-4 items-center mb-4">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-md ${currentPage === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    } `}
                            >
                                Previous
                            </button>
                            <span className="text-gray-600 dark:text-gray-300">
                                Page {currentPage} / {totalPages || 1}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`px-4 py-2 rounded-md ${currentPage === totalPages || totalPages === 0
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    } `}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-y-auto scrollbar-hidden">
                    <AdminTable
                        type="reviews"
                        data={data}
                        search={search}
                        setSearch={setSearch}
                        isLoading={isLoading}
                        isError={isError}
                        refetch={refetch}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReviewManagement;
