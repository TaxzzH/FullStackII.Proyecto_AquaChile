import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Indicador del dashboard. "tono": neutro, pendiente, proceso, finalizada o rechazada.
function TarjetaIndicador({ titulo, valor, descripcion, tono = 'neutro', enlace, textoEnlace }) {
  return (
    <Card className={`indicador indicador-${tono} h-100`}>
      <Card.Body>
        <Card.Title as="h3">{titulo}</Card.Title>
        <p className="indicador-valor">{valor}</p>
        <p className="card-text"><small>{descripcion}</small></p>
        <Button as={Link} to={enlace} variant="outline-secondary" size="sm">{textoEnlace}</Button>
      </Card.Body>
    </Card>
  );
}

export default TarjetaIndicador;
