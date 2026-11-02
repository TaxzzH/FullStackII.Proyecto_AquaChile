// Excel en español separa columnas con punto y coma
const SEPARADOR = ";";
// Marca UTF-8 para que Excel muestre bien los acentos
const BOM = "﻿";

// Excel ejecuta como fórmula una celda que parte con = + - @. Un teléfono (+56 9...) sí puede pasar.
const neutralizarFormula = (texto) =>
  /^[=@-]|^\+(?![\d\s]+$)/.test(texto) ? `'${texto}` : texto;

const celdaCSV = (valor) => {
  const texto = neutralizarFormula(String(valor ?? ""));
  return /[";\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
};

// columnas: [{ titulo: "Nombre", campo: "nombre" }, ...]
export const aCSV = (filas, columnas) => {
  const lineas = [
    columnas.map((c) => celdaCSV(c.titulo)).join(SEPARADOR),
    ...filas.map((fila) => columnas.map((c) => celdaCSV(fila[c.campo])).join(SEPARADOR)),
  ];
  return BOM + lineas.join("\r\n");
};

export const COLUMNAS_CANDIDATOS = [
  { titulo: "ID", campo: "id" },
  { titulo: "Nombre", campo: "nombre" },
  { titulo: "Correo", campo: "correo" },
  { titulo: "Teléfono", campo: "telefono" },
  { titulo: "Cargo", campo: "cargo" },
  { titulo: "Familia de cargo", campo: "familiaCargo" },
];

export const COLUMNAS_SOLICITUDES = [
  { titulo: "ID", campo: "id" },
  { titulo: "ID candidato", campo: "candidatoId" },
  { titulo: "Candidato", campo: "nombreCandidato" },
  { titulo: "Cargo", campo: "cargo" },
  { titulo: "Familia de cargo", campo: "familiaCargo" },
  { titulo: "Fecha de solicitud", campo: "fechaSolicitud" },
  { titulo: "Responsable", campo: "evaluador" },
  { titulo: "Estado", campo: "estado" },
  { titulo: "Fecha de evaluación", campo: "fechaEvaluacion" },
  { titulo: "Observaciones", campo: "observaciones" },
];

// Separa los datos en las tres entidades del anexo, listas para pasar a una base de datos
export const estructurarDatos = (candidatos, solicitudes) => ({
  candidatos,
  solicitudes: solicitudes.map((s) => ({
    id: s.id,
    candidatoId: s.candidatoId,
    cargo: s.cargo,
    familiaCargo: s.familiaCargo,
    fechaSolicitud: s.fechaSolicitud,
    estado: s.estado,
    responsable: s.evaluador,
  })),
  evaluaciones: solicitudes
    .filter((s) => s.fechaEvaluacion)
    .map((s) => ({
      solicitudId: s.id,
      fechaEvaluacion: s.fechaEvaluacion,
      observaciones: s.observaciones,
      estado: s.estado,
    })),
});

export const descargarArchivo = (nombre, contenido, tipo) => {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
};

export const descargarCSV = (nombre, filas, columnas) =>
  descargarArchivo(nombre, aCSV(filas, columnas), "text/csv;charset=utf-8");

export const descargarJSON = (nombre, datos) =>
  descargarArchivo(nombre, JSON.stringify(datos, null, 2), "application/json");
