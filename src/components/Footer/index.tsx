import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookSquare,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

import { ToggleButton } from "../ToggleButton";
import { CiSun } from "react-icons/ci";
import { CiCloudSun } from "react-icons/ci";

export const Footer: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 px-1 text-gray-600 dark:text-gray-400 bottom-0">
      <div className="text-center">
        <a
          href="#top"
          className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          Voltar ao Topo
        </a>
      </div>
      <div className="container mt-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <h5 className="text-2xl">Ícones por Freepik:</h5>
            <ul className="text-xl">
              <li>
                <a
                  href="https://br.freepik.com/search?format=search&query=Siipkan%20Creative"
                  target="_blank"
                  rel="noreferrer"
                  role="link"
                  title="Siipkan Creative"
                >
                  Siipkan Creative
                </a>
              </li>
              <li>
                <a
                  href="https://br.freepik.com/search?format=search&query=kerismaker"
                  target="_blank"
                  rel="noreferrer"
                  role="link"
                  title="kerismaker"
                >
                  kerismaker
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-2xl">Redes Sociais</h5>
            <ul>
              <li className="flex">
                <a
                  href="https://www.instagram.com/snkrmagnet.com.br"
                  target="_blank"
                  rel="noreferrer"
                  className="text-3xl mr-2"
                  role="link"
                  title="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61559120139133"
                  target="_blank"
                  rel="noreferrer"
                  className="text-3xl mr-2"
                  role="link"
                  title="Facebook"
                >
                  <FaFacebookSquare />
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-2xl">Informações</h5>
            <ul className="text-xl">
              <li>
                <Link
                  to="/sobre"
                  className="text-xl"
                  role="link"
                  title="Sobre o Site"
                  onClick={handleLinkClick}
                >
                  Sobre o Site
                </Link>
              </li>
              <li>
                <a
                  href="https://api.snkrmagnet.com.br"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xl"
                  role="link"
                  title="API"
                >
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-2xl">Tema</h5>
            <div
              onClick={toggleTheme}
              className="cursor-pointer flex items-center gap-1 z-50"
            >
              <CiSun className="w-5 h-5 dark:text-white" />
              <ToggleButton isDarkMode={isDarkMode} />
              <CiCloudSun className="w-5 h-5 dark:text-white" />
            </div>
          </div>
        </div>
        <p className="flex justify-end items-center mt-5 text-xl">
          Desenvolvido por: JeanCSF &copy;
          <span className="ml-1" id="currentYear">
            {new Date().getFullYear()}
          </span>
        </p>
        <div className="flex justify-end items-center right-0">
          <a
            href="https://www.linkedin.com/in/jean-carlos-6149a2232"
            target="_blank"
            rel="noreferrer"
            className="text-3xl mr-2"
            role="link"
            title="Linkedin"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.github.com/JeanCSF"
            target="_blank"
            rel="noreferrer"
            className="text-3xl mr-2"
            role="link"
            title="Github"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.instagram.com/cocao.php"
            target="_blank"
            rel="noreferrer"
            className="text-3xl mr-2"
            role="link"
            title="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/fookinselfish"
            target="_blank"
            rel="noreferrer"
            className="text-3xl mr-2"
            role="link"
            title="Facebook"
          >
            <FaFacebookSquare />
          </a>
        </div>
      </div>
    </footer>
  );
};
