import { useState } from 'react';
import { Alert, Button, ButtonGroup, Card, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BadgeEstado from '../components/atoms/BadgeEstado';
import EstadoCarga from '../components/molecules/EstadoCarga';
import FormularioEvaluacion from '../components/organisms/FormularioEvaluacion';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import { useCarga } from '../hooks/useCarga';
import { evaluarSolicitud, obtenerSolicitudes } from '../services/api';
import { puedeEvaluar, solicitudesVisibles } from '../utils/permisos';

const FILTROS = [
  { valor: 'TODAS', texto: 'Todas' },
  { valor: 'En proceso', texto: 'En proceso' },
  { valor: 'Finalizada', texto: 'Finalizadas' },
  { valor: 'Rechazada', texto: 'Rechazadas' },
];

function Resumen({ usuario }) {
  const { datos, cargando, error, recargar } = useCarga(obtenerSolicitudes);
  const [filtro, setFiltro] = useState('TODAS');
  const [selected, setSelected] = useState(null); // Solicitud en edición
  const [enviando, setEnviando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Las pendientes aún no se evalúan: se gestionan desde Candidatos y Solicitudes
  const evaluaciones = solicitudesVisibles(usuario, datos ?? []).filter((s) => s.estado !== 'Pendiente');
  const contar = (valor) => (valor === 'TODAS' ? evaluaciones.length : evaluaciones.filter((s) => s.estado === valor).length);
  const filtradas = evaluaciones.filter((s) => filtro === 'TODAS' || s.estado === filtro);

  const abrir = (solicitud) => {
    setErrorGuardar('');
    setSelected(solicitud);
  };

  const handleGuardarEvaluacion = async (datosEvaluacion) => {
    setEnviando(true);
    setErrorGuardar('');
    try {
      await evaluarSolicitud(selected.id, datosEvaluacion);
      setMensaje(`Evaluación de ${selected.nombreCandidato} guardada como ${datosEvaluacion.estado}.`);
      setSelected(null);
      await recargar();
    } catch (err) {
      setErrorGuardar(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <PlantillaPagina
      titulo="Resumen de evaluaciones"
      descripcion="Revisión, calificación y registro de resoluciones."
      acciones={
        <ButtonGroup aria-label="Filtrar evaluaciones">
          {FILTROS.map((f) => (
            <Button key={f.valor} variant={filtro === f.valor ? 'primary' : 'outline-secondary'} onClick={() => setFiltro(f.valor)}>
              {f.texto} ({contar(f.valor)})
            </Button>
          ))}
        </ButtonGroup>
      }
    >
      {mensaje && <Alert variant="success" dismissible onClose={() => setMensaje('')}>{mensaje}</Alert>}

      <EstadoCarga cargando={cargando} error={error} hayDatos={Boolean(datos)} onReintentar={recargar}>
        {filtradas.length === 0 ? (
          <Alert variant="secondary">No hay evaluaciones con este filtro.</Alert>
        ) : (
          <Card>
            <Table responsive hover className="tabla-aqua align-middle">
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Cargo</th>
                  <th>Responsable</th>
                  <th>Fecha de evaluación</th>
                  <th>Estado</th>
                  <th>Observaciones</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((sol) => (
                  <tr key={sol.id}>
                    <td className="fw-bold">{sol.nombreCandidato}</td>
                    <td>{sol.cargo}</td>
                    <td>{sol.evaluador}</td>
                    <td>{sol.fechaEvaluacion || 'Sin registrar'}</td>
                    <td><BadgeEstado estado={sol.estado} /></td>
                    <td className="celda-texto">{sol.observaciones || <span className="text-body-secondary">Sin observaciones</span>}</td>
                    <td>
                      {puedeEvaluar(usuario, sol) ? (
                        <Button variant={sol.estado === 'En proceso' ? 'primary' : 'outline-secondary'} size="sm" className="text-nowrap" onClick={() => abrir(sol)}>
                          {sol.estado === 'En proceso' ? 'Registrar Evaluación' : 'Editar Evaluación'}
                        </Button>
                      ) : (
                        <Link to={`/solicitudes/${sol.id}`} className="text-nowrap">Ver detalle</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </EstadoCarga>

      <Modal show={Boolean(selected)} onHide={() => setSelected(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Evaluación: {selected?.nombreCandidato}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorGuardar && <Alert variant="danger">{errorGuardar}</Alert>}
          {selected && (
            <FormularioEvaluacion
              key={selected.id}
              solicitud={selected}
              enviando={enviando}
              onGuardar={handleGuardarEvaluacion}
              onCancelar={() => setSelected(null)}
            />
          )}
        </Modal.Body>
      </Modal>
    </PlantillaPagina>
  );
}

export default Resumen;
