import { useState } from "react";

export const About: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const stores = [
    {
      name: "Adidas",
      link: "https://www.adidas.com.br/",
    },
    {
      name: "Artwalk",
      link: "https://www.artwalk.com.br/",
    },
    {
      name: "Asics",
      link: "https://www.asics.com.br/",
    },
    {
      name: "Corre de Rua - CDR",
      link: "https://www.cdr.com.br/",
    },
    {
      name: "Guadalupe Store - GDLP",
      link: "https://www.gdlp.com.br/",
    },
    {
      name: "Loja Virus 41",
      link: "https://www.lojavirus.com.br/",
    },
    {
      name: "Maze",
      link: "https://www.maze.com.br/",
    },
    {
      name: "Netshoes",
      link: "https://www.netshoes.com.br/",
    },
    {
      name: "Nike",
      link: "https://www.nike.com.br/",
    },
    {
      name: "Ostore",
      link: "https://www.ostore.com.br/",
    },
    {
      name: "Ratus Skate Shop",
      link: "https://www.ratusskateshop.com.br/",
    },
    {
      name: "Sunika",
      link: "https://www.sunika.com.br/",
    },
    {
      name: "Sunset Skate Shop",
      link: "https://www.sunsetskateshop.com.br/",
    },
    {
      name: "Walls General Store",
      link: "https://www.wallsgeneralstore.com.br/",
    },
    {
      name: "Your ID Store",
      link: "https://www.youridstore.com.br/",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      "00020126580014BR.GOV.BCB.PIX0136946069f0-d048-4606-ae49-3f363f1b40475204000053039865802BR5925Jean Carlos de Santana Fe6009SAO PAULO621405101ePw3KHoui6304FE0A"
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-col lg:flex-row justify-between p-1 flex-grow">
        <div className="lg:w-6/12 p-4">
          <h1 className="text-4xl text-center font-bold text-gray-800 dark:text-gray-200">
            Como funciona
          </h1>
          <div className="grid mt-4 text-center justify-items-center grid-cols-1 md:flex md:justify-between">
            <p className="my-4 text-lg text-left text-gray-600 dark:text-gray-400">
              O site conta com um algoritmo de busca que percorre algumas das
              principais lojas de calçados do Brasil, coletando informações
              sobre os tênis.
            </p>
            <img
              src="https://www.icegif.com/wp-content/uploads/icegif-4383.gif"
              className="w-80 md:w-64 rounded-md object-cover"
              alt="cat gif"
            />
          </div>
          <div className="flex flex-col-reverse md:flex md:flex-row md:justify-between mt-5">
            <img
              src="https://www.conseqta.com/img/home/why-what-icons/cylinder.gif"
              className="w-80 md:w-48 rounded-md object-cover object-bottom mx-auto"
              alt="database gif"
            />
            <p className="md:ms-4 my-10 text-lg text-left text-gray-600 dark:text-gray-400">
              Os calçados coletados são armazenados e indexados em nosso banco
              de dados, gerando o catálogo utilizado neste site.
            </p>
          </div>
          <p className="mt-16 text-lg text-gray-600 dark:text-gray-400">
            A grosso modo, o processo utilizado aqui se assemelha ao processo de
            indexação de sites do Google, porém em uma escala menor. Atualmente,
            estão em nosso radar as seguintes lojas:
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stores.map((store) => (
              <a
                key={store.name}
                href={store.link}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 hover:underline"
                title={store.name}
              >
                {store.name}
              </a>
            ))}
          </div>
        </div>
        <div className="lg:w-6/12 text-center lg:text-right mt-4 lg:mt-0 p-4">
          <p className="text-4xl font-bold text-gray-800 dark:text-gray-200">
            Contribua com o projeto
          </p>
          <div className="lg:text-right flex flex-col items-center lg:items-end mt-4">
            <img className="w-2/4 lg:w-2/6" src="qr.png" alt="Pix QR Code" />
            <button
              className={`btn btn-primary text-white font-bold text-xl rounded-md w-2/4 lg:w-2/6 mt-4 ${
                copied ? "bg-green-500" : "bg-blue-500"
              } transition-colors duration-300`}
              onClick={copyToClipboard}
            >
              {copied ? "Código Copiado!" : "Copiar Código"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
