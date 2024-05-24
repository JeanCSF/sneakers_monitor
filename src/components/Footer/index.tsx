import { FaInstagram, FaFacebookSquare, FaLinkedin, FaGithub } from "react-icons/fa";
export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 px-1 text-gray-600 dark:text-gray-400 bottom-0">
            <div className="text-center">
                <a href="#top" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    Voltar ao Topo
                </a>
            </div>
            <div className="container mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className="text-2xl">Ícones por Freepik:</h5>
                        <ul className="text-xl">
                            <li>
                                <a href="https://br.freepik.com/search?format=search&query=Siipkan%20Creative" target="_blank" rel="noreferrer">Siipkan Creative</a>
                            </li>
                            <li>
                                <a href="https://br.freepik.com/search?format=search&query=kerismaker" target="_blank" rel="noreferrer">kerismaker</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-2xl">Redes Sociais</h5>
                        <ul>
                            <li className="flex">
                                <a href="https://www.instagram.com/snkrmagnet.com.br" target="_blank" rel="noreferrer" className="text-3xl mr-2"><FaInstagram /></a>
                                <a href="https://www.facebook.com/profile.php?id=61559120139133" target="_blank" rel="noreferrer" className="text-3xl mr-2"><FaFacebookSquare /></a>
                            </li>
                        </ul>
                    </div>
                </div>
                    <p className="flex justify-end items-center mt-5 text-xl">
                        Desenvolvido por: JeanCSF &copy;<span className="ml-1" id="currentYear">{new Date().getFullYear()}</span>
                    </p>
                <div className="flex justify-end items-center right-0">
                    <a href="https://www.linkedin.com/in/jean-carlos-6149a2232" target="_blank" rel="noreferrer" className="text-3xl mr-2"><FaLinkedin /></a>
                    <a href="https://www.github.com/JeanCSF" target="_blank" rel="noreferrer" className="text-3xl mr-2"><FaGithub /></a>
                    <a href="https://www.instagram.com/cocao.php" target="_blank" rel="noreferrer" className="text-3xl mr-2"><FaInstagram /></a>
                    <a href="https://www.facebook.com/fookinselfish" target="_blank" rel="noreferrer" className="text-3xl mr-2"><FaFacebookSquare /></a>
                </div>
            </div>
        </footer >
    );
}