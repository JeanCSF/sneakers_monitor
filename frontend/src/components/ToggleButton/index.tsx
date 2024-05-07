import { useState, useEffect } from 'react';

type ToggleButtonProps = {
    isDarkMode: boolean;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ isDarkMode }) => {
    const [isActive, setIsActive] = useState(isDarkMode);

    useEffect(() => {
        setIsActive(isDarkMode); // Atualiza o estado do botão quando o tema mudar
    }, [isDarkMode]);

    const toggleButton = () => {
        setIsActive(!isActive);
    };

    return (
        <button
            type="button"
            onClick={toggleButton}
            className={`w-12 h-6 flex items-center rounded-full ${isActive ? 'bg-blue-500 justify-center' : 'bg-gray-300'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${isActive ? 'translate-x-3' : 'translate-x-1'}`}></div>
        </button>
    );
}
