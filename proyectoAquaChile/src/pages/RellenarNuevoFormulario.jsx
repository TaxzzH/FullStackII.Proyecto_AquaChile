import { useState } from 'react';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import logoAC from '../assets/Logo_AquaChile.png';
import logoACW from '../assets/Logo_AquaChileWhite.png';
import FormularioCandidato from '../components/organisms/FormularioCandidato';
import { familiasCargo } from '../data/catalogos';
import { enviarPostulacion } from '../services/api';

// Página pública: el postulante envía sus datos sin ingresar al sistema
function RellenarNuevoFormulario({ tema }) {
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleGuardar = async (datos) => {
    setEnviando(true);
    setError('');
    try {
      await enviarPostulacion(datos);
      setEnviado(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="pagina-publica">
      <Container className="contenido">
        <div className="text-center mb-4">
          <img className="logo mb-3" src={tema === 'dark' ? logoACW : logoAC} alt="AquaChile" />
          <h1 className="h3">Portal de Postulaciones AquaChile</h1>
          <p className="text-body-secondary">
            Completa tus antecedentes para participar en nuestros procesos de evaluación y selección.
          </p>
        </div>

        <Card>
          <Card.Body className="p-4">
            {enviado ? (
              <div className="text-center">
                <h2 className="h4 mb-3">Recibimos tu postulación</h2>
                <p className="text-body-secondary">Tus datos quedaron registrados. El equipo evaluará tus antecedentes.</p>
                <Button variant="outline-secondary" onClick={() => setEnviado(false)}>Enviar otra postulación</Button>
              </div>
            ) : (
              <>
                {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                <FormularioCandidato
                  familias={familiasCargo}
                  enviando={enviando}
                  textoGuardar="Enviar postulación"
                  onGuardar={handleGuardar}
                />
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default RellenarNuevoFormulario;
