import { useNavigate } from "react-router-dom";
import { Sneakers } from "../../utils/types";

interface CardProps {
    sneaker: Sneakers;
}

export const Card: React.FC<CardProps> = ({ sneaker }) => {
    const navigate = useNavigate();
    return (
        <div className="w-full p-4">
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-md">
                <img
                    src={sneaker.img}
                    alt={sneaker.sneakerTitle}
                    className="w-full h-72 object-cover rounded-t-md cursor-pointer"
                    onClick={() => {
                        navigate(`/sneaker/${sneaker._id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 dark:text-white h-12 overflow-hidden cursor-pointer" onClick={() => navigate(`/sneaker/${sneaker._id}`)}>{sneaker.sneakerTitle}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-2 flex justify-between items-center">
                        <span
                            className="overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[100px] cursor-pointer"
                            onClick={() => {
                                navigate(`/loja/${sneaker.store.toLowerCase()}`);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            {sneaker.store}
                        </span>

                        <a
                            href={sneaker.srcLink}
                            className="bg-blue-200 text-gray-600 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                            title="Ver no site"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ver na loja
                        </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{sneaker.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <p className="text-green-500 mb-4">{sneaker.discountPrice && sneaker.discountPrice !== sneaker.currentPrice && `C/ Desconto: ${sneaker.discountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}</p>
                    <div className="flex flex-wrap items-center">
                        {sneaker.brands.map((brand, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm mr-2 mb-2 cursor-pointer"
                                title={brand}
                                onClick={() => {
                                    navigate(`/marca/${brand.toLowerCase()}`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                    <div className="flex overflow-x-auto mt-4">
                        {sneaker.availableSizes.map((size, index) => (
                            <span key={index} className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm mr-2 mb-2 h-7">{size}</span>
                        ))}
                        {sneaker.availableSizes.length < 5 && (
                            <span className="opacity-0 mt-7">ovo</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};