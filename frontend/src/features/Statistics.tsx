// Import React and hooks, Axios for HTTP requests, type definitions, and CSS styles
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatisticsResponse } from '../types/api';
import '../styles/Statistics.css';

// Component displaying conversion statistics with auto-refresh
const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches latest statistics from the backend
  const fetchStatistics = async () => {
    try { 
      // Set loading to true
      setLoading(true);
      // Fetch statistics from the backend
      const response = await axios.get<StatisticsResponse>('http://localhost:5001/api/statistics');
      // Set the statistics
      setStats(response.data);
      // Clear any error
      setError(null);
    } catch (err) {
      // Log error
      console.error('Error fetching statistics:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and setup auto-refresh interval
  useEffect(() => {
    // Fetch statistics 
    fetchStatistics();
    // Set auto-refresh interval
    const interval = setInterval(fetchStatistics, 60000);
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Make fetchStatistics available globally for manual updates
  window.updateStatistics = fetchStatistics;

  // Render loading state
  if (loading) return <div className="statistics-loading">Loading statistics...</div>;
  // Render error state
  if (error) return <div className="statistics-error">{error}</div>;
  // Render statistics
  if (!stats) return null;

  return (
    <div className="statistics-container">
      {/* Statistics title */}
      <h2>Statistics</h2>
      <div className="statistics-grid">
        {/* Total conversions card */}
        <div className="stat-card">
          {/* Total conversions title */}
          <h3>Total Conversions</h3>
          {/* Total conversions value */}
          <p className="stat-value">{stats.totalConversions}</p>
        </div>
        <div className="stat-card">
          {/* Most used target currency title */}
          <h3>Most Used Target Currency</h3>
          <p className="stat-value">{stats.mostUsedTargetCurrency || 'N/A'}</p>
        </div>
        <div className="stat-card">
          {/* Total amount in USD title */}
          <h3>Total Amount in USD</h3>
          <p className="stat-value">${stats.totalInUSD.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

// Export the component for use in other parts of the application
export default Statistics; 