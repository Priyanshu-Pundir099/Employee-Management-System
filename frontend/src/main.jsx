import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a35',
            color: '#e0e0eb',
            border: '1px solid rgba(42, 42, 74, 0.8)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Syne, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#00f5ff',
              secondary: '#0a0a18',
            },
          },
          error: {
            iconTheme: {
              primary: '#f72585',
              secondary: '#0a0a18',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
