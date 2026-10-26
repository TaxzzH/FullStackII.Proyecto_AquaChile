export const initialSolicitudes = [
  {
    id: 1,
    nombreCandidato: "María González",
    correo: "mgonzalez@gmail.com",
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
    nombreCandidato: "Carlos Rojas",
    correo: "crojas@gmail.com",
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
    nombreCandidato: "Andrea Soto",
    correo: "asoto@outlook.com",
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
    nombreCandidato: "Felipe Morales",
    correo: "fmorales@gmail.com",
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
  localStorage.setItem("solicitudes_aqua", JSON.stringify(initialSolicitudes));
  return initialSolicitudes;
};