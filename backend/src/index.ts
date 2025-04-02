// Import necessary modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { getExchangeRates, convertCurrency } from './exchangeRates';
import { ConversionHistory, getStatistics } from './models/ConversionHistory';

// Reading variables from .env file
dotenv.config();
// Initialize Express app
const app = express();
// Set port and MongoDB URI
const PORT = process.env.PORT || 5001;
// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/currency-converter';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

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
    // Fetch exchange rates
    const data = await getExchangeRates();
    // Return the rates
    res.json(data);
  } catch (error) {
    // Log error
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
    // Save conversion to history
    const conversion = new ConversionHistory({ amount, fromCurrency: from, toCurrency: to, result });
    await conversion.save();
    // Return the result
    res.json({ result });
  } catch (error) {
    // Log error
    console.error('Error converting currency:', error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
});

// Endpoint to get conversion history
app.get('/api/history', async (req, res) => {
  try {
    // Fetch conversion history
    const history = await ConversionHistory.find()
    // Sort by timestamp in descending order
    .sort({ timestamp: -1 })
    .limit(10);
    // Return the history
    res.json(history);
  } catch (error) {
    // Log error
    console.error('Error fetching conversion history:', error);
    res.status(500).json({ error: 'Failed to fetch conversion history' });
  }
});

// Endpoint to get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    // Fetch statistics
    const stats = await getStatistics();
    // Return the statistics
    res.json(stats);
  } catch (error) {
    // Log error
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});