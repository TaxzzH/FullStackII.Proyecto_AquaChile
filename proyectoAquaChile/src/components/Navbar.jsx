import { NavLink } from 'react-router-dom';
import logoAC from '../assets/Logo_AquaChile.png';
import logoACW from '../assets/Logo_AquaChileWhite.png';

import { useTheme } from '../themes/useTheme';

import { useState, useEffect } from 'react';

function Navbar() {
  // 1. Estado para controlar el modo oscuro/claro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 2. Efecto para aplicar los cambios globalmente y en el LocalStorage
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    
    // Para Bootstrap 5.3+ (cambia el tema de toda la app automáticamente)
    document.documentElement.setAttribute('data-bs-theme', theme);
    
    // Por si usas clases custom tipo CSS / Tailwind
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <nav 
      className={`navbar navbar-expand-lg shadow-sm ${
        isDarkMode ? 'navbar-dark' : 'navbar-light'
      }`}
      style={{ 
        backgroundColor: isDarkMode ? '#1e293b' : '#b0cef2',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div className="container">
        {/* Nombre de la aplicación / Logo */}
        <NavLink className="navbar-brand fw-bold text-info" to="/">
          <img 
            src={isDarkMode ? logoACW : logoAC}
            alt="Logo AquaChile"
            style={{ height: '55px' }} />
        </NavLink>

        {/* Botón responsive para pantallas pequeñas */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/candidatos">
                Candidatos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/resumen">
                Resumen
              </NavLink>
            </li>

            {/* SWITCH DE MODO OSCURO / CLARO */}
            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <div className="form-check form-switch d-flex align-items-center m-0">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  role="switch" 
                  id="darkModeSwitch"
                  checked={isDarkMode}
                  onChange={toggleTheme}
                  style={{ cursor: 'pointer', width: '2.5em', height: '1.25em' }}
                />
                <label 
                  className="form-check-label ms-2 unselectable" 
                  htmlFor="darkModeSwitch"
                  style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                >
                  {isDarkMode ? '🌙' : '☀️'}
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;