import { Card, Col, Container, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import FormularioIngreso from '../components/organisms/FormularioIngreso';
import { usuarios } from '../data/mockData';

function Login({ usuario, onIngresar }) {
  if (usuario) return <Navigate to="/" replace />;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="h4 mb-2">Ingreso al sistema</h1>
              <p className="text-body-secondary">
                Prototipo académico con usuarios ficticios. Elige uno para ver lo que permite su rol.
              </p>
              <FormularioIngreso usuarios={usuarios} onIngresar={onIngresar} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
