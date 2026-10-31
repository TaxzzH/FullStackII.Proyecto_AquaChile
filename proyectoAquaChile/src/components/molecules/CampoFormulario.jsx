import { Form } from 'react-bootstrap';

// Etiqueta + control + mensaje de error. Si recibe "opciones" dibuja un select.
function CampoFormulario({ id, etiqueta, error, opciones, textoVacio, ...props }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      {opciones ? (
        <Form.Select name={id} isInvalid={Boolean(error)} {...props}>
          <option value="">{textoVacio}</option>
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control name={id} isInvalid={Boolean(error)} {...props} />
      )}
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
}

export default CampoFormulario;
