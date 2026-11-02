import { Alert, Button, Spinner } from 'react-bootstrap';

// Muestra la espera o el error de una carga; cuando hay datos, dibuja el contenido
function EstadoCarga({ cargando, error, hayDatos, onReintentar, children }) {
  if (error) {
    return (
      <Alert variant="danger">
        <p>{error}</p>
        <Button variant="outline-danger" size="sm" onClick={onReintentar}>Reintentar</Button>
      </Alert>
    );
  }

  if (cargando && !hayDatos) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" aria-label="Cargando" />
      </div>
    );
  }

  return children;
}

export default EstadoCarga;
