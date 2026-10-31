import { Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import FormularioSolicitud from '../components/organisms/FormularioSolicitud';
import { agregarSolicitud, familiasCargo, getCandidatos, responsables } from '../data/mockData';

function NuevaSolicitud() {
  const location = useLocation();
  const navigate = useNavigate();
  const candidatoInicialId = Number(new URLSearchParams(location.search).get('candidato'));

  const handleGuardar = (datos) => {
    const nueva = agregarSolicitud(datos);
    navigate('/candidatos', {
      state: { mensaje: `Solicitud creada para ${nueva.nombreCandidato}.` },
    });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Nueva solicitud de evaluación</h2>
      <FormularioSolicitud
        candidatos={getCandidatos()}
        familias={familiasCargo}
        responsables={responsables}
        candidatoInicialId={candidatoInicialId}
        onGuardar={handleGuardar}
        onCancelar={() => navigate('/candidatos')}
      />
    </Container>
  );
}

export default NuevaSolicitud;
