// Importing necessary modules and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CurrencyList, ConversionResult } from '../types';
import '../styles/CurrencyConverter.css';

// Properties interface defining what data the component requires
interface CurrencyConverterProperties {
  currencyList: CurrencyList;
}

// Component for sending requests to the backend and converting currencies
const CurrencyConverter: React.FC<CurrencyConverterProperties> = ({ currencyList }) => {
  // State for the amount to be converted
  const [amount, setAmount] = useState<number>(0);
  // State for the selected currencies (default from EUR to CZK)
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('CZK');
  // State for storing conversion result
  const [result, setResult] = useState<ConversionResult>({
    amount: 0,
    from: 'EUR',
    to: 'CZK',
    result: 0,
  });
  // State for counting the number of conversions
  const [calculationCount, setCalculationCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Loading the saved conversion count from local storage
  useEffect(() => {
    const savedCount = localStorage.getItem('calculationCount');
    if (savedCount) {
      setCalculationCount(parseInt(savedCount, 10));
    }
  }, []);

  // Function to perform conversion
  // This function sends a request to the backend to convert the currency
  const handleConvert = async () => {
    try {
      // Clear any previous errors
      setError(null);

      // Send a POST request to the backend with the conversion details
      const response = await axios.post('http://localhost:5001/api/convert', {
        amount,
        from: fromCurrency,
        to: toCurrency,
      });

      // Extract the converted amount from the response
      const convertedAmount = response.data.result;
      const newResult: ConversionResult = {
        amount,
        from: fromCurrency,
        to: toCurrency,
        result: convertedAmount,
      };

      // Update the state with the new conversion result
      setResult(newResult);

      // Update the calculation count and save it to local storage
      const newCount = calculationCount + 1;
      setCalculationCount(newCount);
      localStorage.setItem('calculationCount', newCount.toString());
    } catch (err) {
      // Handle errors from the backend
      console.error('Error converting currency via backend:', err);
      setError('Failed to convert currency. Please try again later.');
    }
  };

  // Rendering a container with a form for user input and section for displaying results
  return (
    <div className="converter-container">
      {/* Form for entering the amount and selecting currencies */}
      <div className="converter-form">
        {/* Input field for the amount to convert */}
        <div className="form-group">
          <label htmlFor="amount">Amount to convert</label>
          <input
            id="amount"
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          />
        </div>
        {/* Dropdown for selecting the source currency */}
        <div className="form-group">
          <label htmlFor="fromCurrency">From</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencyList.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
        {/* Dropdown for selecting the target currency */}
        <div className="form-group">
          <label htmlFor="toCurrency">To</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencyList.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Button to trigger the conversion */}
      <button className="convert-button" onClick={handleConvert}>
        Convert currency
      </button>
     {/* Display error message if any */}
     {error && <p className="error">{error}</p>}
            
            {/* Display conversion result if available */}
            {result && (
                <div className="result-container">
                    <h2>Result</h2>
                    <p className="result-amount">
                        {result.result.toFixed(2)} {result.to}
                    </p>
                    <p className="calculations-made">Number of calculations made</p>
                    <p className="calculations-made-number">{calculationCount}</p>
                </div>
            )}
        </div>
  );
};

// Exporting the component for use in other parts of the application
export default CurrencyConverter;