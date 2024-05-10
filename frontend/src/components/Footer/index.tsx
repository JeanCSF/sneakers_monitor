export const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 px-1 text-gray-600 dark:text-gray-400 bottom-0 z-50">
            <div className="text-center">
                <a href="#top" className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    Voltar ao Topo
                </a>
            </div>
            <div className="container mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className="text-2xl">Ícones por Freepik:</h5>
                        <ul>
                            <li><a href="https://br.freepik.com/search?format=search&query=Siipkan%20Creative" target="_blank" rel="noreferrer">Siipkan Creative</a></li>
                            <li><a href="https://br.freepik.com/search?format=search&query=kerismaker" target="_blank" rel="noreferrer">kerismaker</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-2xl">Redes Sociais</h5>
                        <ul>
                            <li><a href="https://www.linkedin.com/in/jean-carlos-6149a2232/" target="_blank" rel="noreferrer">Linkedin</a></li>
                            <li><a href="https://www.facebook.com/fookinselfish/" target="_blank" rel="noreferrer">Facebook</a></li>
                            <li><a href="https://www.instagram.com/cocao.php" target="_blank" rel="noreferrer">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <p className="text-end">
                    Desenvolvido por: <a href="https://github.com/JeanCSF" target="_blank" className="underline" rel="noreferrer">JeanCSF</a> &copy; <span id="currentYear">{new Date().getFullYear()}</span>
                </p>
            </div>
        </footer>
    );
}