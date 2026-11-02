// Listas fijas del sistema. Los candidatos y las solicitudes viven en la base de datos.
export const familiasCargo = ["Operaciones", "Calidad", "Mantenimiento", "Administración"];

export const estadosSolicitud = ["Pendiente", "En proceso", "Finalizada", "Rechazada"];

// Usuarios ficticios para el ingreso con roles simulados
export const usuarios = [
  { id: 1, nombre: "Paula Reyes", rol: "Administrador" },
  { id: 2, nombre: "Sofía Lagos", rol: "Analista" },
  { id: 3, nombre: "Juan Pérez", rol: "Evaluador" },
  { id: 4, nombre: "Camila Fuentes", rol: "Evaluador" },
  { id: 5, nombre: "Rodrigo Vera", rol: "Evaluador" },
  { id: 6, nombre: "Marta Díaz", rol: "Jefatura" }
];

export const responsables = usuarios.filter((u) => u.rol === "Evaluador").map((u) => u.nombre);

// La sesión dura hasta cerrar la pestaña, por eso va en sessionStorage
export const getSesion = () => JSON.parse(sessionStorage.getItem("usuario_aqua"));

export const iniciarSesion = (usuario) => {
  sessionStorage.setItem("usuario_aqua", JSON.stringify(usuario));
};

export const cerrarSesion = () => {
  sessionStorage.removeItem("usuario_aqua");
};
