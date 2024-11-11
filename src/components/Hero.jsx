import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Hero() {
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);
  const [priceData, setPriceData] = useState({ labels: [], datasets: [] });

  const handleButton = async () => {
    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${input}`;
    const response = await fetch(url);
    const data = await response.json();
    const productsData = data.results.slice(0, 15);
    setProducts(productsData);

    // Configura os dados para o gráfico de barras
    setPriceData({
      labels: productsData.map((product) => product.title), // Nome de cada produto no eixo X
      datasets: [
        {
          label: 'Preço dos Produtos',
          data: productsData.map((product) => product.price), // Preços de cada produto no eixo Y
          backgroundColor: 'rgba(157, 50, 206, 0.6)',
          borderColor: '#c04b4b',
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="bg-slate-900 flex flex-col items-center text-white p-20 min-h-screen">
      <h1 className="text-5xl font-bold mb-7">COMPARADOR DE PREÇOS</h1>
      <div className="w-1/2">
        <input
          type="text"
          placeholder="Digite o produto que deseja comparar"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-7 text-black"
        />
        <button
          onClick={handleButton}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Comparar
        </button>
      </div>

      {/* Exibir produtos encontrados em uma grade */}
      <div className="bg-white p-5 rounded mt-7 w-3/4">
        <h2 className="text-black text-2xl font-semibold mb-5">Resultados:</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-500 hover:bg-slate-700 hover:scale-105 border rounded shadow-lg p-4 flex flex-col items-center">
                {/* Link para o produto */}
                <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                  <h3 className="text-white font-bold text-center mb-2">{product.title}</h3>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-32 object-cover mb-4 rounded-lg"
                  />
                  <p className="text-green-500 font-semibold">Preço: R$ {product.price.toFixed(2)}</p>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhum produto encontrado</p>
        )}
      </div>

      {/* Exibir gráfico de variação de preço como gráfico de barras */}
      {products.length > 0 && (
        <div className="bg-white p-5 rounded mt-7 w-full h-full  hidden md:flex flex-col">
          <h2 className="text-black text-2xl font-semibold mb-5">Gráfico de Variação de Preço</h2>
          <Bar data={priceData} />
        </div>
      )}
    </div>
  );
}

export default Hero;
