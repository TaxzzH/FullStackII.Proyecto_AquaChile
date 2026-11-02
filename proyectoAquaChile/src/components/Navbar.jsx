import { Button, Container, Form, Nav, Navbar as BsNavbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logoAC from '../assets/Logo_AquaChile.png';
import logoACW from '../assets/Logo_AquaChileWhite.png';

function Navbar({ usuario, onSalir, tema, onCambiarTema }) {
  const isDarkMode = tema === 'dark';

  return (
    <BsNavbar expand="lg" collapseOnSelect className="barra-aqua">
      <Container>
        <BsNavbar.Brand as={NavLink} to="/">
          <img className="logo" src={isDarkMode ? logoACW : logoAC} alt="Logo AquaChile" />
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="navbarNav" aria-label="Abrir menú" />

        <BsNavbar.Collapse id="navbarNav">
          <Nav className="ms-auto align-items-lg-center gap-lg-1">
            {usuario && (
              <>
                <Nav.Link as={NavLink} to="/" end eventKey="inicio">Inicio</Nav.Link>
                <Nav.Link as={NavLink} to="/candidatos" eventKey="candidatos">Candidatos</Nav.Link>
                <Nav.Link as={NavLink} to="/solicitudes" eventKey="solicitudes">Solicitudes</Nav.Link>
                <Nav.Link as={NavLink} to="/resumen" eventKey="resumen">Resumen</Nav.Link>
                <BsNavbar.Text className="ms-lg-3">{usuario.nombre} ({usuario.rol})</BsNavbar.Text>
                <Button variant="outline-secondary" size="sm" className="ms-lg-2 align-self-start align-self-lg-center" onClick={onSalir}>
                  Salir
                </Button>
              </>
            )}

            {/* SWITCH DE MODO OSCURO / CLARO */}
            <Form.Check
              type="switch"
              id="darkModeSwitch"
              className="ms-lg-3 mt-2 mt-lg-0"
              label="Modo oscuro"
              checked={isDarkMode}
              onChange={onCambiarTema}
            />
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
