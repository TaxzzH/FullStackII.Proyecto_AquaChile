import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import { hoyISO, validarSolicitud } from '../../utils/validaciones';

function FormularioSolicitud({ candidatos, familias, responsables, candidatoInicialId, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(() => {
    const candidato = candidatos.find((c) => c.id === candidatoInicialId);
    return {
      candidatoId: candidato ? String(candidato.id) : '',
      cargo: candidato?.cargo ?? '',
      familiaCargo: candidato?.familiaCargo ?? '',
      fechaSolicitud: hoyISO(),
      evaluador: '',
      observaciones: '',
    };
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    setErrores({ ...errores, [name]: undefined });
  };

  // Al elegir un candidato se proponen su cargo y familia, que se pueden editar
  const handleCandidato = (e) => {
    const candidato = candidatos.find((c) => String(c.id) === e.target.value);
    setDatos({
      ...datos,
      candidatoId: e.target.value,
      cargo: candidato?.cargo ?? '',
      familiaCargo: candidato?.familiaCargo ?? '',
    });
    setErrores({ ...errores, candidatoId: undefined, cargo: undefined, familiaCargo: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validarSolicitud(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({
      ...datos,
      candidatoId: Number(datos.candidatoId),
      cargo: datos.cargo.trim(),
      observaciones: datos.observaciones.trim(),
    });
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <CampoFormulario
            id="candidatoId"
            etiqueta="Candidato"
            textoVacio="Selecciona un candidato"
            opciones={candidatos.map((c) => ({ valor: String(c.id), texto: c.nombre }))}
            value={datos.candidatoId}
            error={errores.candidatoId}
            onChange={handleCandidato}
          />
        </Col>
        <Col md={6}>
          <CampoFormulario id="fechaSolicitud" etiqueta="Fecha de solicitud" type="date" max={hoyISO()} value={datos.fechaSolicitud} error={errores.fechaSolicitud} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <CampoFormulario id="cargo" etiqueta="Cargo" value={datos.cargo} error={errores.cargo} onChange={handleChange} />
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
        <Col md={6}>
          <CampoFormulario
            id="evaluador"
            etiqueta="Profesional responsable"
            textoVacio="Selecciona un responsable"
            opciones={responsables.map((r) => ({ valor: r, texto: r }))}
            value={datos.evaluador}
            error={errores.evaluador}
            onChange={handleChange}
          />
        </Col>
        <Col xs={12}>
          <CampoFormulario id="observaciones" etiqueta="Observaciones (opcional)" as="textarea" rows={3} value={datos.observaciones} onChange={handleChange} />
        </Col>
      </Row>
      <div className="d-flex gap-2">
        <Button type="submit" variant="primary">Crear solicitud</Button>
        <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
      </div>
    </Form>
  );
}

export default FormularioSolicitud;
