import { describe, expect, test } from 'vitest';
import { puede, puedeEvaluar, solicitudesVisibles } from '../utils/permisos';
import { filtrarSolicitudes, FILTROS_VACIOS } from '../utils/filtros';

const juan = { nombre: 'Juan Pérez', rol: 'Evaluador' };
const solicitudes = [
  { id: 1, nombreCandidato: 'Ana Ficticia', cargo: 'Operador de Planta', estado: 'Pendiente', fechaSolicitud: '2026-10-10', evaluador: 'Juan Pérez' },
  { id: 2, nombreCandidato: 'Luis Ficticio', cargo: 'Analista de Calidad', estado: 'Finalizada', fechaSolicitud: '2026-10-20', evaluador: 'Camila Fuentes' },
];

describe('permisos', () => {
  test('cada rol solo tiene los permisos que define el caso', () => {
    expect(puede({ rol: 'Analista' }, 'gestionarRegistros')).toBe(true);
    expect(puede({ rol: 'Analista' }, 'evaluar')).toBe(false);
    expect(puede({ rol: 'Jefatura' }, 'gestionarRegistros')).toBe(false);
    expect(puede(null, 'evaluar')).toBe(false);
  });

  test('el evaluador solo ve y evalúa las solicitudes asignadas', () => {
    expect(solicitudesVisibles(juan, solicitudes).map((s) => s.id)).toEqual([1]);
    expect(solicitudesVisibles({ rol: 'Jefatura' }, solicitudes)).toHaveLength(2);
    expect(puedeEvaluar(juan, solicitudes[0])).toBe(true);
    expect(puedeEvaluar(juan, solicitudes[1])).toBe(false);
  });
});

describe('filtrarSolicitudes', () => {
  const ids = (filtros) => filtrarSolicitudes(solicitudes, { ...FILTROS_VACIOS, ...filtros }).map((s) => s.id);

  test('filtra por estado, fecha, cargo y candidato, y combina los criterios', () => {
    expect(ids({})).toEqual([1, 2]);
    expect(ids({ estado: 'Pendiente' })).toEqual([1]);
    expect(ids({ fechaDesde: '2026-10-15' })).toEqual([2]);
    expect(ids({ cargo: 'calidad' })).toEqual([2]);
    expect(ids({ candidato: ' ana ' })).toEqual([1]);
    expect(ids({ candidato: 'ana', estado: 'Finalizada' })).toEqual([]);
  });
});
