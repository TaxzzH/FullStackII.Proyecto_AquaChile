import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import TarjetaIndicador from "../components/molecules/TarjetaIndicador";
import { getCandidatos, getSolicitudes, resetSolicitudes } from "../data/mockData";
import { descargarJSON, estructurarDatos } from "../utils/exportar";
import { puede } from "../utils/permisos";

function Dashboard({ usuario }) {
  const [candidatos] = useState(getCandidatos);
  const [solicitudes] = useState(getSolicitudes);

  const contar = (estado) => solicitudes.filter((s) => s.estado === estado).length;

  const handleReset = () => {
    resetSolicitudes();
    window.location.reload(); // Recarga para refrescar los contadores
  };

  return (
    <Container className="mt-4">
      <div className="p-4 mb-4 rounded-3 welcome-card">
        <h1 className="display-6 fw-bold">¡Bienvenido(a), {usuario.nombre}!</h1>
        <p className="lead text-subtle mb-0">
          Panel de control para la gestión y revisión de evaluaciones psicolaborales en AquaChile. Rol: {usuario.rol}.
        </p>
      </div>

      <Row className="g-4">
        <Col xs={12} sm={6} lg={3}>
          <TarjetaIndicador titulo="Total de Candidatos" valor={candidatos.length} descripcion="Candidatos registrados" color="primary" enlace="/candidatos" textoEnlace="Ver Candidatos" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <TarjetaIndicador titulo="Solicitudes Pendientes" valor={contar("Pendiente")} descripcion="Nuevas solicitudes sin revisar" color="warning" enlace="/solicitudes?estado=Pendiente" textoEnlace="Ver Pendientes" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <TarjetaIndicador titulo="En Proceso" valor={contar("En proceso")} descripcion="Evaluaciones en curso" color="info" enlace="/solicitudes?estado=En proceso" textoEnlace="Ver En Proceso" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <TarjetaIndicador titulo="Finalizadas" valor={contar("Finalizada")} descripcion="Evaluaciones completadas" color="success" enlace="/solicitudes?estado=Finalizada" textoEnlace="Ver Finalizadas" />
        </Col>
      </Row>

      {puede(usuario, "reiniciarDatos") && (
        <div className="d-flex flex-wrap gap-2 mt-4">
          <Button variant="outline-success" size="sm" onClick={() => descargarJSON("datos_aquachile.json", estructurarDatos(candidatos, solicitudes))}>
            Exportar datos (JSON)
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleReset}>
            Resetear datos de prueba
          </Button>
        </div>
      )}
    </Container>
  );
}

export default Dashboard;
