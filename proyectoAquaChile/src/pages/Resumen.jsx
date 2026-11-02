import { useEffect, useState } from 'react';
import { Alert, Badge, Button, ButtonGroup, Card, Modal, Spinner, Table } from 'react-bootstrap';
import FormularioEvaluacion from '../components/organisms/FormularioEvaluacion';
import { evaluarSolicitud, obtenerSolicitudes } from '../services/api';

function Resumen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [filtro, setFiltro] = useState('TODAS'); // 'TODAS' | 'En proceso' | 'Finalizada' | 'Rechazada'
  const [selected, setSelected] = useState(null); // Solicitud en edición

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError('');
      const data = await obtenerSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      setError(err.message || 'Error al cargar las evaluaciones desde la base de datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardarEvaluacion = async (datos) => {
    try {
      await evaluarSolicitud(selected.id, datos);
      setMensajeExito(`Evaluación para ${selected.nombreCandidato} guardada como "${datos.estado}".`);
      setSelected(null);
      await cargarDatos();
    } catch (err) {
      alert(`Error al guardar evaluación: ${err.message}`);
    }
  };

  const enProceso = solicitudes.filter((s) => s.estado === 'En proceso');
  const finalizadas = solicitudes.filter((s) => s.estado === 'Finalizada');
  const rechazadas = solicitudes.filter((s) => s.estado === 'Rechazada');

  // Filtrado según la pestaña o botón activo
  const solicitudesFiltradas = solicitudes.filter((s) => {
    if (filtro === 'TODAS') return s.estado !== 'Pendiente';
    return s.estado === filtro;
  });

  const getBadgeEstado = (estado) => {
    switch (estado) {
      case 'En proceso':
        return <Badge bg="info">En proceso</Badge>;
      case 'Finalizada':
        return <Badge bg="success">Finalizada (Aprobada)</Badge>;
      case 'Rechazada':
        return <Badge bg="danger">Rechazada</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="mb-1">Resumen de Evaluaciones Psicolaborales</h2>
          <p className="text-muted mb-0">Revisión, calificación y registro de resoluciones finales.</p>
        </div>

        {/* BOTONERA DE FILTROS */}
        <ButtonGroup className="shadow-sm">
          <Button
            variant={filtro === 'TODAS' ? 'primary' : 'outline-primary'}
            onClick={() => setFiltro('TODAS')}
          >
            Todas ({enProceso.length + finalizadas.length + rechazadas.length})
          </Button>
          <Button
            variant={filtro === 'En proceso' ? 'info' : 'outline-info'}
            onClick={() => setFiltro('En proceso')}
            className={filtro === 'En proceso' ? 'text-white' : ''}
          >
            En proceso ({enProceso.length})
          </Button>
          <Button
            variant={filtro === 'Finalizada' ? 'success' : 'outline-success'}
            onClick={() => setFiltro('Finalizada')}
          >
            Finalizadas ({finalizadas.length})
          </Button>
          <Button
            variant={filtro === 'Rechazada' ? 'danger' : 'outline-danger'}
            onClick={() => setFiltro('Rechazada')}
          >
            Rechazadas ({rechazadas.length})
          </Button>
        </ButtonGroup>
      </div>

      {mensajeExito && (
        <Alert variant="success" dismissible onClose={() => setMensajeExito('')}>
          {mensajeExito}
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Cargando evaluaciones desde MySQL...</p>
        </div>
      ) : solicitudesFiltradas.length === 0 ? (
        <div className="alert alert-secondary text-center py-4">
          No hay evaluaciones registradas con el filtro seleccionado ({filtro}).
        </div>
      ) : (
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Candidato</th>
                    <th>Cargo Postulado</th>
                    <th>Evaluador</th>
                    <th>Fecha Evaluación</th>
                    <th>Estado</th>
                    <th>Observaciones / Resolución</th>
                    <th className="text-end">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesFiltradas.map((sol) => (
                    <tr key={sol.id}>
                      <td className="fw-bold">
                        {sol.nombreCandidato}
                        <div>
                          <small className="text-muted fw-normal">{sol.correo}</small>
                        </div>
                      </td>
                      <td>
                        {sol.cargo}
                        <div>
                          <Badge bg="secondary" className="fw-normal">
                            {sol.familiaCargo}
                          </Badge>
                        </div>
                      </td>
                      <td>{sol.evaluador || <span className="text-muted">Por asignar</span>}</td>
                      <td>{sol.fechaEvaluacion || <span className="text-muted">Pendiente</span>}</td>
                      <td>{getBadgeEstado(sol.estado)}</td>
                      <td style={{ maxWidth: '300px' }}>
                        {sol.observaciones ? (
                          <span>{sol.observaciones}</span>
                        ) : (
                          <span className="text-muted fst-italic">Sin observaciones aún</span>
                        )}
                      </td>
                      <td className="text-end">
                        <Button
                          variant={sol.estado === 'En proceso' ? 'primary' : 'outline-secondary'}
                          size="sm"
                          onClick={() => setSelected(sol)}
                        >
                          {sol.estado === 'En proceso' ? 'Registrar Evaluación' : 'Editar Evaluación'}
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

      {/* MODAL PARA REGISTRAR O EDITAR LA EVALUACIÓN */}
      <Modal show={Boolean(selected)} onHide={() => setSelected(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Evaluación: {selected?.nombreCandidato}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <FormularioEvaluacion
              key={selected.id}
              solicitud={selected}
              onGuardar={handleGuardarEvaluacion}
              onCancelar={() => setSelected(null)}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Resumen;
