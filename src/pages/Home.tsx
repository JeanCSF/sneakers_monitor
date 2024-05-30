import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading, usePagination } from "../utils/Hooks";
import { FaSearch } from "react-icons/fa";
export const Home: React.FC = () => {
  const { setCurrentPage } = usePagination();
  const { setIsLoading } = useLoading();
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const [placeholder, setPlaceholder] = useState("Modelo, Loja, Marca...");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchError("");
  };

  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    if (!search.trim()) {
      setSearchError("Por favor, digite algo para pesquisar");
      setIsLoading(false);
      return;
    }

    setCurrentPage(1);
    navigate(`/buscar/${search}`);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container flex flex-col mx-auto items-center justify-center h-screen">
      <div className="h-32 w-32 rounded-full shadow-lg">
        <img src="/favicon.ico" alt="snkrmagnet logo" />
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold mt-4">
        <span className="text-red-600 drop-shadow-lg">SNKR</span>{" "}
        <span className="text-blue-600 drop-shadow-lg">MAGNET</span>
      </h1>
      <h2 className="text-sm font-mono italic mb-5 mt-2 text-gray-600 dark:text-gray-400 drop-shadow-md">
        O maior indexador de sneakers do Brasil
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center relative"
      >
        <input
          type="text"
          placeholder={placeholder}
          className="text-xl text-center border border-gray-300 rounded-full w-80 md:w-96 py-2 dark:text-gray-400 shadow-inner"
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setPlaceholder("")}
          onBlur={() => setPlaceholder("Modelo, Loja, Marca...")}
        />
        {searchError && (
          <p className="text-center text-red-500 mt-2">{searchError}</p>
        )}
        <button
          type="submit"
          className="p-2 text-gray-400 rounded-s-full absolute left-0 text-3xl"
        >
          <FaSearch />
        </button>
      </form>
    </div>
  );
};
