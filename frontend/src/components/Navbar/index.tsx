import { useEffect, useMemo, useState } from "react";

import { Search } from "../Search";
import { ToggleButton } from "../ToggleButton";

const logo = "/favicon.ico"
import { CiSun } from "react-icons/ci";
import { CiCloudSun } from "react-icons/ci";
import { VscJson } from "react-icons/vsc";
import { HiOutlineXMark } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import { FaBarsStaggered, FaCircleInfo } from "react-icons/fa6";
import { useLoading, usePagination } from "../../utils/Hooks";
import { useNavigate } from "react-router-dom";

export const Navbar: React.FC = () => {
    const { setCurrentPage } = usePagination();
    const { setIsLoading } = useLoading();
    const [search, setSearch] = useState("");
    const [searchError, setSearchError] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSearchError('');
    };

    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        setSearch("");
        setIsLoading(true);
        e.preventDefault();

        if (!search.trim()) {
            setSearchError('Por favor, digite algo para pesquisar');
            setIsLoading(false);
            return;
        }

        setCurrentPage(1);
        setIsSearchOpen(false);
        navigate(`/buscar/${search}`);
        window.scrollTo({ top: 0, behavior: 'smooth' })
    };
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const links = useMemo(() => [
        { name: "HOME", link: "/" },
        { name: "SOBRE", link: "/sobre" },
        { name: "API", link: "https://api.snkrmagnet.com.br" },
        { name: "BUSCAR", link: "#" }
    ], []);

    const [open, setOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="dark:bg-gray-900 bg-gray-100 shadow-md w-full sticky top-0 left-0 z-50">
            <div className="md:px-10 py-4 px-4 md:flex justify-between items-center">
                <a href="/" className="md:flex text-3xl md:text-xl cursor-pointer items-center gap-2 dark:text-white z-50">
                    <img src={logo} alt="logo" width={48} title="Snkr Magnet" />
                    <span className="font-bold hidden lg:block">SNKR MAGNET</span>
                </a>

                <form className="hidden md:flex mx-auto" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        className="ml-2 rounded w-96 px-4 py-1 dark:text-gray-400"
                        onChange={handleSearchChange}
                        value={search} />
                    {searchError && <p className="text-red-500 absolute top-20 ml-14" >{searchError}</p>}
                    <button type="submit" className="ml-2" onClick={handleSubmit}> <FaSearch className="w-5 h-5" /></button>
                </form>
                <ul className="flex absolute top-7 right-16 md:static">
                    {links.map((link) => (
                        <li className="md:ml-1 mr-8" key={link.name}>
                            <a
                                href={link.link}
                                target={link.name === "API" ? "_blank" : "_self"}
                                title={link.name}
                                className="font-bold md:p-4 dark:text-white flex items-center" // Adicionei a classe flex e items-center
                                onMouseEnter={link.name === "BUSCAR" ? () => setIsSearchOpen(true) : () => void 0}
                                onMouseLeave={link.name === "BUSCAR" ? () => setIsSearchOpen(false) : () => void 0}
                            >
                                <span className={`hidden ml-3 ${link.name === "BUSCAR" ? "md:hidden" : "md:block"}`}>{link.name}</span>
                                <span className={`md:hidden text-3xl ${link.name === "HOME" ? "hidden mr-0" : ""}`}>
                                    {link.name === "SOBRE" ? <FaCircleInfo /> : link.name === "API" ? <VscJson /> : <FaSearch />}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static dark:bg-gray-900 bg-gray-100 rounded-md
                md:z-auto z-[-1] right-0 w-1/2 md:w-auto md:pl-0 pl-9 transition-all duration-400 ease-in ${open ? "top-20" : "top-[-490px]"}`}>
                    <li>
                        <div
                            onClick={toggleTheme}
                            className="ml-auto cursor-pointer flex items-center justify-center z-50 mt-3">
                            <CiSun className="w-5 h-5 dark:text-white" /><ToggleButton isDarkMode={isDarkMode} /><CiCloudSun className="w-5 h-5 dark:text-white" />
                        </div>
                    </li>
                </ul>
                <div
                    onClick={() => setOpen(!open)}
                    className="md:hidden absolute right-4 top-7 cursor-pointer">
                    {open ? <HiOutlineXMark className="w-7 h-7 dark:text-white" /> : <FaBarsStaggered className="w-7 h-7 dark:text-white" />}
                </div>
            </div>
            <Search isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        </header>
    );

}


