import { useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import EstadoCarga from "../components/molecules/EstadoCarga";
import TarjetaIndicador from "../components/molecules/TarjetaIndicador";
import { useCarga } from "../hooks/useCarga";
import { obtenerCandidatos, obtenerEstadisticas, obtenerSolicitudes, resetearDatosBD } from "../services/api";
import { descargarJSON, estructurarDatos } from "../utils/exportar";
import { puede } from "../utils/permisos";

function Dashboard({ usuario }) {
  const { datos: stats, cargando, error, recargar } = useCarga(obtenerEstadisticas);
  const [aviso, setAviso] = useState(null);

  const handleReset = async () => {
    if (!window.confirm("¿Seguro que quieres reiniciar los datos de prueba? Se perderán los registros creados.")) return;
    try {
      await resetearDatosBD();
      setAviso({ tipo: "success", texto: "Datos de prueba restaurados." });
      await recargar();
    } catch (err) {
      setAviso({ tipo: "danger", texto: err.message });
    }
  };

  const handleExportar = async () => {
    try {
      const [candidatos, solicitudes] = await Promise.all([obtenerCandidatos(), obtenerSolicitudes()]);
      descargarJSON("datos_aquachile.json", estructurarDatos(candidatos, solicitudes));
    } catch (err) {
      setAviso({ tipo: "danger", texto: err.message });
    }
  };

  return (
    <Container className="mt-4">
      <div className="panel-bienvenida mb-4">
        <h1 className="h2">¡Bienvenido(a), {usuario.nombre}!</h1>
        <p className="text-body-secondary mb-0">
          Panel de control para la gestión y revisión de evaluaciones psicolaborales en AquaChile. Rol: {usuario.rol}.
        </p>
      </div>

      {aviso && (
        <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)}>{aviso.texto}</Alert>
      )}

      <EstadoCarga cargando={cargando} error={error} hayDatos={Boolean(stats)} onReintentar={recargar}>
        {stats && (
          <Row xs={1} sm={2} lg={3} xl={5} className="g-4">
            <Col>
              <TarjetaIndicador titulo="Total de Candidatos" valor={stats.candidatos} descripcion="Candidatos registrados" enlace="/candidatos" textoEnlace="Ver Candidatos" />
            </Col>
            <Col>
              <TarjetaIndicador titulo="Solicitudes Pendientes" valor={stats.pendientes} descripcion="Sin evaluación iniciada" tono="pendiente" enlace="/solicitudes?estado=Pendiente" textoEnlace="Ver Pendientes" />
            </Col>
            <Col>
              <TarjetaIndicador titulo="En Proceso" valor={stats.enProceso} descripcion="Evaluaciones en curso" tono="proceso" enlace="/solicitudes?estado=En proceso" textoEnlace="Ver En Proceso" />
            </Col>
            <Col>
              <TarjetaIndicador titulo="Finalizadas" valor={stats.finalizadas} descripcion="Evaluaciones aprobadas" tono="finalizada" enlace="/solicitudes?estado=Finalizada" textoEnlace="Ver Finalizadas" />
            </Col>
            <Col>
              <TarjetaIndicador titulo="Rechazadas" valor={stats.rechazadas} descripcion="Evaluaciones no aprobadas" tono="rechazada" enlace="/solicitudes?estado=Rechazada" textoEnlace="Ver Rechazadas" />
            </Col>
          </Row>
        )}
      </EstadoCarga>

      <div className="d-flex flex-wrap gap-2 mt-4">
        <Button as={Link} to="/rellenarNuevoFormulario" target="_blank" rel="noopener noreferrer" variant="outline-secondary" size="sm">
          Abrir formulario público
        </Button>
        {puede(usuario, "reiniciarDatos") && (
          <>
            <Button variant="outline-secondary" size="sm" onClick={handleExportar}>Exportar datos (JSON)</Button>
            <Button variant="outline-danger" size="sm" onClick={handleReset}>Resetear datos de prueba</Button>
          </>
        )}
      </div>
    </Container>
  );
}

export default Dashboard;
