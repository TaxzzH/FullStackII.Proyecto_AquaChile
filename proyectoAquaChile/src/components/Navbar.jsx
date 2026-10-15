import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import logoAC from '../assets/Logo_AquaChile.png';

const Navigation = () => {
  return (
    <Navbar
      expand="lg"
      variant="dark"
      collapseOnSelect
      className="shadow-sm"
      style={{ backgroundColor: '#001225' }}
    >
      <Container>
        {/* Logo de la aplicación */}
        <Navbar.Brand as={NavLink} to="/">
          <img src={logoAC} alt="Logo AquaChile" style={{ height: '45px' }} />
        </Navbar.Brand>

        {/* Botón responsive para pantallas pequeñas */}
        <Navbar.Toggle aria-controls="navbar-principal" />

        {/* Enlaces de navegación */}
        <Navbar.Collapse id="navbar-principal">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end eventKey="inicio">
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/candidatos" eventKey="candidatos">
              Candidatos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/solicitudes" eventKey="solicitudes">
              Solicitudes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
