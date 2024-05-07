import { useState } from "react";
import { FaGithub } from "react-icons/fa";
export const About: React.FC = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText('00020126580014BR.GOV.BCB.PIX0136946069f0-d048-4606-ae49-3f363f1b40475204000053039865802BR5925Jean Carlos de Santana Fe6009SAO PAULO621405101ePw3KHoui6304FE0A');
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <main className="flex flex-col lg:flex-row justify-between p-4">
            <div className="lg:w-6/12 h-screen">
                <p>
                    Este projeto foi desenvolvido como forma de materializar e aprofundar meus conhecimentos em Node.js e MongoDB.
                    Ao decorrer de seu desenvolvimento, me deparei com a biblioteca Puppeteer, que foi de grande ajuda para a construção do projeto.
                </p>
                <p>
                    Inicialmente, a ideia era que este sistema seria um tipo de monitor de preços focado em tênis. É algo que ainda está nos planos, mas percebi
                    que de certa forma, do jeito que está agora, o projeto consegue suprir parte de sua função principal. Sendo assim, resolvi lançá-lo assim mesmo como um MVP (Minimum Viable Product).
                </p>
                <p>
                    O projeto é totalmente open-source e pretendo que seja assim para sempre. Sendo assim, caso queira contribuir, basta clicar no link do repositório
                    e cloná-lo em sua máquina. Fique à vontade para adicionar mais funcionalidades ou até mesmo criar o seu próprio sistema.
                </p>
                <a target="_blank"
                    className="flex items-center justify-center border-2 text-3xl p-3 hover:bg-gray-400 text-center lg:text-right mt-4 lg:mt-0"
                    href="https://github.com/JeanCSF/sneakers_monitor">Repositório<FaGithub className="ml-2" /></a>
            </div>
            <div className="lg:w-6/12 text-center lg:text-right mt-4 lg:mt-0">
                <p className="text-2xl font-semibold">Contribua com o projeto</p>
                <div className="lg:text-right flex flex-col items-center lg:items-end">
                    <img className="mx-auto lg:ml-auto lg:mr-0 w-2/4 lg:w-2/6" src="qr.png" alt="Pix QR Code" />
                    <button
                        className={`btn btn-primary text-white font-bold text-xl rounded-md w-2/4 lg:w-2/6 mt-4 ${copied ? 'bg-green-500' : 'bg-blue-500'}`}
                        onClick={copyToClipboard}
                    >
                        {copied ? 'Código Copiado!' : 'Copiar Código'}
                    </button>
                </div>
            </div>
        </main>
    );
}