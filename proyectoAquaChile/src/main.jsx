import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Solo se importa el CSS de Bootstrap: el comportamiento (menú desplegable, etc.)
// lo maneja react-bootstrap, por eso ya no se necesita bootstrap.bundle.min.js
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
