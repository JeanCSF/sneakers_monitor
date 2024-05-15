import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { useSneakers, usePagination, useLoading } from "../utils/Hooks";
import { Sneakers } from "../utils/types";

import { Card } from "../components/Card";
import { Pagination } from "../components/Pagination";
import { Sort } from "../components/Sort";
import { Loading } from "../components/Loading";

import { TbFilterSearch } from "react-icons/tb";

type MainPageProps = {
    route: string;
}

export const Main: React.FC<MainPageProps> = ({ route }) => {
    const {
        totalPages,
        hasNextPage,
        totalCount,
        setCurrentPage,
        setTotalPages,
        setHasNextPage,
        setTotalCount
    } = usePagination();
    const { isLoading, setIsLoading } = useLoading();

    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const orderBy = searchParams.get('orderBy') || undefined;
    const colors = searchParams.getAll('color') || undefined;
    const sizes = searchParams.getAll('size') || undefined;
    const categories = searchParams.getAll('category') || undefined;
    const stores = searchParams.getAll('store') || undefined;
    const brands = searchParams.getAll('brand') || undefined;
    const minPrice = searchParams.get('minPrice') || undefined;
    const maxPrice = searchParams.get('maxPrice') || undefined;

    const { store, brand, category, search } = useParams<{ store?: string; brand?: string; category?: string; search?: string }>();
    const urlParam = store || brand || category || search;
    const [isSortOpen, setIsSortOpen] = useState(false);

    const [sneakers, setSneakers] = useState<Sneakers[]>([]);

    const url = `${urlParam ? `${route}/${urlParam}` : `${route}`}`;
    const getSneakers = useSneakers(url, currentPage, search, orderBy, colors, sizes, categories, stores, brands, minPrice, maxPrice);

    useEffect(() => {
        if (getSneakers.data) {
            setSneakers(getSneakers.data.sneakers);
            setTotalPages(getSneakers.data.totalPages);
            setHasNextPage(getSneakers.data.hasNextPage);
            setTotalCount(getSneakers.data.totalCount);
            setCurrentPage(getSneakers.data.currentPage);
            setIsLoading(false);
        }
    }, [getSneakers.data, setCurrentPage, setTotalPages, setHasNextPage, setTotalCount, setIsLoading, currentPage]);


    return (
        <div className="container mx-auto px-1 md:px-4 flex flex-col">
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {sneakers.length === 0 && (
                        <div className="h-screen flex flex-col justify-center items-center">
                            <p className="dark:text-gray-400">Sem resultados para os filtros aplicados</p>
                            <p
                                className="p-1 rounded text-center cursor-pointer bg-blue-400 text-white"
                                onClick={() => window.history.back()}
                            >
                                Voltar
                            </p>
                        </div>
                    )}
                    {sneakers.length !== 0 && (
                        <>
                            <div
                                className="flex dark:text-gray-400 rounded md:static cursor-pointer text-3xl"
                                title="Filtrar Resultados"
                                onClick={() => setIsSortOpen(true)}
                            >
                                <TbFilterSearch />
                            </div>
                            <p className="dark:text-gray-400 flex items-center justify-center">- {urlParam?.toUpperCase()} -</p>
                            <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} totalCount={totalCount} onPageChange={setCurrentPage} />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-3 md:gap-x-4">
                                {sneakers.map(sneaker => (
                                    <Card key={sneaker?._id} sneaker={sneaker} />
                                ))}
                            </div>
                            <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} totalCount={totalCount} onPageChange={setCurrentPage} />
                            <Sort isSortOpen={isSortOpen} setIsSortOpen={setIsSortOpen} />
                        </>
                    )}
                </>
            )}
        </div>
    );

}