import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Indicador del dashboard: título, valor, descripción y enlace al listado relacionado
function TarjetaIndicador({ titulo, valor, descripcion, color, enlace, textoEnlace }) {
  return (
    <Card bg={color} text={color === 'warning' || color === 'info' ? 'dark' : 'white'} className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title as="h5">{titulo}</Card.Title>
        <p className="card-text display-4 fw-bold">{valor}</p>
        <p className="card-text"><small>{descripcion}</small></p>
        <Button as={Link} to={enlace} variant="light" size="sm" className="text-dark">{textoEnlace}</Button>
      </Card.Body>
    </Card>
  );
}

export default TarjetaIndicador;
