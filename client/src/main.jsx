import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';
 
// mantine's base CSS — always import this first
import '@mantine/core/styles.css';
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
