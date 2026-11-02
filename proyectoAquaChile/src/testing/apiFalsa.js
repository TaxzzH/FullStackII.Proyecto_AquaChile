// Mock de services/api: las pruebas de pantallas usan estos datos en memoria, sin backend ni MySQL
const CANDIDATOS = [
  { id: 1, nombre: 'María González', correo: 'mgonzalez@ejemplo.cl', telefono: '+56 9 1234 5678', cargo: 'Operador de Planta', familiaCargo: 'Operaciones' },
  { id: 2, nombre: 'Carlos Rojas', correo: 'crojas@ejemplo.cl', telefono: '+56 9 8765 4321', cargo: 'Analista de Calidad', familiaCargo: 'Calidad' },
  { id: 3, nombre: 'Andrea Soto', correo: 'asoto@ejemplo.cl', telefono: '+56 9 5555 4444', cargo: 'Jefe de Turno', familiaCargo: 'Operaciones' },
  { id: 4, nombre: 'Felipe Morales', correo: 'fmorales@ejemplo.cl', telefono: '+56 9 3333 2222', cargo: 'Técnico Mantenimiento', familiaCargo: 'Mantenimiento' },
];

const SOLICITUDES = [
  { id: 1, candidatoId: 1, cargo: 'Operador de Planta', familiaCargo: 'Operaciones', fechaSolicitud: '2026-10-20', estado: 'Pendiente', evaluador: 'Juan Pérez', fechaEvaluacion: null, observaciones: null },
  { id: 2, candidatoId: 2, cargo: 'Analista de Calidad', familiaCargo: 'Calidad', fechaSolicitud: '2026-10-22', estado: 'Pendiente', evaluador: 'Juan Pérez', fechaEvaluacion: null, observaciones: null },
  { id: 3, candidatoId: 3, cargo: 'Jefe de Turno', familiaCargo: 'Operaciones', fechaSolicitud: '2026-10-18', estado: 'En proceso', evaluador: 'Juan Pérez', fechaEvaluacion: '2026-10-25', observaciones: 'Entrevista técnica completada.' },
  { id: 4, candidatoId: 4, cargo: 'Técnico Mantenimiento', familiaCargo: 'Mantenimiento', fechaSolicitud: '2026-10-15', estado: 'Finalizada', evaluador: 'Juan Pérez', fechaEvaluacion: '2026-10-21', observaciones: 'Aprobado.' },
];

let candidatos = [];
let solicitudes = [];
let sinConexion = false;

export const reiniciarApiFalsa = () => {
  candidatos = CANDIDATOS.map((c) => ({ ...c }));
  solicitudes = SOLICITUDES.map((s) => ({ ...s }));
  sinConexion = false;
};

export const simularSinConexion = () => {
  sinConexion = true;
};

export const restaurarConexion = () => {
  sinConexion = false;
};

const responder = async (obtener) => {
  if (sinConexion) throw new Error('No se pudo conectar con el servidor.');
  return obtener();
};

const conCandidato = (s) => {
  const c = candidatos.find((x) => x.id === s.candidatoId);
  return { ...s, nombreCandidato: c.nombre, correo: c.correo, telefono: c.telefono };
};

const siguienteId = (lista) => Math.max(0, ...lista.map((x) => x.id)) + 1;

export const obtenerCandidatos = () => responder(() => candidatos.map((c) => ({ ...c })));

export const crearCandidato = (datos) =>
  responder(() => {
    if (candidatos.some((c) => c.correo === datos.correo)) throw new Error('Correo repetido en el servidor.');
    const id = siguienteId(candidatos);
    candidatos.push({ ...datos, id });
    return { id };
  });

export const actualizarCandidato = (id, datos) =>
  responder(() => {
    candidatos = candidatos.map((c) => (c.id === id ? { ...c, ...datos } : c));
    return { success: true };
  });

export const enviarPostulacion = (datos) =>
  crearCandidato(datos).then(({ id }) => {
    const solicitudId = siguienteId(solicitudes);
    solicitudes.push({ id: solicitudId, candidatoId: id, cargo: datos.cargo, familiaCargo: datos.familiaCargo, fechaSolicitud: '2026-11-02', estado: 'Pendiente', evaluador: 'Juan Pérez', fechaEvaluacion: null, observaciones: null });
    return { candidatoId: id, solicitudId };
  });

export const obtenerSolicitudes = () => responder(() => solicitudes.map(conCandidato));

export const obtenerSolicitud = (id) =>
  responder(() => {
    const solicitud = solicitudes.find((s) => s.id === Number(id));
    if (!solicitud) throw new Error('Solicitud no encontrada.');
    return conCandidato(solicitud);
  });

export const crearSolicitud = (datos) =>
  responder(() => {
    const id = siguienteId(solicitudes);
    solicitudes.push({ ...datos, id, estado: 'Pendiente', fechaEvaluacion: null });
    return { id };
  });

const actualizar = (id, cambios) => {
  solicitudes = solicitudes.map((s) => (s.id === id ? { ...s, ...cambios } : s));
  return { success: true };
};

export const iniciarEvaluacion = (id) => responder(() => actualizar(id, { estado: 'En proceso' }));

export const evaluarSolicitud = (id, datos) => responder(() => actualizar(id, datos));

export const obtenerEstadisticas = () =>
  responder(() => {
    const contar = (estado) => solicitudes.filter((s) => s.estado === estado).length;
    return {
      candidatos: candidatos.length,
      pendientes: contar('Pendiente'),
      enProceso: contar('En proceso'),
      finalizadas: contar('Finalizada'),
      rechazadas: contar('Rechazada'),
      total: solicitudes.length,
    };
  });

export const resetearDatosBD = () =>
  responder(() => {
    reiniciarApiFalsa();
    return { success: true };
  });
