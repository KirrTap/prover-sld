import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './translations/LanguageContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
<React.StrictMode>
  <ThemeProvider>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ThemeProvider>
</React.StrictMode>
)