// Importing axios for HTTP requests and dotenv for environment variables
import axios from 'axios';
import dotenv from 'dotenv';

// Reading variables from .env file
dotenv.config();

// URL and API key for Fixer.io API
const API_URL = 'http://data.fixer.io/api';
const API_KEY = process.env.API_KEY;

// Function to get current exchange rates
export const getExchangeRates = async () => {
  const response = await axios.get(`${API_URL}/latest`, {
    params: { access_key: API_KEY },
  });

  // Check if the response is successful
  if (!response.data.success) {
    throw new Error('Failed to fetch exchange rates');
  }

  // Returning data from API
  return response.data; 
};

// Function to convert currency
export const convertCurrency = (amount: number, from: string, to: string, rates: Record<string, number>) => {
  // If the source currency is the same as the target currency, no conversion is needed
  if (from === to) return amount;
  // Convert amount to EUR if source currency is not EUR
  const amountInEUR = from === 'EUR' ? amount : amount / rates[from];
  // Conversion from EUR to target currency
  const convertedAmount = to === 'EUR' ? amountInEUR : amountInEUR * rates[to];
  // Returning the converted amount
  return convertedAmount;
};