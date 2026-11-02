import { Badge } from 'react-bootstrap';

const COLORES = { Pendiente: 'warning', 'En proceso': 'info', Finalizada: 'success' };

// Muestra el estado de una solicitud con el color que le corresponde
function BadgeEstado({ estado }) {
  return (
    <Badge bg={COLORES[estado] ?? 'secondary'} text={estado === 'Finalizada' ? undefined : 'dark'}>
      {estado}
    </Badge>
  );
}

export default BadgeEstado;
