import { useEffect, useMemo, useState } from "react";
import { useCategories } from "../../utils/Hooks";
import { FaBarsStaggered } from "react-icons/fa6";
import { HiOutlineXMark } from "react-icons/hi2";

const logo = "/favicon.ico"
import { Dropdown } from "../Dropdown";
import { Search } from "../Search";

import { ToggleButton } from "../ToggleButton";

import { CiCloudSun } from "react-icons/ci";
import { CiSun } from "react-icons/ci";
import { Item } from "../../utils/types";

export const Navbar: React.FC = () => {
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
        { name: "HOME", link: "/", isDropdown: false },
        { name: "CATEGORIAS", link: "#", isDropdown: true, route: "categoria" },
        { name: "LOJAS", link: "#", isDropdown: true, route: "loja" },
        { name: "MARCAS", link: "#", isDropdown: true, route: "marca" },
        { name: "SOBRE", link: "/sobre", isDropdown: false },
        { name: "API", link: "https://api.snkrmagnet.com.br", isDropdown: false },
    ], []);

    const { categories, stores, brands } = useCategories();

    const [selectedDropdownItems, setSelectedDropdownItems] = useState<Item[]>([]);
    const [dropdownType, setDropdownType] = useState<string>("");

    const [open, setOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="dark:bg-gray-900 bg-gray-100 shadow-md w-full sticky top-0 left-0 z-50">
            <div className="md:px-10 py-4 px-4 md:flex justify-between items-center">
                <a href="/" className="flex text-3xl md:text-xl cursor-pointer items-center gap-2 dark:text-white">
                    <img src={logo} alt="logo" width={48} title="Snkr Magnet" />
                    <span className="font-bold sm:hidden lg:block">SNKR MAGNET</span>
                </a>

                <div
                    onClick={() => setOpen(!open)}
                    className="md:hidden absolute right-4 top-7 cursor-pointer">
                    {open ? <HiOutlineXMark className="w-7 h-7 dark:text-white" /> : <FaBarsStaggered className="w-7 h-7 dark:text-white" />}
                </div>

                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static dark:bg-gray-900 bg-gray-100
                md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? "top-20" : "top-[-490px]"}`}>

                    {links.map((link) => (
                        <li className="my-7 md:my-0 md:ml-1" key={link.name}>
                            <a
                                href={link.link}
                                target={link.name === "API" ? "_blank" : "_self"}
                                title={link.name}
                                className="font-bold p-4 dark:text-white"
                                onMouseEnter={() => {
                                    if (link.isDropdown) {
                                        setIsDropdownOpen(true)
                                        setSelectedDropdownItems(link.route === "categoria" ? categories : link.route === "loja" ? stores : brands);
                                        if (link.route) {
                                            setDropdownType(link.route);
                                        }
                                    }
                                }}
                                onMouseLeave={() => setOpen(false)}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                    <li>
                        <button
                            type="button"
                            className="flex items-center font-bold btn  dark:text-white md:ml-1 rounded md:static p-1 ml-2 md:mb-0 mb-5"
                            title="Buscar"
                            onMouseEnter={() => setIsSearchOpen(true)}
                            onMouseLeave={() => setOpen(false)}>
                            BUSCAR
                        </button>
                    </li>
                    <li>
                        <div
                            onClick={toggleTheme}
                            className="ml-3 cursor-pointer flex items-center z-50">
                            <CiSun className="w-5 h-5 dark:text-white" /><ToggleButton isDarkMode={isDarkMode} /><CiCloudSun className="w-5 h-5 dark:text-white" />
                        </div>
                    </li>
                </ul>
            </div>

            <Dropdown items={selectedDropdownItems} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} dropdownRoute={dropdownType} />
            <Search isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        </header>
    );

}
