import { useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import BadgeEstado from '../components/atoms/BadgeEstado';
import FiltrosSolicitudes from '../components/organisms/FiltrosSolicitudes';
import { estadosSolicitud, getSolicitudes } from '../data/mockData';
import { COLUMNAS_SOLICITUDES, descargarCSV } from '../utils/exportar';
import { FILTROS_VACIOS, filtrarSolicitudes } from '../utils/filtros';
import { puede, solicitudesVisibles } from '../utils/permisos';

function Solicitudes({ usuario }) {
  const { search } = useLocation();
  // El dashboard puede abrir esta página con un estado ya elegido: /solicitudes?estado=Pendiente
  const [filtros, setFiltros] = useState({
    ...FILTROS_VACIOS,
    estado: new URLSearchParams(search).get('estado') ?? '',
  });
  const [solicitudes] = useState(() => solicitudesVisibles(usuario, getSolicitudes()));
  const resultado = filtrarSolicitudes(solicitudes, filtros);

  return (
    <Container className="mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="mb-0">Solicitudes</h2>
        <div className="d-flex flex-wrap gap-2">
          {puede(usuario, 'gestionarRegistros') && (
            <Button as={Link} to="/solicitudes/nueva" variant="primary">Nueva solicitud</Button>
          )}
          <Button variant="outline-success" onClick={() => descargarCSV('solicitudes.csv', resultado, COLUMNAS_SOLICITUDES)}>
            Exportar a Excel
          </Button>
        </div>
      </div>

      <FiltrosSolicitudes
        filtros={filtros}
        estados={estadosSolicitud}
        onChange={setFiltros}
        onLimpiar={() => setFiltros(FILTROS_VACIOS)}
      />

      <p className="text-body-secondary">Mostrando {resultado.length} de {solicitudes.length} solicitudes.</p>

      {resultado.length === 0 ? (
        <Alert variant="secondary">No hay solicitudes que coincidan con estos filtros.</Alert>
      ) : (
        <Table responsive hover bordered className="align-middle">
          <thead>
            <tr>
              <th>Candidato</th>
              <th>Cargo</th>
              <th>Familia de cargo</th>
              <th>Fecha de solicitud</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {resultado.map((s) => (
              <tr key={s.id}>
                <td className="fw-bold">{s.nombreCandidato}</td>
                <td>{s.cargo}</td>
                <td>{s.familiaCargo}</td>
                <td>{s.fechaSolicitud}</td>
                <td>{s.evaluador}</td>
                <td><BadgeEstado estado={s.estado} /></td>
                <td>
                  <Button as={Link} to={`/solicitudes/${s.id}`} variant="outline-primary" size="sm">Ver detalle</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Solicitudes;
