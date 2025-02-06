import { useState } from "react";

const countries = [
  { code: "USD", name: "United States" },
  { code: "EUR", name: "Eurozone" },
  { code: "GBP", name: "United Kingdom" },
  { code: "INR", name: "India" },
  { code: "JPY", name: "Japan" },
  { code: "AUD", name: "Australia" },
  { code: "CAD", name: "Canada" },
  { code: "CHF", name: "Switzerland" },
];

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.82,
  INR: 86.54,
  JPY: 115.34,
  AUD: 1.49,
  CAD: 1.34,
  CHF: 0.94,
};

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(1);

  const handleConvert = () => {
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    setConvertedAmount((amount * rate).toFixed(2));
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="bg-orange-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-5">
      <div className="bg-yellow-50 dark:bg-gray-800 p-10 rounded-lg shadow-xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-200 mb-8 text-center">
          Currency Converter
        </h1>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-400 font-medium mb-2 text-lg">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 border bg-gray-100 dark:bg-gray-400 border-gray-300 dark:border-gray-700 dark:text-gray-50 rounded-md focus:outline-none focus:ring focus:ring-blue-200 w-full text-xl"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex justify-between items-center space-x-4">
            <div className="flex flex-col w-full">
              <label className="text-gray-600 dark:text-gray-400 font-medium mb-2 text-lg">From Currency</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="p-3 border border-gray-300 dark:bg-gray-400 bg-gray-100 dark:text-gray-50 dark:border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-200 w-full text-xl"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>
            <div
              className="text-2xl font-bold text-gray-600 dark:text-gray-400 mx-4 cursor-pointer"
              onClick={handleSwapCurrencies}
            >
              ⇆
            </div>
            <div className="flex flex-col w-full">
              <label className="text-gray-600 dark:text-gray-400 font-medium mb-2 text-lg">To Currency</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="p-3 border border-gray-300 bg-gray-100 dark:bg-gray-400 dark:text-gray-50 dark:border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-200 w-full text-xl"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center bg-green-100 dark:bg-green-800 p-4 rounded-md">
            <span className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Converted Amount:</span>
            <span className="text-green-600 dark:text-green-400 font-bold text-2xl">{convertedAmount}</span>
          </div>
          <button
            onClick={handleConvert}
            className="w-full bg-blue-600 dark:bg-blue-500 text-white font-medium py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 transition text-lg"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
