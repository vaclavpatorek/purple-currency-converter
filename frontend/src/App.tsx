// Importing necessary React hooks and components
import React, { useEffect, useState } from 'react';
import { getExchangeRates, getCurrencyList } from './api/exchangeRates';
import { CurrencyData, CurrencyList } from './types';
import CurrencyConverter from './features/CurrencyConverter';
import './styles/App.css';

// Main App component that serves as the entry point of application
function App() {
    // State to store exchange rate data
    const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
    // State to store the list of available currencies
    const [currencyList, setCurrencyList] = useState<CurrencyList | null>(null);
    // State to manage loading status
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // State to store potential error messages
    const [error, setError] = useState<string | null>(null);
    
    // Fetching currency data when the component is mounted
    useEffect(() => {
        // Function to fetch exchange rates and currency list from the API
        const fetchData = async () => {
            try {
                // Set loading state to true before fetching
                setIsLoading(true);
                const [ratesData, listData] = await Promise.all([ getExchangeRates(), getCurrencyList()]);
                // Storing fetched data in state
                setCurrencyData(ratesData);
                setCurrencyList(listData);
                // Clearing anz previous errors
                setError(null);
            } catch (err) {
                // Handling errors during data fetching
                setError('An error occured while loading the data. Please try again later.');
                console.error(err);
            } finally {
                // Setting  loading state to false after fetching 
                setIsLoading(false);
            }
        };
        // Calling the fetch function
        fetchData();
    }, []);

    // Main rendering of the App component
    return (
        <div className = "app-container">
            {/* Header section is displaying the title of the app */}
            <header>
                <h1>Purple currency converter</h1>
            </header>
            
            {/* Main content section where the form and results will be displayed */}
            <main>
                {isLoading ? (
                    <p>Loading data...</p>
                ) : error ? (
                    <p className = "error">{error}</p>
                ): (
                    <CurrencyConverter
                        currencyData = {currencyData!}
                        currencyList = {currencyList!}
                    />
                )}
            </main>
        </div>
    );
}

export default App;