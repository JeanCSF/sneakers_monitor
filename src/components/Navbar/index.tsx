import { useState } from "react";

import { Search } from "../Search";

const logo = "/favicon.ico";
import { HiOutlineXMark } from "react-icons/hi2";
import { FaSearch } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";
import { useLoading, usePagination } from "../../utils/Hooks";
import { useNavigate, useLocation } from "react-router-dom";

export const Navbar: React.FC = () => {
  const { setCurrentPage } = usePagination();
  const { setIsLoading } = useLoading();
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchError("");
  };

  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    setSearch("");
    setIsLoading(true);
    e.preventDefault();

    if (!search.trim()) {
      setSearchError("Por favor, digite algo para pesquisar");
      setIsLoading(false);
      return;
    }

    setCurrentPage(1);
    setIsSearchOpen(false);
    navigate(`/buscar/${search}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const location = useLocation();

  return (
    <header
      className="dark:bg-gray-900 bg-gray-100 shadow-md w-full sticky top-0 left-0 z-50"
      style={{ display: location.pathname !== "/" ? "block" : "none" }}
    >
      <div className="md:px-10 py-4 px-4 md:flex justify-between items-center">
        <a
          href="/"
          className="md:flex text-3xl md:text-xl cursor-pointer items-center gap-2 dark:text-white z-50"
        >
          <img src={logo} alt="logo" width={48} title="Snkr Magnet" />
          <span className="font-bold hidden lg:block">SNKR MAGNET</span>
        </a>

        <form className="hidden md:flex ml-auto" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Pesquisar"
            className="ml-auto rounded w-96 px-4 py-1 dark:text-gray-400"
            onChange={handleSearchChange}
            value={search}
          />
          {searchError && (
            <p className="text-red-500 absolute top-20 ml-14">{searchError}</p>
          )}
          <button type="submit" className="ml-2" onClick={handleSubmit}>
            {" "}
            <FaSearch className="w-5 h-5" />
          </button>
        </form>
        <ul className="flex absolute top-5 right-3 md:static">
          <li>
            <button>
              <FaSearch
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 dark:text-white md:hidden"
              />
            </button>
          </li>
        </ul>
        <div
          onClick={() => setOpen(!open)}
          className="hidden absolute right-4 top-7 cursor-pointer"
        >
          {open ? (
            <HiOutlineXMark className="w-7 h-7 dark:text-white" />
          ) : (
            <FaBarsStaggered className="w-7 h-7 dark:text-white" />
          )}
        </div>
      </div>
      <Search isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
    </header>
  );
};
