import { useEffect, useState } from "react";
import { AppRoutes } from "./utils/AppRoutes";
import { ToggleButton } from "./components/ToggleButton";

import { CiCloudSun } from "react-icons/ci";
import { CiSun } from "react-icons/ci";
function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="flex flex-col justify-between gap-1">
      <div
        onClick={toggleTheme}
        className="fixed right-1 top-14 cursor-pointer flex items-center z-50">
        <CiSun className="w-5 h-5 dark:text-white" /><ToggleButton isDarkMode={isDarkMode} /><CiCloudSun className="w-5 h-5 dark:text-white" />
      </div>
      <AppRoutes />
    </div>
  )
}

export default App
