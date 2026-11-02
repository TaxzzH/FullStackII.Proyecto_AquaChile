import { useState } from "react";
import { Alert, Button, Card, Table } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import BadgeEstado from "../components/atoms/BadgeEstado";
import EstadoCarga from "../components/molecules/EstadoCarga";
import PlantillaPagina from "../components/templates/PlantillaPagina";
import { useCarga } from "../hooks/useCarga";
import { iniciarEvaluacion, obtenerCandidatos, obtenerSolicitudes } from "../services/api";
import { COLUMNAS_CANDIDATOS, descargarCSV } from "../utils/exportar";
import { puede, puedeEvaluar, solicitudesVisibles } from "../utils/permisos";

const cargarDatos = async () => {
  const [candidatos, solicitudes] = await Promise.all([obtenerCandidatos(), obtenerSolicitudes()]);
  return { candidatos, solicitudes };
};

function Candidatos({ usuario }) {
  const { datos, cargando, error, recargar } = useCarga(cargarDatos);
  const mensajeInicial = useLocation().state?.mensaje;
  const [aviso, setAviso] = useState(mensajeInicial ? { tipo: "success", texto: mensajeInicial } : null);
  const [procesandoId, setProcesandoId] = useState(null);

  const gestiona = puede(usuario, "gestionarRegistros");
  const candidatos = datos?.candidatos ?? [];
  const pendientes = solicitudesVisibles(usuario, datos?.solicitudes ?? []).filter((s) => s.estado === "Pendiente");

  const handleIniciar = async (solicitud) => {
    setProcesandoId(solicitud.id);
    try {
      await iniciarEvaluacion(solicitud.id);
      setAviso({ tipo: "success", texto: `Evaluación iniciada para ${solicitud.nombreCandidato}. Ahora está en Resumen.` });
      await recargar();
    } catch (err) {
      setAviso({ tipo: "danger", texto: err.message });
    } finally {
      setProcesandoId(null);
    }
  };

  return (
    <PlantillaPagina
      titulo="Candidatos"
      acciones={
        <>
          {gestiona && <Button as={Link} to="/candidatos/nuevo" variant="primary">Registrar candidato</Button>}
          {gestiona && <Button as={Link} to="/solicitudes/nueva" variant="outline-secondary">Nueva solicitud</Button>}
          <Button variant="outline-secondary" onClick={() => descargarCSV("candidatos.csv", candidatos, COLUMNAS_CANDIDATOS)}>
            Exportar a Excel
          </Button>
        </>
      }
    >
      {aviso && <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)}>{aviso.texto}</Alert>}

      <EstadoCarga cargando={cargando} error={error} hayDatos={Boolean(datos)} onReintentar={recargar}>
        <Card className="mb-5">
          <Table responsive hover className="tabla-aqua align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Cargo postulado</th>
                <th>Familia de cargo</th>
                {gestiona && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {candidatos.map((c) => (
                <tr key={c.id}>
                  <td className="fw-bold">{c.nombre}</td>
                  <td>
                    <div>{c.correo}</div>
                    <small className="text-body-secondary">{c.telefono}</small>
                  </td>
                  <td>{c.cargo}</td>
                  <td><span className="etiqueta">{c.familiaCargo}</span></td>
                  {gestiona && (
                    <td>
                      <div className="d-flex gap-2">
                        <Button as={Link} to={`/candidatos/${c.id}/editar`} variant="outline-secondary" size="sm">Editar</Button>
                        <Button as={Link} to={`/solicitudes/nueva?candidato=${c.id}`} variant="outline-secondary" size="sm">Crear solicitud</Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <h2 className="h4 mb-2">Solicitudes pendientes</h2>
        <p className="text-body-secondary">Solicitudes recibidas cuya evaluación aún no se inicia.</p>

        {pendientes.length === 0 ? (
          <Alert variant="secondary">No hay solicitudes pendientes en este momento.</Alert>
        ) : (
          <Card>
            <Table responsive hover className="tabla-aqua align-middle">
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Cargo postulado</th>
                  <th>Fecha de solicitud</th>
                  <th>Responsable</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((sol) => (
                  <tr key={sol.id}>
                    <td className="fw-bold">{sol.nombreCandidato}</td>
                    <td>{sol.cargo}</td>
                    <td>{sol.fechaSolicitud}</td>
                    <td>{sol.evaluador}</td>
                    <td><BadgeEstado estado={sol.estado} /></td>
                    <td>
                      {puedeEvaluar(usuario, sol) ? (
                        <Button variant="primary" size="sm" disabled={procesandoId === sol.id} onClick={() => handleIniciar(sol)}>
                          Iniciar Evaluación
                        </Button>
                      ) : (
                        <Link to={`/solicitudes/${sol.id}`}>Ver detalle</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </EstadoCarga>
    </PlantillaPagina>
  );
}

export default Candidatos;
