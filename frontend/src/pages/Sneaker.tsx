import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sneakers } from "../utils/types";
import { apiClient } from "../utils/api";
import { Card } from "../components/Card";

export const Sneaker: React.FC = () => {
    const { id } = useParams();

    const [sneaker, setSneaker] = useState<Sneakers | null>(null);
    const [sameSneakerDiferentStore, setSameSneakerDiferentStore] = useState<Sneakers[]>([]);

    useEffect(() => {
        apiClient.get<Sneakers>(`/sneaker/${id}`).then((res) => {
            setSneaker(res.data);
        });
    }, [id]);


    useEffect(() => {
        const mountSameSneakerDiferentStoreUrl = () => {
            return `/sneakers/search/${sneaker?.productReference.trim()}?`
        }

        const fetchSameSneakerDiferentStore = async () => {
            try {
                const sameRes = await apiClient.get(`${mountSameSneakerDiferentStoreUrl()}limit=16`);
                const filteredSameSneakers = sameRes.data.sneakers.filter((similarSneaker: Sneakers) => similarSneaker._id !== sneaker?._id);
                setSameSneakerDiferentStore(filteredSameSneakers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (sneaker) {
            fetchSameSneakerDiferentStore();
        }

    }, [sneaker]);

    return (
        <div className="flex flex-col">
            {sneaker && (
                <div className="w-full p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <img
                            src={sneaker.img}
                            alt={sneaker.sneakerTitle}
                            className="w-96 h-auto rounded-lg shadow-md mb-8 md:mb-0 mx-auto md:mx-0" />
                        <div className="flex flex-col justify-between">
                            <h1 className="text-lg md:text-xl font-bold">{sneaker.sneakerTitle}</h1>
                            <p className="text-lg font-bold">Código: {sneaker.productReference && sneaker.productReference}</p>
                            <div className="flex flex-wrap items-center">
                                {sneaker.brands.map((brand, index) => (
                                    <Link to={`/marca/${brand.toLowerCase()}`}
                                        key={index}
                                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer"
                                        title={brand}
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    >
                                        {brand}
                                    </Link>
                                ))}
                            </div>
                            <Link to={`/loja/${sneaker.store.toLowerCase()}`}
                                className="overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[300px] cursor-pointer mt-4 text-lg md:text-xl"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                Loja: {sneaker.store}
                            </Link>
                            <p className="text-lg md:text-xl font-bold">Preço: {sneaker.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            {sneaker.discountPrice && sneaker.discountPrice !== sneaker.currentPrice && (
                                <p className="text-lg md:text-xl font-bold mb-4 text-green-500">C/ Desconto: {sneaker.discountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                            )}
                            <p className="text-lg md:text-xl font-bold my-4 md:mt-8">Cor(es):</p>
                            <div className="flex flex-wrap">
                                {sneaker.colors.map((color, index) => (
                                    <span key={index} className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm mr-2 mb-2">{color}</span>
                                ))}
                            </div>
                            <p className="text-lg md:text-xl font-bold my-4 md:mt-8">Tamanhos disponíveis:</p>
                            <div className="flex overflow-x-auto">
                                {sneaker.availableSizes.map((size, index) => (
                                    <span key={index} className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm mr-2 mb-2 h-7 md:h-10 md:text-2xl">{size}</span>
                                ))}
                            </div>
                            <a href={sneaker.srcLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Ver no site"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 text-center text-3xl">
                                VER NA LOJA
                            </a>
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold my-8">Em Outras Lojas:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {sameSneakerDiferentStore.length === 0 && <p>Nenhuma ocorrência</p>}
                        {sameSneakerDiferentStore && sameSneakerDiferentStore.map(sameSneakerDiferentStore => (
                            <Card key={sameSneakerDiferentStore._id} sneaker={sameSneakerDiferentStore} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

}
