// Fecha de hoy según el reloj local, en formato AAAA-MM-DD
export const hoyISO = () => {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
};

const vacio = (valor) => !String(valor ?? "").trim();

export const validarCandidato = (datos, candidatos = [], idActual = null) => {
  const errores = {};
  const correo = String(datos.correo ?? "").trim().toLowerCase();

  if (vacio(datos.nombre)) {
    errores.nombre = "Ingresa el nombre del candidato.";
  } else if (datos.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!correo) {
    errores.correo = "Ingresa el correo electrónico.";
  } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
    errores.correo = "Ingresa un correo válido, por ejemplo nombre@ejemplo.cl.";
  } else if (candidatos.some((c) => c.id !== idActual && c.correo?.toLowerCase() === correo)) {
    errores.correo = "Ya existe un candidato registrado con este correo.";
  }

  if (vacio(datos.telefono)) {
    errores.telefono = "Ingresa el teléfono.";
  } else if (!/^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/.test(datos.telefono.trim())) {
    errores.telefono = "Ingresa un celular chileno, por ejemplo +56 9 1234 5678.";
  }

  if (vacio(datos.cargo)) errores.cargo = "Ingresa el cargo al que postula.";
  if (vacio(datos.familiaCargo)) errores.familiaCargo = "Selecciona la familia de cargo.";

  return errores;
};

export const validarSolicitud = (datos) => {
  const errores = {};

  if (vacio(datos.candidatoId)) errores.candidatoId = "Selecciona un candidato.";
  if (vacio(datos.cargo)) errores.cargo = "Ingresa el cargo.";
  if (vacio(datos.familiaCargo)) errores.familiaCargo = "Selecciona la familia de cargo.";
  if (vacio(datos.evaluador)) errores.evaluador = "Selecciona un profesional responsable.";

  if (vacio(datos.fechaSolicitud)) {
    errores.fechaSolicitud = "Ingresa la fecha de solicitud.";
  } else if (datos.fechaSolicitud > hoyISO()) {
    errores.fechaSolicitud = "La fecha de solicitud no puede ser futura.";
  }

  return errores;
};

export const validarEvaluacion = (datos, fechaSolicitud) => {
  const errores = {};
  const esCierre = datos.estado === "Finalizada" || datos.estado === "Rechazada";

  if (vacio(datos.estado)) errores.estado = "Selecciona el estado de la evaluación.";

  if (vacio(datos.fechaEvaluacion)) {
    errores.fechaEvaluacion = "Ingresa la fecha de evaluación.";
  } else if (fechaSolicitud && datos.fechaEvaluacion < fechaSolicitud) {
    errores.fechaEvaluacion = "La fecha de evaluación no puede ser anterior a la solicitud.";
  } else if (esCierre && datos.fechaEvaluacion > hoyISO()) {
    errores.fechaEvaluacion = "Una evaluación cerrada no puede tener fecha futura.";
  }

  if (esCierre && vacio(datos.observaciones)) {
    errores.observaciones = "Ingresa el resultado u observaciones para finalizar.";
  }

  return errores;
};
