import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import CampoFormulario from '../molecules/CampoFormulario';
import { validarIngreso } from '../../utils/validaciones';

function FormularioIngreso({ usuarios, onIngresar }) {
  const [usuarioId, setUsuarioId] = useState('');
  const [errores, setErrores] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validarIngreso({ usuarioId });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    onIngresar(usuarios.find((u) => String(u.id) === usuarioId));
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <CampoFormulario
        id="usuarioId"
        etiqueta="Usuario de prueba"
        textoVacio="Selecciona un usuario"
        opciones={usuarios.map((u) => ({ valor: String(u.id), texto: `${u.nombre} (${u.rol})` }))}
        value={usuarioId}
        error={errores.usuarioId}
        onChange={(e) => {
          setUsuarioId(e.target.value);
          setErrores({});
        }}
      />
      <Button type="submit" variant="primary" className="w-100">Ingresar</Button>
    </Form>
  );
}

export default FormularioIngreso;
