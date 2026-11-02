// Única puerta de entrada a los datos: todas las páginas hablan con el backend desde aquí
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const pedir = async (ruta, { metodo = 'GET', datos } = {}) => {
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, {
      method: metodo,
      headers: datos ? { 'Content-Type': 'application/json' } : undefined,
      body: datos ? JSON.stringify(datos) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa que el backend y MySQL estén encendidos.');
  }

  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new Error(cuerpo?.error ?? 'El servidor no pudo completar la operación.');
  }
  return cuerpo;
};

export const enviarPostulacion = (datos) => pedir('/postulaciones', { metodo: 'POST', datos });

export const obtenerCandidatos = () => pedir('/candidatos');
export const crearCandidato = (datos) => pedir('/candidatos', { metodo: 'POST', datos });
export const actualizarCandidato = (id, datos) => pedir(`/candidatos/${id}`, { metodo: 'PUT', datos });

export const obtenerSolicitudes = () => pedir('/solicitudes');
export const obtenerSolicitud = (id) => pedir(`/solicitudes/${id}`);
export const crearSolicitud = (datos) => pedir('/solicitudes', { metodo: 'POST', datos });
export const iniciarEvaluacion = (id) => pedir(`/solicitudes/${id}/iniciar`, { metodo: 'PATCH' });
export const evaluarSolicitud = (id, datos) => pedir(`/solicitudes/${id}/evaluar`, { metodo: 'PATCH', datos });

export const obtenerEstadisticas = () => pedir('/estadisticas');
export const resetearDatosBD = () => pedir('/reset', { metodo: 'POST' });
