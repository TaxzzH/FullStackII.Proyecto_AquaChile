import { describe, expect, test } from 'vitest';
import { aCSV, estructurarDatos } from '../utils/exportar';

const columnas = [{ titulo: 'Nombre', campo: 'nombre' }, { titulo: 'Nota', campo: 'nota' }];

describe('exportar', () => {
  test('genera un CSV para Excel y protege separadores y comillas', () => {
    const csv = aCSV([{ nombre: 'Ana; Ficticia', nota: 'dijo "sí"' }], columnas);

    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv.slice(1).split('\r\n')).toEqual(['Nombre;Nota', '"Ana; Ficticia";"dijo ""sí"""']);
  });

  test('neutraliza fórmulas de Excel, pero respeta los teléfonos', () => {
    const csv = aCSV([{ nombre: '=SUMA(A1)', nota: '+56 9 1234 5678' }], columnas);

    expect(csv.split('\r\n')[1]).toBe("'=SUMA(A1);+56 9 1234 5678");
  });

  test('separa candidatos, solicitudes y evaluaciones en una estructura de datos', () => {
    const candidatos = [{ id: 1, nombre: 'Ana Ficticia' }];
    const solicitudes = [
      { id: 1, candidatoId: 1, cargo: 'Buzo', estado: 'Finalizada', evaluador: 'Juan Pérez', fechaSolicitud: '2026-10-01', fechaEvaluacion: '2026-10-05', observaciones: 'Apto' },
      { id: 2, candidatoId: 1, cargo: 'Buzo', estado: 'Pendiente', evaluador: 'Juan Pérez', fechaSolicitud: '2026-10-02', fechaEvaluacion: '', observaciones: '' },
    ];

    const datos = estructurarDatos(candidatos, solicitudes);

    expect(datos.candidatos).toEqual(candidatos);
    expect(datos.solicitudes[0].responsable).toBe('Juan Pérez');
    expect(datos.solicitudes[0]).not.toHaveProperty('observaciones');
    expect(datos.evaluaciones).toEqual([{ solicitudId: 1, fechaEvaluacion: '2026-10-05', observaciones: 'Apto', estado: 'Finalizada' }]);
  });
});
