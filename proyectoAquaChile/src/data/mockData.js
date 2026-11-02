export const familiasCargo = ["Operaciones", "Calidad", "Mantenimiento", "Administración"];

export const estadosSolicitud = ["Pendiente", "En proceso", "Finalizada"];

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

export const initialCandidatos = [
  {
    id: 1,
    nombre: "María González",
    correo: "mgonzalez@ejemplo.cl",
    telefono: "+56 9 1234 5678",
    cargo: "Operador de Planta",
    familiaCargo: "Operaciones"
  },
  {
    id: 2,
    nombre: "Carlos Rojas",
    correo: "crojas@ejemplo.cl",
    telefono: "+56 9 8765 4321",
    cargo: "Analista de Calidad",
    familiaCargo: "Calidad"
  },
  {
    id: 3,
    nombre: "Andrea Soto",
    correo: "asoto@ejemplo.cl",
    telefono: "+56 9 5555 4444",
    cargo: "Jefe de Turno",
    familiaCargo: "Operaciones"
  },
  {
    id: 4,
    nombre: "Felipe Morales",
    correo: "fmorales@ejemplo.cl",
    telefono: "+56 9 3333 2222",
    cargo: "Técnico Mantenimiento",
    familiaCargo: "Mantenimiento"
  }
];

export const initialSolicitudes = [
  {
    id: 1,
    candidatoId: 1,
    nombreCandidato: "María González",
    correo: "mgonzalez@ejemplo.cl",
    telefono: "+56 9 1234 5678",
    cargo: "Operador de Planta",
    familiaCargo: "Operaciones",
    fechaSolicitud: "2026-10-20",
    estado: "Pendiente", // Pendiente | En proceso | Finalizada
    evaluador: "Juan Pérez",
    fechaEvaluacion: "",
    observaciones: ""
  },
  {
    id: 2,
    candidatoId: 2,
    nombreCandidato: "Carlos Rojas",
    correo: "crojas@ejemplo.cl",
    telefono: "+56 9 8765 4321",
    cargo: "Analista de Calidad",
    familiaCargo: "Calidad",
    fechaSolicitud: "2026-10-22",
    estado: "Pendiente",
    evaluador: "Juan Pérez",
    fechaEvaluacion: "",
    observaciones: ""
  },
  {
    id: 3,
    candidatoId: 3,
    nombreCandidato: "Andrea Soto",
    correo: "asoto@ejemplo.cl",
    telefono: "+56 9 5555 4444",
    cargo: "Jefe de Turno",
    familiaCargo: "Operaciones",
    fechaSolicitud: "2026-10-18",
    estado: "En proceso",
    evaluador: "Juan Pérez",
    fechaEvaluacion: "2026-10-25",
    observaciones: "Entrevista técnica completada. Pendiente informe psicolaboral."
  },
  {
    id: 4,
    candidatoId: 4,
    nombreCandidato: "Felipe Morales",
    correo: "fmorales@ejemplo.cl",
    telefono: "+56 9 3333 2222",
    cargo: "Técnico Mantenimiento",
    familiaCargo: "Mantenimiento",
    fechaSolicitud: "2026-10-15",
    estado: "Finalizada",
    evaluador: "Juan Pérez",
    fechaEvaluacion: "2026-10-21",
    observaciones: "Aprobado. Perfil compatible con el cargo y competencias requeridas."
  }
];

export const getSolicitudes = () => {
  const data = localStorage.getItem("solicitudes_aqua");
  if (!data) {
    localStorage.setItem("solicitudes_aqua", JSON.stringify(initialSolicitudes));
    return initialSolicitudes;
  }
  return JSON.parse(data);
};

export const saveSolicitudes = (solicitudes) => {
  localStorage.setItem("solicitudes_aqua", JSON.stringify(solicitudes));
};

export const resetSolicitudes = () => {
  localStorage.setItem("candidatos_aqua", JSON.stringify(initialCandidatos));
  localStorage.setItem("solicitudes_aqua", JSON.stringify(initialSolicitudes));
  return initialSolicitudes;
};

const siguienteId = (lista) => Math.max(0, ...lista.map((item) => item.id)) + 1;

export const getCandidatos = () => {
  const data = localStorage.getItem("candidatos_aqua");
  if (!data) {
    localStorage.setItem("candidatos_aqua", JSON.stringify(initialCandidatos));
    return initialCandidatos;
  }
  return JSON.parse(data);
};

export const saveCandidatos = (candidatos) => {
  localStorage.setItem("candidatos_aqua", JSON.stringify(candidatos));
};

export const agregarCandidato = (datos) => {
  const candidatos = getCandidatos();
  const nuevo = { ...datos, id: siguienteId(candidatos) };
  saveCandidatos([...candidatos, nuevo]);
  return nuevo;
};

export const actualizarCandidato = (id, datos) => {
  saveCandidatos(getCandidatos().map((c) => (c.id === id ? { ...c, ...datos } : c)));

  // Las solicitudes guardan una copia del contacto: se mantiene al día
  saveSolicitudes(
    getSolicitudes().map((s) =>
      s.candidatoId === id
        ? { ...s, nombreCandidato: datos.nombre, correo: datos.correo, telefono: datos.telefono }
        : s
    )
  );
};

export const actualizarSolicitud = (id, datos) => {
  saveSolicitudes(getSolicitudes().map((s) => (s.id === id ? { ...s, ...datos } : s)));
};

export const agregarSolicitud = (datos) => {
  const solicitudes = getSolicitudes();
  const candidato = getCandidatos().find((c) => c.id === datos.candidatoId);
  const nueva = {
    ...datos,
    id: siguienteId(solicitudes),
    nombreCandidato: candidato.nombre,
    correo: candidato.correo,
    telefono: candidato.telefono,
    estado: "Pendiente",
    fechaEvaluacion: ""
  };
  saveSolicitudes([...solicitudes, nueva]);
  return nueva;
};
