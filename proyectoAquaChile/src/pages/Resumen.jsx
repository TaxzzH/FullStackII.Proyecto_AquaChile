import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import FormularioEvaluacion from "../components/organisms/FormularioEvaluacion";
import { getSolicitudes, saveSolicitudes } from "../data/mockData";

function Resumen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selected, setSelected] = useState(null); // Solicitud en edición

  const cargarDatos = () => {
    setSolicitudes(getSolicitudes());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const enProceso = solicitudes.filter((s) => s.estado === "En proceso");
  const finalizadas = solicitudes.filter((s) => s.estado === "Finalizada");

  const handleGuardarEvaluacion = (datos) => {
    const updated = solicitudes.map((item) => {
      if (item.id === selected.id) {
        return { ...item, ...datos };
      }
      return item;
    });
    saveSolicitudes(updated);
    setSolicitudes(updated);
    setSelected(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Resumen de Evaluaciones</h2>

      {/* SECCIÓN 1: EN PROCESO */}
      <div className="card mb-5 border-info">
        <div className="card-header bg-info text-white fw-bold">
          Solicitudes En Proceso ({enProceso.length})
        </div>
        <div className="card-body">
          {enProceso.length === 0 ? (
            <p className="text-muted mb-0">No hay evaluaciones en proceso.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Cargo</th>
                    <th>Evaluador</th>
                    <th>Observaciones Actuales</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {enProceso.map((sol) => (
                    <tr key={sol.id}>
                      <td className="fw-bold">{sol.nombreCandidato}</td>
                      <td>{sol.cargo}</td>
                      <td>{sol.evaluador}</td>
                      <td>{sol.observaciones || <span className="text-muted">Sin observaciones</span>}</td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelected(sol)}
                        >
                          Registrar Evaluación
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: FINALIZADAS / APROBADAS */}
      <div className="card border-success">
        <div className="card-header bg-success text-white fw-bold">
          Solicitudes Finalizadas ({finalizadas.length})
        </div>
        <div className="card-body">
          {finalizadas.length === 0 ? (
            <p className="text-muted mb-0">No hay evaluaciones finalizadas aún.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Candidato</th>
                    <th>Cargo</th>
                    <th>Fecha Evaluación</th>
                    <th>Resultado / Observaciones</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {finalizadas.map((sol) => (
                    <tr key={sol.id}>
                      <td className="fw-bold">{sol.nombreCandidato}</td>
                      <td>{sol.cargo}</td>
                      <td>{sol.fechaEvaluacion}</td>
                      <td>{sol.observaciones}</td>
                      <td><span className="badge bg-success">{sol.estado}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FORMULARIO DE EVALUACIÓN */}
      <Modal show={Boolean(selected)} onHide={() => setSelected(null)}>
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