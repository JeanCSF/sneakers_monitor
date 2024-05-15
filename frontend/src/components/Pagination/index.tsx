import { useSearchParams, useNavigate } from "react-router-dom";
import { useLoading } from "../../utils/Hooks";
type PaginationProps = {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    totalCount: number;
    onPageChange: (page: number) => void;
}
export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, hasNextPage, totalCount, onPageChange }) => {
    const [searchParams] = useSearchParams();
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        onPageChange(nextPage);
        updateURL(nextPage);
    };

    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        onPageChange(prevPage);
        updateURL(prevPage);
    };

    const updateURL = (page: number) => {
        setIsLoading(true);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', page.toString());
        navigate(`?${newSearchParams.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (page: number) => {
        const currentPage = parseInt(searchParams.get('page') || '1', 10);
        if (page !== currentPage) {
            onPageChange(page);
            updateURL(page);
        }
    };

    const renderPageButtons = () => {
        const pageButtons = [];
        const maxButtonsToShow = 3;

        let start = currentPage - Math.floor(maxButtonsToShow / 2);
        start = Math.max(start, 1);
        let end = start + maxButtonsToShow - 1;
        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxButtonsToShow + 1);
        }

        for (let i = start; i <= end; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-2 py-1 mx-1 ${i === currentPage ? "bg-gray-500 text-white dark:bg-gray-100 dark:text-gray-800" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                        } rounded-md`}
                >
                    {i}
                </button>
            );
        }

        return pageButtons;
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center my-4">
            <div className="mb-2 sm:mb-0 dark:text-gray-400 flex items-center">
                <p className="mr-3">
                    Página {currentPage} de {totalPages}
                </p>
                |
                <p className="ml-3">
                    Sneakers: {totalCount}
                </p>
            </div>
            <div className="flex items-center justify-center">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
                >
                    «
                </button>
                {currentPage > 2 && (
                    <button
                        onClick={() => handlePageChange(1)}
                        className="px-2 py-1 mx-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                        1
                    </button>
                )}
                {renderPageButtons()}
                {currentPage < totalPages - 1 && (
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-2 py-1 mx-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                        {totalPages}
                    </button>
                )}
                <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="px-3 py-1 mx-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md"
                >
                    »
                </button>
            </div>
        </div>
    );
};
