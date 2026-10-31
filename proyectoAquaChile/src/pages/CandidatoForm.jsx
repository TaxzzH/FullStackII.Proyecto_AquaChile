import { Alert, Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FormularioCandidato from '../components/organisms/FormularioCandidato';
import { actualizarCandidato, agregarCandidato, familiasCargo, getCandidatos } from '../data/mockData';

function CandidatoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const candidatos = getCandidatos();
  const candidato = id ? candidatos.find((c) => c.id === Number(id)) : undefined;

  if (id && !candidato) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          No encontramos ese candidato. <Link to="/candidatos">Volver a Candidatos</Link>
        </Alert>
      </Container>
    );
  }

  const handleGuardar = (datos) => {
    if (candidato) {
      actualizarCandidato(candidato.id, datos);
    } else {
      agregarCandidato(datos);
    }
    navigate('/candidatos', {
      state: { mensaje: `Candidato ${datos.nombre} ${candidato ? 'actualizado' : 'registrado'}.` },
    });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">{candidato ? 'Editar candidato' : 'Registrar candidato'}</h2>
      <FormularioCandidato
        key={id ?? 'nuevo'}
        candidatoInicial={candidato}
        candidatos={candidatos}
        familias={familiasCargo}
        onGuardar={handleGuardar}
        onCancelar={() => navigate('/candidatos')}
      />
    </Container>
  );
}

export default CandidatoForm;
