import { createContext, useState } from 'react';

interface PaginationContextData {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    totalCount: number;
    setCurrentPage: (page: number) => void;
    setTotalPages: (page: number) => void;
    setHasNextPage: (page: boolean) => void;
    setTotalCount: (page: number) => void;
}

export const PaginationContext = createContext<PaginationContextData | undefined>(undefined);

export const PaginationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const contextValue: PaginationContextData = {
        currentPage,
        totalPages,
        hasNextPage,
        totalCount,
        setCurrentPage,
        setTotalPages,
        setHasNextPage,
        setTotalCount
    };

    return (
        <PaginationContext.Provider value={contextValue}>
            {children}
        </PaginationContext.Provider>
    );
};


