// Importing mongoose for MongoDB connection
import mongoose from 'mongoose';

// Schema for storing currency conversion history
const conversionHistorySchema = new mongoose.Schema({
  // Amount to convert
  amount: { type: Number, required: true },
  // Source currency
  fromCurrency: { type: String, required: true },
  // Target currency
  toCurrency: { type: String, required: true },
  // Result of the conversion
  result: { type: Number, required: true },
  // Conversion timestamp
  timestamp: { type: Date, default: Date.now },
});

// Export mongoose model for conversion history
export const ConversionHistory = mongoose.model('ConversionHistory', conversionHistorySchema);

// Computes statistics about conversions: total count, most used currency and total USD amount
export const getStatistics = async () => {
  // Counts total conversions
  const totalConversions = await ConversionHistory.countDocuments();
  // Finds most used target currency
  const mostUsedTargetCurrency = await ConversionHistory.aggregate([
    { $group: { _id: '$toCurrency', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  // Calculates total USD amount of conversions
  const conversionsInUSD = await ConversionHistory.aggregate([
    { $match: { toCurrency: 'USD' } },
    { $group: { _id: null, total: { $sum: '$result' } } }
  ]);
  // Return statistics
  return {
    totalConversions,
    mostUsedTargetCurrency: mostUsedTargetCurrency[0]?._id || null,
    totalInUSD: conversionsInUSD[0]?.total || 0
  };
}; 