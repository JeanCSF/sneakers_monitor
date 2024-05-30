import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Sneakers } from "../utils/types";
import { useLoading } from "../utils/Hooks";
import { apiClient } from "../utils/api";
import { Card } from "../components/Card";
import { Loading } from "../components/Loading";
import { PriceChart } from "../components/PriceChart";

export const Sneaker: React.FC = () => {
  const { id } = useParams();

  const { isLoading, setIsLoading } = useLoading();

  const [sneaker, setSneaker] = useState<Sneakers | null>(null);
  const [sameSneakerDiferentStore, setSameSneakerDiferentStore] = useState<
    Sneakers[]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    apiClient.get<Sneakers>(`/sneaker/${id}`).then((res) => {
      setSneaker(res.data);
      setIsLoading(false);
    });
  }, [id, setIsLoading]);

  useEffect(() => {
    const setTitle = () => {
      document.title = `${sneaker?.sneakerTitle} - ${sneaker?.productReference} | SNKR MAGNET`;
    }
    const mountSameSneakerDiferentStoreUrl = () => {
      return `/sneakers/search/${sneaker?.productReference.trim()}?`;
    };

    const fetchSameSneakerDiferentStore = async () => {
      try {
        const sameRes = await apiClient.get(
          `${mountSameSneakerDiferentStoreUrl()}limit=16`
        );
        const filteredSameSneakers = sameRes.data.sneakers.filter(
          (similarSneaker: Sneakers) => similarSneaker._id !== sneaker?._id
        );
        setSameSneakerDiferentStore(filteredSameSneakers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (sneaker) {
      fetchSameSneakerDiferentStore();
      setTitle();
    }
  }, [sneaker]);

  const handleLinkClick = () => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <Loading />
      ) : (
        sneaker && (
          <div className="w-full p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-1/2 -translate-x-1/2 p-1 text-center text-xs font-bold sm:hidden top-0 bg-white rounded-b-lg text-black">
                  {sneaker.sneakerTitle}
                </span>
                <img
                  src={sneaker.img}
                  alt={sneaker.sneakerTitle}
                  className="w-96 md:w-full h-auto rounded-lg shadow-md md:mb-0 mx-auto md:mx-0"
                />
                <span className="absolute left-1/2 -translate-x-1/2 p-1 text-sm font-bold sm:hidden bottom-0 bg-white rounded-t-lg text-black">
                  {sneaker.productReference}
                </span>
              </div>
              <div className="flex flex-col justify-between md:justify-normal">
                <h1 className="text-lg hidden sm:block md:text-xl font-bold">
                  {sneaker.sneakerTitle}
                </h1>
                <p className="text-lg font-bold hidden sm:block">
                  Código: {sneaker.productReference && sneaker.productReference}
                </p>
                <div className="flex flex-wrap items-center">
                  {sneaker.brands.map((brand, index) => (
                    <Link
                      to={`/marca/${brand.toLowerCase()}`}
                      key={index}
                      className="text-gray-700 dark:text-gray-300 pe-2 py-1 text-sm font-mono font-semibold mb-2 cursor-pointer mx-auto md:mx-0"
                      title={brand}
                      onClick={handleLinkClick}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/loja/${sneaker.store.toLowerCase()}`}
                  className="overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[300px] font-bold cursor-pointer text-lg md:text-xl"
                  onClick={handleLinkClick}
                >
                  Loja: {sneaker.store}
                </Link>
                <p className="text-lg md:text-xl font-bold">
                  Preço:{" "}
                  {sneaker.currentPrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                {sneaker.discountPrice &&
                  sneaker.discountPrice !== sneaker.currentPrice && (
                    <p className="text-lg md:text-xl font-bold mb-4 text-green-500">
                      C/ Desconto:{" "}
                      {sneaker.discountPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}
                <p className="text-lg md:text-xl font-bold my-4 md:mt-8">
                  Cor(es):
                </p>
                <div className="flex flex-wrap">
                  {sneaker.colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm mr-2 mb-2"
                    >
                      {color}
                    </span>
                  ))}
                </div>
                <p className="text-lg md:text-xl font-bold my-4 md:mt-8">
                  Tamanhos disponíveis:
                </p>
                <div className="flex overflow-x-auto">
                  {sneaker.availableSizes.map((size, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm mr-2 mb-2 h-7 md:h-10 md:text-2xl"
                    >
                      {size}
                    </span>
                  ))}
                </div>
                <a
                  href={sneaker.srcLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver no site"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 text-center text-3xl"
                >
                  VER NA LOJA
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="w-full mx-auto">
                {sneaker.priceHistory.length > 1 && (
                  <PriceChart data={sneaker.priceHistory} />
                )}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold my-8">
              Em Outras Lojas:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4">
              {sameSneakerDiferentStore.length === 0 && (
                <p>Nenhuma ocorrência</p>
              )}
              {isLoading ? (
                <Loading />
              ) : (
                sameSneakerDiferentStore &&
                sameSneakerDiferentStore.map((sameSneakerDiferentStore) => (
                  <Card
                    key={sameSneakerDiferentStore._id}
                    sneaker={sameSneakerDiferentStore}
                  />
                ))
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
