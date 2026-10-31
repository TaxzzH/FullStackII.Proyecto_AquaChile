import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import { hoyISO, validarEvaluacion } from '../../utils/validaciones';

const ESTADOS = [
  { valor: 'En proceso', texto: 'En proceso' },
  { valor: 'Finalizada', texto: 'Finalizada' },
];

function FormularioEvaluacion({ solicitud, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState({
    fechaEvaluacion: solicitud.fechaEvaluacion || hoyISO(),
    estado: solicitud.estado,
    observaciones: solicitud.observaciones || '',
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    setErrores({ ...errores, [name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validarEvaluacion(datos, solicitud.fechaSolicitud);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onGuardar({ ...datos, observaciones: datos.observaciones.trim() });
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <CampoFormulario id="fechaEvaluacion" etiqueta="Fecha de evaluación" type="date" min={solicitud.fechaSolicitud} value={datos.fechaEvaluacion} error={errores.fechaEvaluacion} onChange={handleChange} />
      <CampoFormulario id="estado" etiqueta="Estado" textoVacio="Selecciona un estado" opciones={ESTADOS} value={datos.estado} error={errores.estado} onChange={handleChange} />
      <CampoFormulario
        id="observaciones"
        etiqueta="Resultado u observaciones"
        as="textarea"
        rows={4}
        placeholder="Ingrese los detalles y conclusión de la evaluación..."
        value={datos.observaciones}
        error={errores.observaciones}
        onChange={handleChange}
      />
      <div className="d-flex justify-content-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
        <Button type="submit" variant="success">Guardar evaluación</Button>
      </div>
    </Form>
  );
}

export default FormularioEvaluacion;
