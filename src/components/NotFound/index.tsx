export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1
        className="font-black font-mono text-blue-500"
        style={{ fontSize: "10rem" }}
      >
        4<span className="text-red-500 font-mono">0</span>4
      </h1>
      <h2 className="font-black font-mono text-2xl mt-4 text-center">
        Esta página não existe ou foi movida
      </h2>
      <p
        className="mt-6 p-2 rounded text-center cursor-pointer bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
        onClick={() => window.history.back()}
        role="button"
        aria-label="Voltar para a página anterior"
      >
        Voltar
      </p>
    </div>
  );
};
