import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { InspectionProvider } from './context/InspectionContext.jsx'
import { seedRegistryIfEmpty } from './data/registrySeed.js'
import './index.css'

seedRegistryIfEmpty()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InspectionProvider>
          <App />
        </InspectionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
