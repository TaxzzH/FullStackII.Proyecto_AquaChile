import { useCallback, useState } from 'react';
import { Alert, Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import BadgeEstado from '../components/atoms/BadgeEstado';
import EstadoCarga from '../components/molecules/EstadoCarga';
import FormularioEvaluacion from '../components/organisms/FormularioEvaluacion';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import { useCarga } from '../hooks/useCarga';
import { evaluarSolicitud, iniciarEvaluacion, obtenerSolicitud } from '../services/api';
import { puedeEvaluar, solicitudesVisibles } from '../utils/permisos';

function Dato({ etiqueta, children }) {
  return (
    <Col xs={12} md={6} className="mb-3">
      <div className="dato-etiqueta">{etiqueta}</div>
      <div>{children}</div>
    </Col>
  );
}

function SolicitudDetalle({ usuario }) {
  const { id } = useParams();
  const cargar = useCallback(() => obtenerSolicitud(id), [id]);
  const { datos, cargando, error, recargar } = useCarga(cargar);
  const [evaluando, setEvaluando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorAccion, setErrorAccion] = useState('');

  // Un evaluador solo puede abrir las solicitudes que tiene asignadas
  const solicitud = datos && solicitudesVisibles(usuario, [datos])[0];
  const volver = <Button as={Link} to="/solicitudes" variant="outline-secondary">Volver a Solicitudes</Button>;

  const ejecutar = async (accion) => {
    setEnviando(true);
    setErrorAccion('');
    try {
      await accion();
      setEvaluando(false);
      await recargar();
    } catch (err) {
      setErrorAccion(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (error === 'Solicitud no encontrada.' || (datos && !solicitud)) {
    return (
      <PlantillaPagina titulo="Solicitud">
        <Alert variant="warning">
          No encontramos esa solicitud. <Link to="/solicitudes">Volver a Solicitudes</Link>
        </Alert>
      </PlantillaPagina>
    );
  }

  const habilitado = solicitud && puedeEvaluar(usuario, solicitud);

  return (
    <PlantillaPagina titulo={solicitud ? `Solicitud de ${solicitud.nombreCandidato}` : 'Solicitud'} acciones={volver}>
      <EstadoCarga cargando={cargando} error={error} hayDatos={Boolean(datos)} onReintentar={recargar}>
        {solicitud && (
          <Card>
            <Card.Body>
              {errorAccion && !evaluando && <Alert variant="danger">{errorAccion}</Alert>}
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
              <div className="dato-etiqueta">Resultado u observaciones</div>
              <p>{solicitud.observaciones || 'Sin observaciones'}</p>

              {habilitado && solicitud.estado === 'Pendiente' && (
                <Button variant="primary" disabled={enviando} onClick={() => ejecutar(() => iniciarEvaluacion(solicitud.id))}>
                  Iniciar Evaluación
                </Button>
              )}
              {habilitado && solicitud.estado !== 'Pendiente' && (
                <Button
                  variant={solicitud.estado === 'En proceso' ? 'primary' : 'outline-secondary'}
                  onClick={() => {
                    setErrorAccion('');
                    setEvaluando(true);
                  }}
                >
                  {solicitud.estado === 'En proceso' ? 'Registrar Evaluación' : 'Editar Evaluación'}
                </Button>
              )}
            </Card.Body>
          </Card>
        )}
      </EstadoCarga>

      <Modal show={evaluando} onHide={() => setEvaluando(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Evaluación: {solicitud?.nombreCandidato}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorAccion && <Alert variant="danger">{errorAccion}</Alert>}
          {solicitud && (
            <FormularioEvaluacion
              solicitud={solicitud}
              enviando={enviando}
              onGuardar={(datosEvaluacion) => ejecutar(() => evaluarSolicitud(solicitud.id, datosEvaluacion))}
              onCancelar={() => setEvaluando(false)}
            />
          )}
        </Modal.Body>
      </Modal>
    </PlantillaPagina>
  );
}

export default SolicitudDetalle;
