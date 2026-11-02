import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import BadgeEstado from '../components/atoms/BadgeEstado';
import FormularioEvaluacion from '../components/organisms/FormularioEvaluacion';
import { actualizarSolicitud, getSolicitudes } from '../data/mockData';
import { puedeEvaluar, solicitudesVisibles } from '../utils/permisos';

const buscarSolicitud = (usuario, id) =>
  solicitudesVisibles(usuario, getSolicitudes()).find((s) => s.id === Number(id));

function Dato({ etiqueta, children }) {
  return (
    <Col xs={12} md={6} className="mb-3">
      <div className="small text-body-secondary">{etiqueta}</div>
      <div>{children}</div>
    </Col>
  );
}

function SolicitudDetalle({ usuario }) {
  const { id } = useParams();
  const [solicitud, setSolicitud] = useState(() => buscarSolicitud(usuario, id));
  const [evaluando, setEvaluando] = useState(false);

  if (!solicitud) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          No encontramos esa solicitud. <Link to="/solicitudes">Volver a Solicitudes</Link>
        </Alert>
      </Container>
    );
  }

  const guardar = (datos) => {
    actualizarSolicitud(solicitud.id, datos);
    setSolicitud({ ...solicitud, ...datos });
    setEvaluando(false);
  };

  const habilitado = puedeEvaluar(usuario, solicitud);

  return (
    <Container className="mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Solicitud de {solicitud.nombreCandidato}</h2>
        <Button as={Link} to="/solicitudes" variant="outline-secondary">Volver a Solicitudes</Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <Row>
            <Dato etiqueta="Estado"><BadgeEstado estado={solicitud.estado} /></Dato>
            <Dato etiqueta="Profesional responsable">{solicitud.evaluador}</Dato>
            <Dato etiqueta="Correo">{solicitud.correo}</Dato>
            <Dato etiqueta="Teléfono">{solicitud.telefono}</Dato>
            <Dato etiqueta="Cargo">{solicitud.cargo}</Dato>
            <Dato etiqueta="Familia de cargo">{solicitud.familiaCargo}</Dato>
            <Dato etiqueta="Fecha de solicitud">{solicitud.fechaSolicitud}</Dato>
            <Dato etiqueta="Fecha de evaluación">{solicitud.fechaEvaluacion || 'Sin registrar'}</Dato>
          </Row>
          <div className="small text-body-secondary">Resultado u observaciones</div>
          <p>{solicitud.observaciones || 'Sin observaciones'}</p>

          {habilitado && solicitud.estado === 'Pendiente' && (
            <Button variant="primary" onClick={() => guardar({ estado: 'En proceso' })}>Iniciar Evaluación</Button>
          )}
          {habilitado && solicitud.estado === 'En proceso' && (
            <Button variant="primary" onClick={() => setEvaluando(true)}>Registrar Evaluación</Button>
          )}
        </Card.Body>
      </Card>

      <Modal show={evaluando} onHide={() => setEvaluando(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Evaluación: {solicitud.nombreCandidato}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormularioEvaluacion solicitud={solicitud} onGuardar={guardar} onCancelar={() => setEvaluando(false)} />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default SolicitudDetalle;
