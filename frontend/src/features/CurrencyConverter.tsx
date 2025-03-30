// Importing necessary modules and components
import React, { useState, useEffect } from 'react';
import { CurrencyData, CurrencyList, ConversionResult } from '../types';
import { convertMoney } from '../api/exchangeRates';
import '../styles/CurrencyConverter.css';

// Properties interface definning what data the components requires
interface CurrencyConverterProperties {
  currencyData: CurrencyData;
  currencyList: CurrencyList;
}

// Component for converting currencies
const CurrencyConverter: React.FC<CurrencyConverterProperties> = ( { currencyData, currencyList } ) => {
    // State for the amount to be converted
    const [amount, setAmount] = useState<number>(0);
    // State for the selected currencies (default from EUR to CZK)
    const [fromCurrency, setFromCurrency] = useState<string>('EUR');
    const [toCurrency, setToCurrency] = useState<string>('CZK');
    // State for storing conversion result
    const [result, setResult] = useState<ConversionResult | null>(null);
    // State for counting the numner of conversions
    const [calculationCount, setCalculationCount] = useState<number>(-1);

    // Loading the saved conversion count from local storage  
    useEffect(() => {
        const savedCount = localStorage.getItem('calculationCount');
        if (savedCount) {
            setCalculationCount(parseInt(savedCount, 10));
        }
        handleConvert();
    }, []);

    //Function to perform conversion
    const handleConvert = () => {
        // Converting the amount using the provided exchange rates
        const convertedAmount = convertMoney(amount, fromCurrency, toCurrency, currencyData.rates);
        // Create a result object with conversion details
        const newResult: ConversionResult = {amount, from: fromCurrency, to: toCurrency, result: convertedAmount, date: currencyData.date};

        // Update the state for the result
        setResult(newResult);
    
        // Incrementing and updating the conversion in state and local storage
        const newCount = calculationCount + 1;
        setCalculationCount(newCount);
        localStorage.setItem('calculationCount', newCount.toString());
    };

    // Rendering a container with a form for user input and section for displaying results
    return (
        <div className="converter-container">
        {/* Form section for user input */}    
        <div className="converter-form">

            {/* Input field for entering the amount to convert */}
            <div className="form-group">
            <label htmlFor="amount">Amount to convert</label>
            <input
                id="amount"
                type="text"
                min="0"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
            </div>
            
            {/* Dropdown for selecting the currency to convert from */}
            <div className="form-group">
            <label htmlFor="fromCurrency">From</label>
            <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
            >
                {Object.keys(currencyData.rates).map((code) => (
                <option key={code} value={code}>
                    {code}
                </option>
                ))}
            </select>
            </div>
            
            {/* Dropdown for selecting the currency to convert to */}
            <div className="form-group">
            <label htmlFor="toCurrency">To</label>
            <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
            >
                {Object.keys(currencyData.rates).map((code) => (
                <option key={code} value={code}>
                    {code}
                </option>
                ))}
            </select>
            </div>
        </div>
        
        {/* Button to trigger currency conversion */}
        <button className="convert-button" onClick={handleConvert}>
            Convert currency
        </button>
        
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

export default CurrencyConverter;