import { Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';

// Componente controlado: los filtros viven en la página y llegan por props
function FiltrosSolicitudes({ filtros, estados, onChange, onLimpiar }) {
  const handleChange = (e) => onChange({ ...filtros, [e.target.name]: e.target.value });

  return (
    <Form className="mb-3" onSubmit={(e) => e.preventDefault()}>
      <Row className="align-items-end">
        <Col xs={12} sm={6} lg={3}>
          <CampoFormulario id="candidato" etiqueta="Candidato" placeholder="Buscar por nombre" value={filtros.candidato} onChange={handleChange} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <CampoFormulario id="cargo" etiqueta="Cargo" placeholder="Buscar por cargo" value={filtros.cargo} onChange={handleChange} />
        </Col>
        <Col xs={12} sm={6} lg={2}>
          <CampoFormulario
            id="estado"
            etiqueta="Estado"
            textoVacio="Todos"
            opciones={estados.map((estado) => ({ valor: estado, texto: estado }))}
            value={filtros.estado}
            onChange={handleChange}
          />
        </Col>
        <Col xs={12} sm={6} lg={2}>
          <CampoFormulario id="fechaDesde" etiqueta="Solicitada desde" type="date" value={filtros.fechaDesde} onChange={handleChange} />
        </Col>
        <Col xs={12} lg={2}>
          <Button type="button" variant="outline-secondary" className="w-100 mb-3" onClick={onLimpiar}>Limpiar filtros</Button>
        </Col>
      </Row>
    </Form>
  );
}

export default FiltrosSolicitudes;
