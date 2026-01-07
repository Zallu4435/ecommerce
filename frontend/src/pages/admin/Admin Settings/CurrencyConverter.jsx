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
    <div className="flex dark:bg-black h-screen fixed top-10 left-[420px] right-0">
      <div className="p-6 w-full px-14 dark:bg-gray-900 dark:text-white bg-orange-50 overflow-y-auto scrollbar-hidden pb-20">
        {/* Page Header */}
        <div className="flex justify-between mt-5 items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-400">
            Currency Converter
          </h1>
        </div>

        <div className="max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white transition-all"
                placeholder="Enter amount"
              />
            </div>

            <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">From</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white transition-all text-sm"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwapCurrencies}
                className="p-3 mb-0.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-blue-600 transition-colors"
              >
                ⇆
              </button>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white transition-all text-sm"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} - {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Converted Result</p>
              <h3 className="text-4xl font-black text-blue-700 dark:text-blue-300">
                {convertedAmount} <span className="text-xl font-bold opacity-70">{toCurrency}</span>
              </h3>
            </div>

            <button
              onClick={handleConvert}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
            >
              Calculate Exchange
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
