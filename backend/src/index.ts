// Import necessary modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getExchangeRates, convertCurrency } from './exchangeRates';

// Reading variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enabling CORS and JSON
app.use(cors());
app.use(express.json());

// Basic endpoint to verify that the server is running
app.get('/', (req, res) => {
  res.send('Currency Converter API is running');
});

// Endpoint to get currency exchange rates
app.get('/api/rates', async (req, res) => {
  try {
    const data = await getExchangeRates();
    res.json(data);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

// Endpoint for currency conversion
app.post('/api/convert', async (req, res) => {
  const { amount, from, to } = req.body;
  try {
    // Fetch exchange rates
    const data = await getExchangeRates();
    // Perform currency conversion
    const result = convertCurrency(amount, from, to, data.rates);
    // Return the result
    res.json({ result });
  } catch (error) {
    console.error('Error converting currency:', error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});