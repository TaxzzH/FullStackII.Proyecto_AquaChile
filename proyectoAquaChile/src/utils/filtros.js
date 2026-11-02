export const FILTROS_VACIOS = { candidato: "", cargo: "", estado: "", fechaDesde: "" };

const contiene = (texto, busqueda) => texto.toLowerCase().includes(busqueda.trim().toLowerCase());

// Un filtro vacío no restringe; los que tienen valor deben cumplirse todos
export const filtrarSolicitudes = (solicitudes, filtros) =>
  solicitudes.filter(
    (s) =>
      contiene(s.nombreCandidato, filtros.candidato) &&
      contiene(s.cargo, filtros.cargo) &&
      (!filtros.estado || s.estado === filtros.estado) &&
      (!filtros.fechaDesde || s.fechaSolicitud >= filtros.fechaDesde)
  );
