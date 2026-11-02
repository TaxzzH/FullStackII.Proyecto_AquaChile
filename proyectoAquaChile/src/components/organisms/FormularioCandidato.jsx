import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import { validarCandidato } from '../../utils/validaciones';

const CANDIDATO_VACIO = { nombre: '', correo: '', telefono: '', cargo: '', familiaCargo: '' };

// Lo usan el registro interno y la postulación pública: cambia lo que reciben por props
function FormularioCandidato({ candidatoInicial, candidatos = [], familias, onGuardar, onCancelar, enviando = false, textoGuardar = 'Guardar candidato' }) {
  const [datos, setDatos] = useState({ ...CANDIDATO_VACIO, ...candidatoInicial });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    setErrores({ ...errores, [name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validarCandidato(datos, candidatos, candidatoInicial?.id ?? null);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono.trim(),
      cargo: datos.cargo.trim(),
      familiaCargo: datos.familiaCargo,
    });
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <CampoFormulario id="nombre" etiqueta="Nombre" value={datos.nombre} error={errores.nombre} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" placeholder="nombre@ejemplo.cl" value={datos.correo} error={errores.correo} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <CampoFormulario id="telefono" etiqueta="Teléfono" type="tel" placeholder="+56 9 1234 5678" value={datos.telefono} error={errores.telefono} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <CampoFormulario id="cargo" etiqueta="Cargo al que postula" value={datos.cargo} error={errores.cargo} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <CampoFormulario
            id="familiaCargo"
            etiqueta="Familia de cargo"
            textoVacio="Selecciona una familia"
            opciones={familias.map((f) => ({ valor: f, texto: f }))}
            value={datos.familiaCargo}
            error={errores.familiaCargo}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" disabled={enviando}>{enviando ? 'Guardando...' : textoGuardar}</Button>
        {onCancelar && <Button type="button" variant="outline-secondary" onClick={onCancelar}>Cancelar</Button>}
      </div>
    </Form>
  );
}

export default FormularioCandidato;
