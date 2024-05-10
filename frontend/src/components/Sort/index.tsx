import { useSearchParams } from "react-router-dom";
import { HiOutlineXMark } from "react-icons/hi2";
import { usePagination } from "../../utils/Hooks";
type SortProps = {
    isSortOpen: boolean;
    setIsSortOpen: (isSortOpen: boolean) => void;
}

type Colors = {
    [key: string]: string;

};
export const Sort: React.FC<SortProps> = ({ isSortOpen, setIsSortOpen }) => {
    const { setCurrentPage } = usePagination();
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
        ciano: "#00FFFF",
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

    const [searchParams, setSearchParams] = useSearchParams();

    const updateURL = (page: number, orderBy?: string, color?: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (orderBy) {
            newSearchParams.set('orderBy', orderBy);
        }

        if (color) {
            newSearchParams.set('color', color);
        }
        newSearchParams.set('page', page.toString());
        setIsSortOpen(false);
        setCurrentPage(page);
        setSearchParams(newSearchParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (
        <div className="relative">
            <div
                className="bg-gray-100 rounded-md focus:bg-gray-100 dark:focus:bg-gray-500 left-0"
                onMouseEnter={() => setIsSortOpen(true)}>
                {isSortOpen && (
                    <div className={`w-72 md:w-2/5 lg:w-1/4 fixed inset-0 z-auto flex flex-col bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in ${isSortOpen ? "top-20" : "left-[-490px]"}`}>
                        <div className=" bg-gray-100 dark:bg-gray-900 rounded-md p-4 overflow-y-auto max-h-screen">
                            <div onClick={() => setIsSortOpen(!isSortOpen)} className="absolute left-64 top-1 md:left-72 cursor-pointer">
                                <HiOutlineXMark className="w-9 h-9 text-gray-600 dark:text-white" />
                            </div>
                            <div className="flex justify-center items-center my-5 dark:text-gray-400">
                            <span className="text-center font-semibold">Ordenar por:</span>
                                <select
                                    className="px-2 py-1 border rounded bg-gray-100 dark:bg-gray-800 w-36 lg:w-48"
                                    value={searchParams.get('orderBy') || ""}
                                    onChange={(e) => updateURL(1, e.target.value)}
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
                                        className={`block w-full h-9 md:h-8 px-4 py-2 text-left dark:hover:bg-gray-500 hover:bg-gray-300 cursor-pointer border border-gray-400 rounded-md 
                                                    ${color === "uv" ? 'uv-gradient' : ''}
                                                    ${color === "gum" ? 'gum-gradient' : ''}
                                                    ${color === "pantone" ? 'pantone' : ''}
                                                    ${color === "camuflado" ? 'camuflado' : ''}
                                                    ${color === "refletivo" ? 'refletivo-gradient' : ''}
                                                    ${color === "furta-cor" ? 'furtacor-gradient' : ''}
                                                    ${color === "quadriculado" ? 'quadriculado-gradient' : ''}
                                                    ${color === "multicolorido" ? 'multicolorido-gradient' : ''}
                                                    ${color === "animal print" ? 'animalprint' : ''}
                                                    ${color === "glow in the dark" ? 'gitd-gradient' : ''}`}
                                        style={{ backgroundColor: colors[color] }}
                                        title={color}
                                        onClick={() => updateURL(1, '', color)}
                                    >
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