import { Alert, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { puede } from '../utils/permisos';

// Sin sesión lleva al ingreso; sin el permiso pedido muestra un aviso en vez de la página
function RutaProtegida({ usuario, permiso, children }) {
  if (!usuario) return <Navigate to="/login" replace />;

  if (permiso && !puede(usuario, permiso)) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Tu rol ({usuario.rol}) no tiene permiso para ver esta página.</Alert>
      </Container>
    );
  }

  return children;
}

export default RutaProtegida;
