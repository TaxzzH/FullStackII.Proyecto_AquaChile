import { useState } from 'react';
import { Alert, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import EstadoCarga from '../components/molecules/EstadoCarga';
import FormularioSolicitud from '../components/organisms/FormularioSolicitud';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import { familiasCargo, responsables } from '../data/catalogos';
import { useCarga } from '../hooks/useCarga';
import { crearSolicitud, obtenerCandidatos } from '../services/api';

function NuevaSolicitud() {
  const location = useLocation();
  const navigate = useNavigate();
  const { datos: candidatos, cargando, error, recargar } = useCarga(obtenerCandidatos);
  const [enviando, setEnviando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');
  const candidatoInicialId = Number(new URLSearchParams(location.search).get('candidato'));

  const handleGuardar = async (datos) => {
    setEnviando(true);
    setErrorGuardar('');
    try {
      await crearSolicitud(datos);
      const nombre = candidatos.find((c) => c.id === datos.candidatoId)?.nombre;
      navigate('/candidatos', { state: { mensaje: `Solicitud creada para ${nombre}.` } });
    } catch (err) {
      setErrorGuardar(err.message);
      setEnviando(false);
    }
  };

  return (
    <PlantillaPagina titulo="Nueva solicitud de evaluación">
      <EstadoCarga cargando={cargando} error={error} hayDatos={Boolean(candidatos)} onReintentar={recargar}>
        {candidatos && (
          <Card>
            <Card.Body>
              {errorGuardar && <Alert variant="danger">{errorGuardar}</Alert>}
              <FormularioSolicitud
                candidatos={candidatos}
                familias={familiasCargo}
                responsables={responsables}
                candidatoInicialId={candidatoInicialId}
                enviando={enviando}
                onGuardar={handleGuardar}
                onCancelar={() => navigate('/candidatos')}
              />
            </Card.Body>
          </Card>
        )}
      </EstadoCarga>
    </PlantillaPagina>
  );
}

export default NuevaSolicitud;
