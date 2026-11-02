import { useState } from 'react';
import { Alert, Card } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EstadoCarga from '../components/molecules/EstadoCarga';
import FormularioCandidato from '../components/organisms/FormularioCandidato';
import PlantillaPagina from '../components/templates/PlantillaPagina';
import { familiasCargo } from '../data/catalogos';
import { useCarga } from '../hooks/useCarga';
import { actualizarCandidato, crearCandidato, obtenerCandidatos } from '../services/api';

function CandidatoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { datos: candidatos, cargando, error, recargar } = useCarga(obtenerCandidatos);
  const [enviando, setEnviando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');

  const candidato = id ? candidatos?.find((c) => c.id === Number(id)) : undefined;
  const titulo = id ? 'Editar candidato' : 'Registrar candidato';

  const handleGuardar = async (datos) => {
    setEnviando(true);
    setErrorGuardar('');
    try {
      if (candidato) {
        await actualizarCandidato(candidato.id, datos);
      } else {
        await crearCandidato(datos);
      }
      navigate('/candidatos', {
        state: { mensaje: `Candidato ${datos.nombre} ${candidato ? 'actualizado' : 'registrado'}.` },
      });
    } catch (err) {
      setErrorGuardar(err.message);
      setEnviando(false);
    }
  };

  return (
    <PlantillaPagina titulo={titulo}>
      <EstadoCarga cargando={cargando} error={error} hayDatos={Boolean(candidatos)} onReintentar={recargar}>
        {candidatos && id && !candidato ? (
          <Alert variant="warning">
            No encontramos ese candidato. <Link to="/candidatos">Volver a Candidatos</Link>
          </Alert>
        ) : (
          candidatos && (
            <Card>
              <Card.Body>
                {errorGuardar && <Alert variant="danger">{errorGuardar}</Alert>}
                <FormularioCandidato
                  key={id ?? 'nuevo'}
                  candidatoInicial={candidato}
                  candidatos={candidatos}
                  familias={familiasCargo}
                  enviando={enviando}
                  onGuardar={handleGuardar}
                  onCancelar={() => navigate('/candidatos')}
                />
              </Card.Body>
            </Card>
          )
        )}
      </EstadoCarga>
    </PlantillaPagina>
  );
}

export default CandidatoForm;
