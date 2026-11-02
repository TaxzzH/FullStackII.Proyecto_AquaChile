import { useState } from 'react';
import { Alert, Button, Card, Table } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import BadgeEstado from '../components/atoms/BadgeEstado';
import EstadoCarga from '../components/molecules/EstadoCarga';
import FiltrosSolicitudes from '../components/organisms/FiltrosSolicitudes';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import { estadosSolicitud } from '../data/catalogos';
import { useCarga } from '../hooks/useCarga';
import { obtenerSolicitudes } from '../services/api';
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
  const { datos, cargando, error, recargar } = useCarga(obtenerSolicitudes);

  const solicitudes = solicitudesVisibles(usuario, datos ?? []);
  const resultado = filtrarSolicitudes(solicitudes, filtros);

  return (
    <PlantillaPagina
      titulo="Solicitudes"
      acciones={
        <>
          {puede(usuario, 'gestionarRegistros') && (
            <Button as={Link} to="/solicitudes/nueva" variant="primary">Nueva solicitud</Button>
          )}
          <Button variant="outline-secondary" onClick={() => descargarCSV('solicitudes.csv', resultado, COLUMNAS_SOLICITUDES)}>
            Exportar a Excel
          </Button>
        </>
      }
    >
      <FiltrosSolicitudes
        filtros={filtros}
        estados={estadosSolicitud}
        onChange={setFiltros}
        onLimpiar={() => setFiltros(FILTROS_VACIOS)}
      />

      <EstadoCarga cargando={cargando} error={error} hayDatos={Boolean(datos)} onReintentar={recargar}>
        <p className="text-body-secondary">Mostrando {resultado.length} de {solicitudes.length} solicitudes.</p>

        {resultado.length === 0 ? (
          <Alert variant="secondary">No hay solicitudes que coincidan con estos filtros.</Alert>
        ) : (
          <Card>
            <Table responsive hover className="tabla-aqua align-middle">
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
                    <td><span className="etiqueta">{s.familiaCargo}</span></td>
                    <td>{s.fechaSolicitud}</td>
                    <td>{s.evaluador}</td>
                    <td><BadgeEstado estado={s.estado} /></td>
                    <td>
                      <Button as={Link} to={`/solicitudes/${s.id}`} variant="outline-secondary" size="sm">Ver detalle</Button>
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

export default Solicitudes;
