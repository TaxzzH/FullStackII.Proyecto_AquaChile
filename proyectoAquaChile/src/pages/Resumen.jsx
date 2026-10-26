import { useEffect, useState } from "react";
import { getSolicitudes, saveSolicitudes } from "../data/mockData";

function Resumen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [selected, setSelected] = useState(null); // Solicitud en edición
  const [formObs, setFormObs] = useState("");
  const [formFecha, setFormFecha] = useState("");

  const cargarDatos = () => {
    setSolicitudes(getSolicitudes());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const enProceso = solicitudes.filter((s) => s.estado === "En proceso");
  const finalizadas = solicitudes.filter((s) => s.estado === "Finalizada");

  const abrirModalEditar = (item) => {
    setSelected(item);
    setFormObs(item.observaciones || "");
    setFormFecha(item.fechaEvaluacion || new Date().toISOString().split("T")[0]);
  };

  const handleGuardarEvaluacion = (e) => {
    e.preventDefault();
    const updated = solicitudes.map((item) => {
      if (item.id === selected.id) {
        return {
          ...item,
          estado: "Finalizada",
          fechaEvaluacion: formFecha,
          observaciones: formObs,
        };
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
                          onClick={() => abrirModalEditar(sol)}
                        >
                          Completar Evaluación
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
          Solicitudes Finalizadas / Aprobadas ({finalizadas.length})
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
                      <td><span className="badge bg-success">Aprobada</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FORMULARIO EDITAR / FINALIZAR */}
      {selected && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleGuardarEvaluacion}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Finalizar Evaluación: {selected.nombreCandidato}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelected(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Fecha de Evaluación</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formFecha}
                      onChange={(e) => setFormFecha(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observaciones y Resultado</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Ingrese los detalles y conclusión del examen psicolaboral..."
                      value={formObs}
                      onChange={(e) => setFormObs(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelected(null)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Guardar y Aprobar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resumen;