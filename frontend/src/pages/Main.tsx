import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { Card } from "../components/Card";
import { Pagination } from "../components/Pagination";

import { Sneakers } from "../utils/types";

type MainPageProps = {
    route: string;
}

export const Main: React.FC<MainPageProps> = ({ route }) => {
    const { store, brand, category, search } = useParams();

    const [searchParams, setSearchParams] = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const orderBy = e.target.value;
        setOrderBy(orderBy);
        setSearchParams((params) => ({
            ...params,
            orderBy,
            page: '1'
        }));
    };

    let urlParam = '';
    if (store) {
        urlParam = store;
    }
    if (brand) {
        urlParam = brand;
    }
    if (category) {
        urlParam = category;
    }
    if (search) {
        urlParam = search;
    }

    const [sneakers, setSneakers] = useState<Sneakers[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [orderBy, setOrderBy] = useState("price-asc");
    const [totalPages, setTotalPages] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const updateURL = (page: number, orderBy?: string) => {
            setSearchParams((params) => ({
                ...params,
                orderBy: orderBy,
                page: page.toString()
            }));
        };
        const params = new URLSearchParams(window.location.search);
        const page = parseInt(params.get("page") || "1", 10);
        const order = params.get("orderBy");

        if (order) {
            setOrderBy(order);
            updateURL(page, order);
        } else {
            setOrderBy("price-asc");
        }
        setCurrentPage(page);

    }, [setSearchParams]);

    useEffect(() => {

        axios.get(`${search ? `${route}?search=${urlParam}&limit=12&page=${currentPage}&orderBy=${orderBy}` : `${route}/${urlParam}?limit=12&page=${currentPage}&orderBy=${orderBy}`}`)
            .then(response => {
                setSneakers(response.data.sneakers);
                setTotalPages(response.data.totalPages);
                setHasNextPage(response.data.hasNextPage);
                setTotalCount(response.data.totalCount);
            })
            .catch(error => {
                console.error(error);
            });
    }, [route, search, urlParam, orderBy, currentPage]);

    return (
        <div className="container mx-auto px-4 flex flex-col">
            {sneakers.length === 0 && (
                <div className="h-screen">
                    <p className="dark:text-gray-400 flex items-center justify-center">Nenhum resultado para: {urlParam}</p>
                </div>
            )}
            {sneakers.length !== 0 && (
                <>
                    <p className="dark:text-gray-400 flex items-center justify-center">- {urlParam.toUpperCase()} -</p>
                    <div className="flex justify-center items-center mt-4 dark:text-gray-400">
                        <span className="mr-2">Ordenar por:</span>
                        <select
                            className="px-2 py-1 border rounded bg-gray-100 dark:bg-gray-800"
                            onChange={handleChange}
                            value={searchParams.get('orderBy') || ''}
                        >
                            <option value="price-asc">Preço: menor » maior</option>
                            <option value="price-desc">Preço: maior » menor</option>
                            <option value="date-asc">Data: antigo » recente</option>
                            <option value="date-desc">Data: recente » antigo</option>
                        </select>
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} totalCount={totalCount} onPageChange={setCurrentPage} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sneakers.map(sneaker => (
                            <Card key={sneaker._id} sneaker={sneaker} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} hasNextPage={hasNextPage} totalCount={totalCount} onPageChange={setCurrentPage} />
                </>
            )}

        </div>
    );
}