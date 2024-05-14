import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { usePagination, useCategories } from "../../utils/Hooks";

import { HiOutlineXMark } from "react-icons/hi2";
import { TbFilterOff } from "react-icons/tb";

type SortProps = {
    isSortOpen: boolean;
    setIsSortOpen: (isSortOpen: boolean) => void;
}

type Colors = {
    [key: string]: string;

};
export const Sort: React.FC<SortProps> = ({ isSortOpen, setIsSortOpen }) => {
    const { setCurrentPage } = usePagination();
    const { categories, stores, brands } = useCategories();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStores, setSelectedStores] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [orderBy, setOrderBy] = useState<string>("");

    const colors: Colors = {
        azul: "#0000FF",
        cinza: "#808080",
        branco: "#FFFFFF",
        preto: "#000000",
        marrom: "#8B4513",
        verde: "#008000",
        "off-white": "#F5F5F5",
        bege: "#F5F5DC",
        amarelo: "#FFFF00",
        rosa: "#FFC0CB",
        laranja: "#FFA500",
        vermelho: "#FF0000",
        khaki: "#F8D897",
        salmao: "#FA8072",
        vinho: "#800000",
        lilas: "#C8A2C8",
        dourado: "#DAA520",
        prata: "#C0C0C0",
        roxo: "#800080",
        mostarda: "#FFDB58",
        ocre: "#CC7722",
        areia: "#EEE0C7",
        uv: "uv",
        gum: "gum",
        pantone: "pantone",
        camuflado: "camuflado",
        refletivo: "refletivo",
        "furta-cor": "furta-cor",
        quadriculado: "quadriculado",
        multicolorido: "multicolorido",
        "animal print": "animal print",
        "glow in the dark": "glow in the dark",
    };

    const sizes = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17', '17.5', '18', '18.5',
        '19', '20', '21', '22', '22.5', '23', '24', '25', '26', '27',
        '28', '29', '30', '31', '32', '33', '33.5', '34', '34.5', '35',
        '35.5', '36', '36.5', '37', '37.5', '38', '38.5', '39', '39.5', '40',
        '40.5', '41', '41.5', '42', '42.5', '43', '43.5', '44', '44.5', '45',
        '45.5', '46', '47', '48', '49', '50'
    ];

    const toggleColor = (color: string) => {
        if (selectedColors.map((c: string) => c.toLowerCase()).includes(color.toLowerCase())) {
            selectedColors.splice(selectedColors.indexOf(color), 1);
        } else {
            selectedColors.push(color);
        }

        updateURL(1, orderBy, selectedColors, selectedSizes, selectedCategories, selectedStores, selectedBrands);
    };

    const toggleSize = (size: string) => {
        if (selectedSizes.map((c: string) => c).includes(size)) {
            selectedSizes.splice(selectedSizes.indexOf(size), 1);
        } else {
            selectedSizes.push(size);
        }

        updateURL(1, orderBy, selectedColors, selectedSizes, selectedCategories, selectedStores, selectedBrands);
    };

    const toggleCategory = (category: string) => {
        if (selectedCategories.map((c: string) => c.toLowerCase()).includes(category.toLowerCase())) {
            selectedCategories.splice(selectedCategories.indexOf(category), 1);
        } else {
            selectedCategories.push(category);
        }

        updateURL(1, orderBy, selectedColors, selectedSizes, selectedCategories, selectedStores, selectedBrands);
    };

    const toggleStore = (store: string) => {
        if (selectedStores.map((c: string) => c.toLowerCase()).includes(store.toLowerCase())) {
            selectedStores.splice(selectedStores.indexOf(store), 1);
        } else {
            selectedStores.push(store);
        }

        updateURL(1, orderBy, selectedColors, selectedSizes, selectedCategories, selectedStores, selectedBrands);
    };

    const toggleBrand = (brand: string) => {
        if (selectedBrands.map((c: string) => c.toLowerCase()).includes(brand.toLowerCase())) {
            selectedBrands.splice(selectedBrands.indexOf(brand), 1);
        } else {
            selectedBrands.push(brand);
        }

        updateURL(1, orderBy, selectedColors, selectedSizes, selectedCategories, selectedStores, selectedBrands);
    };

    const toggleOrderBy = (orderBy: string) => {
        setOrderBy(orderBy);
        updateURL(1, orderBy, selectedColors, selectedSizes, selectedCategories, selectedStores, selectedBrands);
    };

    const updateURL = (
        page: number,
        orderBy?: string,
        colors?: string[],
        sizes?: string[],
        categories?: string[],
        stores?: string[],
        brands?: string[]
    ) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('page');

        newSearchParams.delete('orderBy');
        if (orderBy) {
            newSearchParams.set('orderBy', orderBy);
        }

        newSearchParams.delete('color');
        if (colors) {
            colors.forEach((color) => newSearchParams.append('color', color));
        }

        newSearchParams.delete('size');
        if (sizes) {
            sizes.forEach((size) => newSearchParams.append('size', size.toString()));
        }

        newSearchParams.delete('category');
        if (categories) {
            categories.forEach((category) => newSearchParams.append('category', category));
        }

        newSearchParams.delete('store');
        if (stores) {
            stores.forEach((store) => newSearchParams.append('store', store));
        }

        newSearchParams.delete('brand');
        if (brands) {
            brands.forEach((brand) => newSearchParams.append('brand', brand));
        }

        newSearchParams.set('page', page.toString());
        setIsSortOpen(false);
        setCurrentPage(page);
        setSearchParams(newSearchParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchSorting = () => {
            const colors = searchParams.getAll('color');
            const sizes = searchParams.getAll('size');
            const categories = searchParams.getAll('category');
            const stores = searchParams.getAll('store');
            const brands = searchParams.getAll('brand');

            setSelectedColors(colors);
            setSelectedSizes(sizes);
            setSelectedCategories(categories);
            setSelectedStores(stores);
            setSelectedBrands(brands);
        }

        fetchSorting();

    }, [searchParams]);

    const resetSort = () => {
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedCategories([]);
        setSelectedStores([]);
        setSelectedBrands([]);
        setOrderBy('');
        updateURL(1);
    }

    return (
        <div className="relative">
            <div
                className="bg-gray-100 rounded-md focus:bg-gray-100 dark:focus:bg-gray-500 left-0"
                onMouseEnter={() => setIsSortOpen(isSortOpen)}>
                {isSortOpen && (
                    <div className={`w-72 md:w-80 fixed inset-0 z-auto flex flex-col bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in ${isSortOpen ? "top-20" : "left-[-490px]"}`}>
                        <div className=" bg-gray-100 dark:bg-gray-900 rounded-md p-4 overflow-y-auto max-h-screen">
                            <div className="flex justify-between">
                                <div
                                    className="cursor-pointer"
                                    onClick={() => resetSort()}
                                    title="Limpar filtros"
                                >
                                    <TbFilterOff className="w-9 h-9 text-gray-600 dark:text-white" />
                                </div>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    title="Fechar"
                                >
                                    <HiOutlineXMark className="w-9 h-9 text-gray-600 dark:text-white" />
                                </div>
                            </div>
                            <p className="text-center font-semibold">Ordenar por:</p>
                            <div className="flex justify-center items-center mb-5 dark:text-gray-400">
                                <select
                                    className="px-1 py-1 border rounded bg-gray-100 dark:bg-gray-800 w-64"
                                    value={searchParams.get('orderBy') || ""}
                                    onChange={(e) => toggleOrderBy(e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    <option value="price-asc">Preço: menor » maior</option>
                                    <option value="price-desc">Preço: maior » menor</option>
                                    <option value="date-asc">Data: antigo » recente</option>
                                    <option value="date-desc">Data: recente » antigo</option>
                                </select>
                            </div>
                            <p className="text-center font-semibold">Filtrar cor:</p>
                            <div className="grid md:grid-cols-7 grid-cols-5 gap-3 ">
                                {Object.keys(colors).map(color => (
                                    <button
                                        key={color}
                                        className={`block w-full h-9 md:h-8 px-4 py-2 text-left dark:hover:bg-gray-500 hover:bg-gray-300 cursor-pointer border border-gray-400 rounded-md opacity-50
                                                    ${color === "uv" ? 'uv-gradient' : ''}
                                                    ${color === "gum" ? 'gum-gradient' : ''}
                                                    ${color === "pantone" ? 'pantone' : ''}
                                                    ${color === "camuflado" ? 'camuflado' : ''}
                                                    ${color === "refletivo" ? 'refletivo-gradient' : ''}
                                                    ${color === "furta-cor" ? 'furtacor-gradient' : ''}
                                                    ${color === "quadriculado" ? 'quadriculado-gradient' : ''}
                                                    ${color === "multicolorido" ? 'multicolorido-gradient' : ''}
                                                    ${color === "animal print" ? 'animalprint' : ''}
                                                    ${color === "glow in the dark" ? 'gitd-gradient' : ''}
                                                    ${selectedColors.includes(color) ? 'transform scale-110 px-3 py-1 opacity-100' : ''}`}
                                        style={{ backgroundColor: colors[color] }}
                                        title={color}
                                        onClick={() => toggleColor(color)}
                                    >
                                    </button>
                                ))}
                            </div>
                            <p className="text-center font-semibold mt-5">Filtrar tamanho:</p>
                            <div className="grid md:grid-cols-7 grid-cols-5 gap-3 ">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`flex items-center justify-center w-full h-9 md:h-8 px-4 py-2 text-left dark:hover:bg-gray-500 hover:bg-gray-300 cursor-pointer border border-gray-400 font-semibold ${selectedSizes.includes(size) ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => toggleSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center font-semibold mt-5">Filtrar categoria:</p>
                            <div className="grid grid-cols-2 h-80 gap-1 overflow-y-auto text-center">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        className={`w-28 text-center text-xs py-2 dark:hover:bg-gray-500 hover:bg-gray-300 cursor-pointer border border-gray-400 rounded-md
                                                    ${selectedCategories.includes(category.name.toLowerCase()) ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => toggleCategory(category.name.toLowerCase())}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center font-semibold mt-5">Filtrar loja:</p>
                            <div className="grid grid-cols-2 h-80 gap-1 overflow-y-auto text-center">
                                {stores.map(store => (
                                    <button
                                        key={store.id}
                                        className={`w-full text-center text-xs px-1 py-2 dark:hover:bg-gray-500 hover:bg-gray-300 cursor-pointer border border-gray-400 rounded-md overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[180px]
                                                    ${selectedStores.includes(store.name.toLowerCase()) ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => toggleStore(store.name.toLowerCase())}
                                    >
                                        {store.name}
                                    </button>
                                ))}
                            </div>
                            <p className="text-center font-semibold mt-5">Filtrar marca:</p>
                            <div className="grid grid-cols-2 h-80 gap-1 overflow-y-auto text-center">
                                {brands.map(brand => (
                                    <button
                                        key={brand.id}
                                        className={`w-full text-center text-xs py-2 dark:hover:bg-gray-500 hover:bg-gray-300 cursor-pointer border border-gray-400 rounded-md
                                                    ${selectedBrands.includes(brand.name.toLowerCase()) ? 'bg-blue-500 text-white' : ''}`}
                                        onClick={() => toggleBrand(brand.name.toLowerCase())}
                                    >
                                        {brand.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}