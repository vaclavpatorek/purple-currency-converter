// Importing axios for HTTP requests and dotenv for environment variables
import axios from 'axios';
import dotenv from 'dotenv';

// Reading variables from .env file
dotenv.config();

// Function to get current exchange rates
export const getExchangeRates = async () => {
  try {
    // Fetch exchange rates
    const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.API_KEY}`);
    // Check if the request was successful
    if (!response.data.success) {
      // Throw an error if the request failed
      throw new Error('Failed to fetch exchange rates');
    }
    return response.data;
  } catch (error) {
    // Log error
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
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