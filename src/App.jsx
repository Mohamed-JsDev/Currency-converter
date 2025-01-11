import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCurr, setFromCurr] = useState("USD");
  const [toCurr, setToCurr] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/e96f869630c791de4e843665/latest/USD"
        );
        const data = await response.json();
        setData(Object.entries(data.conversion_rates));
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const convertCurrency = () => {
    const fromRate = data.find((item) => item[0] === fromCurr)[1];
    const toRate = data.find((item) => item[0] === toCurr)[1];
    const conversionRate = toRate / fromRate;
    const convertedAmount = conversionRate * amount;
    setResult(convertedAmount.toFixed(2));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error)
    return (
      <div className="text-center">
        Error: From website or Currency you select {error.message}
      </div>
    );

  return (
    <div className="container mx-auto flex flex-col items-center min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl mb-8">Currency Converter</h1>
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between mb-4">
          <span className="font-bold">FROM:</span>
          <span className="font-bold">TO:</span>
        </div>
        <div className="flex justify-between mb-4">
          <select
            className="CurrencySelector border border-gray-300 rounded-md p-2 w-1/2 mr-2"
            value={fromCurr}
            onChange={(e) => setFromCurr(e.target.value)}
          >
            {data.map(([currency]) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <select
            className="CurrencySelector border border-gray-300 rounded-md p-2 w-1/2"
            value={toCurr}
            onChange={(e) => setToCurr(e.target.value)}
          >
            {data.map(([currency]) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          className=" AmountInput border border-gray-300 rounded-md p-2 w-full mb-4"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="bg-orange-400 text-white rounded-md p-2 w-full hover:bg-orange-500"
          onClick={convertCurrency}
        >
          Convert
        </button>
        {result !== null && (
          <div className="ConversionResult mt-4 text-xl">
            Converted Amount: {result} {toCurr}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
