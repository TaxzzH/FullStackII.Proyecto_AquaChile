import { Container } from 'react-bootstrap';

// Estructura común de las páginas internas: título, descripción, acciones y contenido
function PlantillaPagina({ titulo, descripcion, acciones, children }) {
  return (
    <Container className="mt-4">
      <header className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h2 mb-1">{titulo}</h1>
          {descripcion && <p className="text-body-secondary mb-0">{descripcion}</p>}
        </div>
        {acciones && <div className="d-flex flex-wrap gap-2">{acciones}</div>}
      </header>
      {children}
    </Container>
  );
}

export default PlantillaPagina;
