import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import logoAC from '../assets/Logo_AquaChile.png';
import CampoFormulario from '../components/molecules/CampoFormulario';
import { familiasCargo } from '../data/mockData';
import { enviarPostulacion } from '../services/api';
import { validarCandidato } from '../utils/validaciones';

const FORMULARIO_INICIAL = {
  nombre: '',
  correo: '',
  telefono: '',
  cargo: '',
  familiaCargo: '',
};

function RellenarNuevoFormulario() {
  const [datos, setDatos] = useState(FORMULARIO_INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviadoConExito, setEnviadoConExito] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
    setErrorServidor('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones en el cliente
    const nuevosErrores = validarCandidato(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    // 2. Envío al backend Express
    try {
      setEnviando(true);
      setErrorServidor('');
      await enviarPostulacion(datos);
      setEnviadoConExito(true);
      setDatos(FORMULARIO_INICIAL);
    } catch (err) {
      setErrorServidor(err.message || 'No fue posible enviar la postulación. Inténtalo nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  const handleNuevoEnvio = () => {
    setEnviadoConExito(false);
    setDatos(FORMULARIO_INICIAL);
    setErrores({});
    setErrorServidor('');
  };

  return (
    <div className="py-5" style={{ minHeight: '100vh', backgroundColor: '#eef2f6' }}>
      <Container style={{ maxWidth: '720px' }}>
        {/* Cabecera estilo Google Forms / Portal Oficial */}
        <div className="text-center mb-4">
          <img src={logoAC} alt="AquaChile" style={{ height: '70px' }} className="mb-3" />
          <h2 className="fw-bold text-dark">Portal de Postulaciones AquaChile</h2>
          <p className="text-muted">
            Completa tus antecedentes laborales para participar en nuestros procesos de evaluación y selección.
          </p>
        </div>

        {enviadoConExito ? (
          <Card className="shadow-sm border-0 border-top border-4 border-success p-4 text-center">
            <Card.Body>
              <div className="display-4 text-success mb-3">✓</div>
              <h3 className="fw-bold text-success mb-3">¡Postulación recibida con éxito!</h3>
              <p className="lead text-muted mb-4">
                Tus datos han sido registrados correctamente en nuestra plataforma. El equipo de Recursos Humanos
                evaluará tus antecedentes a la brevedad.
              </p>
              <Button variant="outline-primary" onClick={handleNuevoEnvio}>
                Enviar otra postulación
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Card className="shadow-sm border-0 border-top border-4 border-primary">
            <Card.Body className="p-4 p-md-5">
              <div className="border-bottom pb-3 mb-4">
                <h4 className="fw-bold text-primary mb-1">Formulario de Ingreso de Postulante</h4>
                <small className="text-muted">Todos los campos marcados con (*) son obligatorios.</small>
              </div>

              {errorServidor && (
                <Alert variant="danger" dismissible onClose={() => setErrorServidor('')}>
                  {errorServidor}
                </Alert>
              )}

              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <CampoFormulario
                      id="nombre"
                      etiqueta="Nombre completo *"
                      placeholder="Ej: Juan Valdés Soto"
                      value={datos.nombre}
                      error={errores.nombre}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
                    <CampoFormulario
                      id="correo"
                      etiqueta="Correo electrónico *"
                      type="email"
                      placeholder="ejemplo@correo.cl"
                      value={datos.correo}
                      error={errores.correo}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
                    <CampoFormulario
                      id="telefono"
                      etiqueta="Teléfono de contacto *"
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={datos.telefono}
                      error={errores.telefono}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
                    <CampoFormulario
                      id="cargo"
                      etiqueta="Cargo al que postula *"
                      placeholder="Ej: Operador de Planta"
                      value={datos.cargo}
                      error={errores.cargo}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
                    <CampoFormulario
                      id="familiaCargo"
                      etiqueta="Familia de cargo *"
                      textoVacio="Selecciona una opción"
                      opciones={familiasCargo.map((f) => ({ valor: f, texto: f }))}
                      value={datos.familiaCargo}
                      error={errores.familiaCargo}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>

                <div className="d-grid gap-2 mt-4">
                  <Button type="submit" variant="primary" size="lg" disabled={enviando}>
                    {enviando ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Enviando postulación...
                      </>
                    ) : (
                      'Enviar Postulación'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default RellenarNuevoFormulario;
