import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { useSneakers } from "../utils/Hooks";
import { Sneakers } from "../utils/types";
import { usePagination } from "../utils/Hooks";

import { Card } from "../components/Card";
import { Pagination } from "../components/Pagination";
import { Sort } from "../components/Sort";
import { TbFilterSearch } from "react-icons/tb";

type MainPageProps = {
    route: string;
}

export const Main: React.FC<MainPageProps> = ({ route }) => {
    const {
        currentPage,
        totalPages,
        hasNextPage,
        totalCount,
        setCurrentPage,
        setTotalPages,
        setHasNextPage,
        setTotalCount
    } = usePagination();

    const [searchParams] = useSearchParams();
    const orderBy = searchParams.get('orderBy') || undefined;
    const color = searchParams.get('color') || undefined;

    const { store, brand, category, search } = useParams<{ store?: string; brand?: string; category?: string; search?: string }>();
    const urlParam = store || brand || category || search;
    const [isSortOpen, setIsSortOpen] = useState(false);

    const [sneakers, setSneakers] = useState<Sneakers[]>([]);

    const url = `${urlParam && !search ? `${route}/${urlParam}` : `${route}`}`;
    const getSneakers = useSneakers(url, currentPage, search, orderBy, color);
    
    useEffect(() => {
        if (getSneakers.data) {
            setSneakers(getSneakers.data.sneakers);
            setCurrentPage(getSneakers.data.currentPage);
            setTotalPages(getSneakers.data.totalPages);
            setHasNextPage(getSneakers.data.hasNextPage);
            setTotalCount(getSneakers.data.totalCount);
        }
    }, [getSneakers.data, setCurrentPage, setTotalPages, setHasNextPage, setTotalCount]);


    return (
        <div className="container mx-auto px-4 flex flex-col">
            {sneakers.length === 0 && (
                <div className="h-screen">
                    <p className="dark:text-gray-400 flex items-center justify-center">Nenhum resultado para: "{urlParam}"</p>
                </div>
            )}
            {sneakers.length !== 0 && (
                <>
                    <p className="dark:text-gray-400 flex items-center justify-center">- {urlParam?.toUpperCase()} -</p>
                    <div
                        className="flex dark:text-white md:ml-1 rounded md:static p-1 ml-2 cursor-pointer w-7 h-7 text-2xl"
                        title="Filtrar Resultados"
                        onClick={() => setIsSortOpen(true)}>
                        <TbFilterSearch />
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} totalCount={totalCount} onPageChange={setCurrentPage} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sneakers.map(sneaker => (
                            <Card key={sneaker?._id} sneaker={sneaker} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} totalCount={totalCount} onPageChange={setCurrentPage} />
                    <Sort isSortOpen={isSortOpen} setIsSortOpen={setIsSortOpen} />
                </>
            )}

        </div>

    );
}