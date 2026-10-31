import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { getCandidatos, getSolicitudes, saveSolicitudes } from "../data/mockData";

function Candidatos() {
  const [pendientes, setPendientes] = useState([]);
  const [candidatos] = useState(getCandidatos);
  const mensaje = useLocation().state?.mensaje;

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
      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Candidatos</h2>
        <div className="d-flex gap-2">
          <Button as={Link} to="/candidatos/nuevo" variant="primary">Registrar candidato</Button>
          <Button as={Link} to="/solicitudes/nueva" variant="outline-primary">Nueva solicitud</Button>
        </div>
      </div>

      <div className="table-responsive mb-5">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Cargo Postulado</th>
              <th>Familia de Cargo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {candidatos.map((c) => (
              <tr key={c.id}>
                <td className="fw-bold">{c.nombre}</td>
                <td>
                  <div>{c.correo}</div>
                  <small className="text-muted">{c.telefono}</small>
                </td>
                <td>{c.cargo}</td>
                <td><span className="badge bg-secondary">{c.familiaCargo}</span></td>
                <td>
                  <div className="d-flex gap-2">
                    <Button as={Link} to={`/candidatos/${c.id}/editar`} variant="outline-secondary" size="sm">Editar</Button>
                    <Button as={Link} to={`/solicitudes/nueva?candidato=${c.id}`} variant="outline-primary" size="sm">Crear solicitud</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="h4 mb-2">Solicitudes pendientes</h3>
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