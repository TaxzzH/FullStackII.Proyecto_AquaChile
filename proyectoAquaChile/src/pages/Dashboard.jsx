import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getSolicitudes } from '../data/mockData';
import { obtenerEstadisticas, resetearDatosBD } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState(() => {
    try {
      const data = getSolicitudes();
      return {
        pendientes: data.filter((s) => s.estado === 'Pendiente').length,
        enProceso: data.filter((s) => s.estado === 'En proceso').length,
        finalizadas: data.filter((s) => s.estado === 'Finalizada').length,
        rechazadas: data.filter((s) => s.estado === 'Rechazada').length,
        total: data.length,
      };
    } catch {
      return { pendientes: 0, enProceso: 0, finalizadas: 0, rechazadas: 0, total: 0 };
    }
  });

  const [mensaje, setMensaje] = useState('');
  const evaluadorNombre = 'Juan Pérez';

  const cargarEstadisticas = async () => {
    try {
      const data = await obtenerEstadisticas();
      setStats(data);
    } catch (err) {
      console.warn('API no disponible temporalmente, usando estado local:', err.message);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const handleReset = async () => {
    if (!window.confirm('¿Seguro que deseas reiniciar los datos de prueba en MySQL?')) return;
    try {
      await resetearDatosBD();
      setMensaje('Base de datos MySQL restablecida con datos iniciales.');
      await cargarEstadisticas();
    } catch (err) {
      alert(`Error al resetear datos: ${err.message}`);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      {/* CUADRO DE BIENVENIDA COMPATIBLE CON MODO OSCURO Y CLARO */}
      <div className="p-4 mb-4 rounded-3 welcome-card shadow-sm">
        <h1 className="display-6 fw-bold">¡Bienvenido(a), {evaluadorNombre}!</h1>
        <p className="lead text-subtle mb-0">
          Panel de control para la gestión y revisión de evaluaciones psicolaborales en AquaChile.
        </p>
      </div>

      {mensaje && (
        <Alert variant="info" dismissible onClose={() => setMensaje('')}>
          {mensaje}
        </Alert>
      )}

      <Row className="g-4">
        <Col md={3}>
          <Card className="text-white bg-warning h-100 shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title text-dark fw-bold">Solicitudes Pendientes</h5>
              <p className="card-text display-4 fw-bold text-dark mb-1">{stats.pendientes}</p>
              <p className="card-text text-dark small mb-3">Nuevas solicitudes sin revisar</p>
              <Link to="/candidatos" className="btn btn-dark btn-sm">
                Ver Candidatos
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-white bg-info h-100 shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title text-white fw-bold">En Proceso</h5>
              <p className="card-text display-4 fw-bold mb-1">{stats.enProceso}</p>
              <p className="card-text text-light small mb-3">Evaluaciones activas</p>
              <Link to="/resumen" className="btn btn-light text-dark btn-sm">
                Ir a Resumen
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-white bg-success h-100 shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title text-white fw-bold">Aprobadas / Finalizadas</h5>
              <p className="card-text display-4 fw-bold mb-1">{stats.finalizadas}</p>
              <p className="card-text text-light small mb-3">Evaluaciones completadas</p>
              <Link to="/resumen" className="btn btn-light text-dark btn-sm">
                Ver Historial
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-white bg-danger h-100 shadow-sm border-0">
            <Card.Body>
              <h5 className="card-title text-white fw-bold">Rechazadas</h5>
              <p className="card-text display-4 fw-bold mb-1">{stats.rechazadas}</p>
              <p className="card-text text-light small mb-3">Evaluaciones no aprobadas</p>
              <Link to="/resumen" className="btn btn-light text-dark btn-sm">
                Ver Rechazadas
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-danger btn-sm" onClick={handleReset}>
          🔄 Resetear datos de prueba en MySQL
        </button>
        <Link to="/rellenarNuevoFormulario" target="_blank" className="btn btn-outline-primary btn-sm">
          ↗ Abrir Formulario Público (/rellenarNuevoFormulario)
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
