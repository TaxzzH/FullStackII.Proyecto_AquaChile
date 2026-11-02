import { Button, Container, Form, Nav, Navbar as BsNavbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logoAC from '../assets/Logo_AquaChile.png';
import logoACW from '../assets/Logo_AquaChileWhite.png';
import { useTheme } from '../themes/useTheme';

function Navbar({ usuario, onSalir }) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <BsNavbar
      expand="lg"
      collapseOnSelect
      className="shadow-sm"
      style={{ backgroundColor: isDarkMode ? '#1e293b' : '#b0cef2', transition: 'background-color 0.3s ease' }}
    >
      <Container>
        <BsNavbar.Brand as={NavLink} to="/">
          <img src={isDarkMode ? logoACW : logoAC} alt="Logo AquaChile" style={{ height: '55px' }} />
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="navbarNav" aria-label="Abrir menú" />

        <BsNavbar.Collapse id="navbarNav">
          <Nav className="ms-auto align-items-lg-center">
            {usuario && (
              <>
                <Nav.Link as={NavLink} to="/" end eventKey="inicio">Inicio</Nav.Link>
                <Nav.Link as={NavLink} to="/candidatos" eventKey="candidatos">Candidatos</Nav.Link>
                <Nav.Link as={NavLink} to="/solicitudes" eventKey="solicitudes">Solicitudes</Nav.Link>
                <Nav.Link as={NavLink} to="/resumen" eventKey="resumen">Resumen</Nav.Link>
                <BsNavbar.Text className="ms-lg-3">{usuario.nombre} ({usuario.rol})</BsNavbar.Text>
                <Button variant={isDarkMode ? 'outline-light' : 'outline-dark'} size="sm" className="ms-lg-2 align-self-start align-self-lg-center" onClick={onSalir}>
                  Salir
                </Button>
              </>
            )}

            {/* SWITCH DE MODO OSCURO / CLARO */}
            <Form.Check
              type="switch"
              id="darkModeSwitch"
              className="ms-lg-3 mt-2 mt-lg-0"
              aria-label="Modo oscuro"
              label={isDarkMode ? '🌙' : '☀️'}
              checked={isDarkMode}
              onChange={toggleTheme}
            />
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
