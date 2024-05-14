import { Link } from "react-router-dom";
import { Sneakers } from "../../utils/types";

interface CardProps {
    sneaker: Sneakers;
}

export const Card: React.FC<CardProps> = ({ sneaker }) => {
    return (
        <div className="w-full">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-md shadow-md">
                <div className="relative">
                    <Link to={`/sneaker/${sneaker._id}`}>
                        <img
                            src={sneaker.img}
                            alt={sneaker.sneakerTitle}
                            className="w-full h-48 md:h-64 lg:h-72 xl:h-80 object-bottom object-cover rounded-md cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        />
                    </Link>
                    <a
                        href={sneaker.srcLink}
                        className="text-sm bg-blue-200 text-gray-600 px-1 py-1 font-semibold rounded-md mr-1 absolute top-1 right-0"
                        title="Ver no site"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Ver na loja
                    </a>
                    <p
                        className="text-gray-600 text-sm rounded-md px-1 py-1 font-semibold ml-1 absolute top-1 left-0 bg-gray-200"
                        title="Preço atual"
                    >
                        {sneaker.currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    {sneaker.discountPrice && sneaker.discountPrice !== sneaker.currentPrice && (
                        <p
                            className="text-green-500 text-sm rounded-md px-1 py-1 font-semibold mb-1 ml-1 absolute bottom-1 left-0 bg-gray-200"
                            title="Preço com desconto"
                        >
                            {sneaker.discountPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    )}
                </div>
                <div className="p-1 md:p-3">
                    <p className="text-gray-600 dark:text-gray-400 mb-1 flex">
                        <Link to={`/sneaker/${sneaker._id}`}
                            className="font-semibold mb-1 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[180px] md:max-w-[300px] cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            {sneaker.sneakerTitle}
                        </Link>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-2 flex justify-between items-center">
                        <Link to={`/loja/${sneaker.store.toLowerCase()}`}
                            className="overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[180px] cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}

                        >
                            {sneaker.store}
                        </Link>
                    </p>
                    <div className="flex flex-wrap items-center">
                        {sneaker.brands.map((brand, index) => (
                            <Link to={`/marca/${brand.toLowerCase()}`}
                                key={index}
                                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full mr-2 mb-2 cursor-pointer"
                                title={brand}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}

                            >
                                {brand}
                            </Link>
                        ))}
                    </div>
                    <div className="flex overflow-x-auto mt-4 mx-2">
                        {sneaker.availableSizes.map((size, index) => (
                            <span key={index} className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm mr-2 mb-2 h-7">{size}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};