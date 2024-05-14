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
                        <h5 className="text-2xl p-5">Ícones por Freepik:</h5>
                        <ul className="text-lg">
                            <li><a href="https://br.freepik.com/search?format=search&query=Siipkan%20Creative" target="_blank" rel="noreferrer" className="p-5">Siipkan Creative</a></li>
                            <li><a href="https://br.freepik.com/search?format=search&query=kerismaker" target="_blank" rel="noreferrer" className="p-5">kerismaker</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-2xl p-5">Redes Sociais</h5>
                        <ul className="text-lg">
                            <li><a href="https://www.linkedin.com/in/jean-carlos-6149a2232/" target="_blank" rel="noreferrer" className="p-5">Linkedin</a></li>
                            <li><a href="https://www.facebook.com/fookinselfish/" target="_blank" rel="noreferrer" className="p-5">Facebook</a></li>
                            <li><a href="https://www.instagram.com/cocao.php" target="_blank" rel="noreferrer" className="p-5">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <p className="text-end text-lg">
                    Desenvolvido por: <a href="https://github.com/JeanCSF" target="_blank" className="underline" rel="noreferrer">JeanCSF</a> &copy; <span id="currentYear">{new Date().getFullYear()}</span>
                </p>
            </div>
        </footer>
    );
}