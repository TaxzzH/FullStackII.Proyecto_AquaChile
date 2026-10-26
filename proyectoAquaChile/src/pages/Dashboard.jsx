import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSolicitudes } from "../data/mockData";

function Dashboard() {
  const [stats, setStats] = useState({ pendientes: 0, enProceso: 0, finalizadas: 0 });
  const evaluadorNombre = "Juan Pérez";

  useEffect(() => {
    const data = getSolicitudes();
    setStats({
      pendientes: data.filter((s) => s.estado === "Pendiente").length,
      enProceso: data.filter((s) => s.estado === "En proceso").length,
      finalizadas: data.filter((s) => s.estado === "Finalizada").length,
    });
  }, []);

  return (
    <div className="container mt-4">

      <div className="p-4 mb-4 rounded-3 welcome-card">
        <h1 className="display-6 fw-bold">¡Bienvenido(a), {evaluadorNombre}!</h1>
        <p className="lead text-subtle mb-0">
          Panel de control para la gestión y revisión de evaluaciones psicolaborales en AquaChile.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-white bg-warning h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Solicitudes Pendientes</h5>
              <p className="card-text display-4 fw-bold">{stats.pendientes}</p>
              <p className="card-text"><small>Nuevas solicitudes sin revisar</small></p>
              <Link to="/candidatos" className="btn btn-light text-dark btn-sm">
                Ver Candidatos
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-info h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">En Proceso</h5>
              <p className="card-text display-4 fw-bold">{stats.enProceso}</p>
              <p className="card-text"><small>Evaluaciones en curso</small></p>
              <Link to="/solicitudes" className="btn btn-light text-dark btn-sm">
                Ir a Resumen
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Aprobadas / Finalizadas</h5>
              <p className="card-text display-4 fw-bold">{stats.finalizadas}</p>
              <p className="card-text"><small>Evaluaciones completadas</small></p>
              <Link to="/solicitudes" className="btn btn-light text-dark btn-sm">
                Ver Historial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;