import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx' // Import ThemeProvider
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider> {/* Wrap App with ThemeProvider */}
        <App />
        <Toaster position="top-right" toastOptions={{
          className: 'text-sm',
        }} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)