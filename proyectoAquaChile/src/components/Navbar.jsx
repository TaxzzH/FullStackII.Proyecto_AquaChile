import { NavLink } from 'react-router-dom';
import logoAC from '../assets/Logo_AquaChile.png';
import logoACW from '../assets/Logo_AquaChileWhite.png';

function Navbar() {
  return (
    <nav 
    className="navbar navbar-expand-lg navbar-light shadow-sm"
    style={{ backgroundColor: '#b0cef2' }}
    >
      <div className="container">
        {/* Nombre de la aplicación */}
        <NavLink className="navbar-brand fw-bold text-info" to="/">
          <img src={logoAC} alt="Logo AquaChile" style={{ height: '55px' }} />
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
          <ul className="navbar-nav ms-auto">
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
              <NavLink className="nav-link" to="/solicitudes">
                Solicitudes
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;