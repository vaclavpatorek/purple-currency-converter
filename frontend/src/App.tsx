// Importing necessary React hooks and components
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CurrencyConverter from './features/CurrencyConverter';
import Statistics from './features/Statistics';
import { ExchangeRatesResponse } from './types/api';
import './styles/App.css';

// Main application component managing currency list and layout
const App: React.FC = () => {
  // State for the list of currencies
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // Fetch available currencies on component mount
  useEffect(() => {
    const fetchCurrencyList = async () => {
      try {
        // Clear any previous errors
        setIsLoading(true);
        // Fetch the currency list from the backend
        const response = await axios.get<ExchangeRatesResponse>('http://localhost:5001/api/rates');
        setCurrencyList(Object.keys(response.data.rates));
        setError(null);
      } catch (err) {
        // Handle errors during the fetch
        console.error('Error fetching currency list:', err);
        setError('Failed to load currency list. Please try again later.');
      } finally {
        // Set loading status to false
        setIsLoading(false);
      }
    };
    // Call the function to fetch currency list
    fetchCurrencyList();
  }, []);

  // Render the application
  return (
    <div className="app-container">
      {/* Header section */}
      <header>
        <h1>Purple Currency Converter</h1>
      </header>
      <main>
        {/* Main content section */}
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          // Display error message if any
          <p className="error">{error}</p>
        ) : (
          <>
            <CurrencyConverter currencyList={currencyList} />
            <Statistics />
          </>
        )}
      </main>
    </div>
  );
};

export default App;