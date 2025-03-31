// Importing axios library for request and importing types for the data from API
import axios from 'axios';
import { CurrencyData, CurrencyList } from '../types';

// API key and base URL
const API_KEY = 'd841be5f050627b9076ef43238e7f0ae';
const API_URL = 'http://data.fixer.io/api';

// Function to get current exchange rates from the API
export const getExchangeRates = async (): Promise<CurrencyData> => {
    try {
        // Sending a get request to fetch the latest exchange rates
        const response = await axios.get(`${API_URL}/latest`, {
            params: {
                access_key: API_KEY
            }
        });
        // Returning the data received from the API
        return response.data;
    } catch (error) {
        // If an error occurs while fetching the exchange rates, then print the error
        console.error('Error while loading currency exchange rates: ', error);
        throw error;
    }
};

// Function to get a list of all avaiable currencies from the API
export const getCurrencyList = async (): Promise<CurrencyList> => {
    try {
        // Sending a get request to fetch the list of available currencies
        const response = await axios.get(`${API_URL}/symbols`, {
            params: {
                access_key: API_KEY
            }
        });
        // Returning the data received from the API
        return response.data;
    } catch (error) {
        // If an error occurs while fetching the currency list, then print the error
        console.error('Error loading currency list: ',error);
        throw error;
    }
}

// Function to converts an amount from one currency to another currency
export const convertMoney = (amount: number, fromCurrency: string, toCurrency: string, exchangeRates: Record<string, number>): number => {
    // If the source currency is the same as the target currency, no conversion is needed
    if (fromCurrency === toCurrency) return amount;
    // If the source currency is EUR, convert directly using the target currency's exchange rate
    if (fromCurrency === 'EUR') {
        return amount * exchangeRates[toCurrency];
    }
    
    // If the source currency is not EUR, first convert the amount to EUR, then to the target currency
    const amountInEUR = amount / exchangeRates[fromCurrency];
    return amountInEUR * exchangeRates[toCurrency];
};