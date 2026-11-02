// Servicio cliente para comunicarse con la API de Express (backendAquaChile)
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * 1. Enviar una postulación desde el formulario público (/rellenarNuevoFormulario)
 */
export const enviarPostulacion = async (datos) => {
  const respuesta = await fetch(`${API_BASE_URL}/postulaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const data = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(data.error || 'Error al enviar la postulación');
  }
  return data;
};

/**
 * 2. Obtener la lista de candidatos que han enviado postulación
 */
export const obtenerCandidatos = async () => {
  const respuesta = await fetch(`${API_BASE_URL}/candidatos`);
  if (!respuesta.ok) {
    throw new Error('Error al obtener la lista de candidatos');
  }
  return await respuesta.json();
};

/**
 * 3. Obtener solicitudes de evaluación (opcionalmente filtradas por estado)
 */
export const obtenerSolicitudes = async (estado = '') => {
  const url = estado
    ? `${API_BASE_URL}/solicitudes?estado=${encodeURIComponent(estado)}`
    : `${API_BASE_URL}/solicitudes`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error('Error al obtener solicitudes');
  }
  return await respuesta.json();
};

/**
 * 4. Iniciar evaluación para un postulante (Pasa de "Pendiente" a "En proceso")
 */
export const iniciarEvaluacion = async (solicitudId) => {
  const respuesta = await fetch(`${API_BASE_URL}/solicitudes/${solicitudId}/iniciar`, {
    method: 'PATCH',
  });
  const data = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(data.error || 'Error al iniciar la evaluación');
  }
  return data;
};

/**
 * 5. Guardar el resultado de la evaluación ("Finalizada" o "Rechazada")
 */
export const evaluarSolicitud = async (solicitudId, datosEvaluacion) => {
  const respuesta = await fetch(`${API_BASE_URL}/solicitudes/${solicitudId}/evaluar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosEvaluacion),
  });
  const data = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(data.error || 'Error al guardar la evaluación');
  }
  return data;
};

/**
 * 6. Obtener estadísticas para las tarjetas del Dashboard
 */
export const obtenerEstadisticas = async () => {
  const respuesta = await fetch(`${API_BASE_URL}/estadisticas`);
  if (!respuesta.ok) {
    throw new Error('Error al obtener estadísticas del dashboard');
  }
  return await respuesta.json();
};

/**
 * 7. Restaurar datos de prueba iniciales en MySQL
 */
export const resetearDatosBD = async () => {
  const respuesta = await fetch(`${API_BASE_URL}/reset`, {
    method: 'POST',
  });
  const data = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(data.error || 'Error al resetear la base de datos');
  }
  return data;
};
