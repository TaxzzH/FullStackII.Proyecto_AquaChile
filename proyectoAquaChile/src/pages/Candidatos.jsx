import { useEffect, useState } from "react";
import { getSolicitudes, saveSolicitudes } from "../data/mockData";

function Candidatos() {
  const [pendientes, setPendientes] = useState([]);

  useEffect(() => {
    const data = getSolicitudes();
    setPendientes(data.filter((s) => s.estado === "Pendiente"));
  }, []);

  const handleIniciarProceso = (id) => {
    const data = getSolicitudes();
    const updated = data.map((item) => {
      if (item.id === id) {
        return { ...item, estado: "En proceso" };
      }
      return item;
    });
    saveSolicitudes(updated);
    setPendientes(updated.filter((s) => s.estado === "Pendiente"));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Candidatos</h2>
      <p className="text-muted">
        Solicitudes recibidas que aún no se han asignado ni iniciado evaluación.
      </p>

      {pendientes.length === 0 ? (
        <div className="alert alert-secondary">No hay solicitudes pendientes en este momento.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle border">
            <thead className="table-light">
              <tr>
                <th>Candidato</th>
                <th>Contacto</th>
                <th>Cargo Postulado</th>
                <th>Familia de Cargo</th>
                <th>Fecha Solicitud</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((sol) => (
                <tr key={sol.id}>
                  <td className="fw-bold">{sol.nombreCandidato}</td>
                  <td>
                    <div>{sol.correo}</div>
                    <small className="text-muted">{sol.telefono}</small>
                  </td>
                  <td>{sol.cargo}</td>
                  <td><span className="badge bg-secondary">{sol.familiaCargo}</span></td>
                  <td>{sol.fechaSolicitud}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleIniciarProceso(sol.id)}
                    >
                      Iniciar Evaluación
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Candidatos;