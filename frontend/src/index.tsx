// Importing libraries, style and components
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// Creating a root element for a React application
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Render the main App component to the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);