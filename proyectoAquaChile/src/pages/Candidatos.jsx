import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Spinner, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCandidatos } from '../data/mockData';
import { iniciarEvaluacion, obtenerCandidatos } from '../services/api';

function Candidatos() {
  const [candidatos, setCandidatos] = useState(() => {
    try {
      const data = getCandidatos();
      return data.map((c) => ({
        ...c,
        solicitudId: c.id,
        estadoSolicitud: 'Pendiente',
      }));
    } catch {
      return [];
    }
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [procesandoId, setProcesandoId] = useState(null);

  const cargarCandidatos = async () => {
    try {
      const data = await obtenerCandidatos();
      setCandidatos(data);
    } catch (err) {
      console.warn('API no disponible temporalmente, usando estado local:', err.message);
    }
  };

  useEffect(() => {
    cargarCandidatos();
  }, []);

  const handleIniciar = async (solicitudId, nombre) => {
    try {
      setProcesandoId(solicitudId);
      await iniciarEvaluacion(solicitudId);
      setMensajeExito(`¡Evaluación iniciada para ${nombre}! El candidato ahora se encuentra en la sección Resumen.`);
      // Actualizamos inmediatamente el estado para que desaparezca de esta vista
      setCandidatos((prev) =>
        prev.map((c) => (c.solicitudId === solicitudId ? { ...c, estadoSolicitud: 'En proceso' } : c))
      );
      await cargarCandidatos();
    } catch (err) {
      alert(`Error al iniciar evaluación: ${err.message}`);
    } finally {
      setProcesandoId(null);
    }
  };

  // Solo se muestran los postulantes que están en estado "Pendiente"
  const candidatosPendientes = candidatos.filter((c) => c.estadoSolicitud === 'Pendiente');

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-1">Candidatos Pendientes</h2>
          <p className="text-muted mb-0">
            Postulantes que enviaron su formulario y están esperando el inicio de su evaluación.
          </p>
        </div>
        <div>
          <Button
            as={Link}
            to="/rellenarNuevoFormulario"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-secondary"
            size="sm"
          >
            ↗ Abrir Formulario Público
          </Button>
        </div>
      </div>

      {mensajeExito && (
        <Alert variant="success" dismissible onClose={() => setMensajeExito('')}>
          {mensajeExito}{' '}
          <Link to="/resumen" className="fw-bold alert-link">
            Ir a Resumen
          </Link>
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Consultando candidatos desde MySQL...</p>
        </div>
      ) : candidatosPendientes.length === 0 ? (
        <Card className="shadow-sm border-0 p-4 text-center">
          <Card.Body>
            <h5 className="text-muted mb-2">No hay candidatos pendientes en este momento</h5>
            <p className="text-muted small mb-3">
              Todos los postulantes recibidos ya tienen su evaluación iniciada o completada. Las nuevas postulaciones
              ingresadas desde <code>/rellenarNuevoFormulario</code> aparecerán aquí.
            </p>
            <Button as={Link} to="/resumen" variant="primary" size="sm">
              Ver Evaluaciones en Resumen
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Cargo Postulado</th>
                    <th>Familia de Cargo</th>
                    <th>Fecha Envío</th>
                    <th>Estado</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatosPendientes.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-bold">{c.nombre}</td>
                      <td>
                        <div>{c.correo}</div>
                        <small className="text-muted">{c.telefono}</small>
                      </td>
                      <td>{c.cargo}</td>
                      <td>
                        <Badge bg="secondary" className="fw-normal">
                          {c.familiaCargo}
                        </Badge>
                      </td>
                      <td>{c.fechaSolicitud || 'Reciente'}</td>
                      <td>
                        <Badge bg="warning" text="dark">
                          Pendiente
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={procesandoId === c.solicitudId}
                          onClick={() => handleIniciar(c.solicitudId, c.nombre)}
                        >
                          {procesandoId === c.solicitudId ? 'Iniciando...' : 'Iniciar Evaluación'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default Candidatos;
