import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

// Log de IP pública de Netlify (si está disponible)
try {
  const fnUrl = '/.netlify/functions/egress-ip'
  fetch(fnUrl)
    .then((r) => r.ok ? r.json() : null)
    .then((j) => {
      if (j && j.ip) {
        console.log('[Netlify egress IP]', j.ip, 'region:', j.region)
      }
    })
    .catch(() => { })
} catch { }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)


