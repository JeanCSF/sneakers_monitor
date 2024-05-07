import { HiOutlineXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

export type DropdownItem = {
    id: number;
    name: string;
}

type DropdownProps = {
    items: DropdownItem[];
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isDropdownOpen: boolean) => void;
    dropdownRoute: string;

}

export const Dropdown: React.FC<DropdownProps> = ({ items, isDropdownOpen, setIsDropdownOpen, dropdownRoute }) => {
    const navigate = useNavigate();
    const handleBtnClick = (item: string) => {
        navigate(`/${dropdownRoute}/${item.toLowerCase()}`);
        setIsDropdownOpen(false);
    }
    return (
        <div className="relative">
            <div
                className="w-full bottom-0 bg-gray-100 rounded-md focus:bg-gray-100 dark:focus:bg-gray-500"
                onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                {isDropdownOpen && (
                    <div className={`fixed inset-0 md:z-auto z-[-1] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-all duration-500 ease-in ${isDropdownOpen ? "top-20" : "top-[-490px]"}`}>
                        <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-md p-4 overflow-y-auto max-h-screen">
                            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="absolute right-1 top-1 md:right-3 cursor-pointer">
                                <HiOutlineXMark className="w-7 h-7 text-gray-600 dark:text-white" />
                            </div>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 md:gap-0">
                                {items.map(item => (
                                    <button
                                        key={item.id}
                                        className="block w-full px-4 py-2 text-left dark:hover:bg-gray-500 hover:bg-gray-300 font-semibold cursor-pointer"
                                        onClick={() => handleBtnClick(item.name)}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

