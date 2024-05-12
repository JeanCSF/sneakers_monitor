import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePagination } from "../../utils/Hooks";

import { FaSearch } from "react-icons/fa";
import { HiOutlineXMark } from "react-icons/hi2";

type SearchProps = {
    isSearchOpen: boolean;
    setIsSearchOpen: (isDropdownOpen: boolean) => void;
}

export const Search: React.FC<SearchProps> = ({ isSearchOpen, setIsSearchOpen }) => {
    const { setCurrentPage } = usePagination();
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!search) return;

        setCurrentPage(1);
        navigate(`/buscar/${search}`);
        setIsSearchOpen(false);
        setSearch("");
        window.scrollTo({ top: 0, behavior: 'smooth' })
    };

    return (
        <div className="relative">
            <div
                className="w-full bg-gray-100 rounded-md focus:bg-gray-100 dark:focus:bg-gray-500"
                onMouseEnter={() => setIsSearchOpen(true)} onMouseLeave={() => setIsSearchOpen(false)}>
                {isSearchOpen && (
                    <div className={`rounded-md p-4 fixed inset-0 md:z-auto z-[-1] justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in ${isSearchOpen ? "top-20" : "top-[-490px]"}`}>
                        <div className="w-full bg-gray-100 dark:bg-gray-900 top-3">
                            <div onClick={() => setIsSearchOpen(!isSearchOpen)} className="absolute right-1 top-1 md:right-3 cursor-pointer">
                                <HiOutlineXMark className="w-7 h-7 text-gray-600 dark:text-white" />
                            </div>
                            <form className="flex mt-3" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Digite um modelo específico"
                                    className="border bg-gray-100 dark:bg-gray-800 border-gray-300 rounded-md px-4 py-2 mr-2 focus:outline-none dark:text-gray-400 w-full"
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-400 dark:bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none"

                                >
                                    <FaSearch />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}