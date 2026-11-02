const CLASES = {
  Pendiente: 'estado-pendiente',
  'En proceso': 'estado-proceso',
  Finalizada: 'estado-finalizada',
  Rechazada: 'estado-rechazada',
};

// Muestra el estado de una solicitud con el color que le corresponde
function BadgeEstado({ estado }) {
  return <span className={`estado ${CLASES[estado] ?? ''}`}>{estado}</span>;
}

export default BadgeEstado;
