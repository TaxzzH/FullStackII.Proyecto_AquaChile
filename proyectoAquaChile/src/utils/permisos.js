// Qué puede hacer cada rol, según la tabla de roles del caso
const PERMISOS = {
  Administrador: ["gestionarRegistros", "evaluar", "reiniciarDatos"],
  Analista: ["gestionarRegistros"],
  Evaluador: ["evaluar"],
  Jefatura: [],
};

export const puede = (usuario, permiso) => Boolean(PERMISOS[usuario?.rol]?.includes(permiso));

// El evaluador solo consulta las solicitudes que tiene asignadas
export const solicitudesVisibles = (usuario, solicitudes) =>
  usuario?.rol === "Evaluador"
    ? solicitudes.filter((s) => s.evaluador === usuario.nombre)
    : solicitudes;

export const puedeEvaluar = (usuario, solicitud) =>
  puede(usuario, "evaluar") && solicitudesVisibles(usuario, [solicitud]).length > 0;
