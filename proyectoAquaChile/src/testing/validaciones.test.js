import { describe, expect, test, vi } from 'vitest';
import { validarCandidato, validarEvaluacion, validarSolicitud } from '../utils/validaciones';

const candidatoValido = {
  nombre: 'Ana Ficticia',
  correo: 'ana@ejemplo.cl',
  telefono: '+56 9 1234 5678',
  cargo: 'Operador de Planta',
  familiaCargo: 'Operaciones',
};

describe('validarCandidato', () => {
  test('rechaza un correo y un teléfono con formato incorrecto', () => {
    const errores = validarCandidato({ ...candidatoValido, correo: 'ana-sin-arroba', telefono: '123' });

    expect(errores.correo).toMatch(/correo válido/);
    expect(errores.telefono).toMatch(/celular chileno/);
    expect(validarCandidato(candidatoValido)).toEqual({});
  });

  test('rechaza un correo repetido, salvo que sea el del candidato que se edita', () => {
    const registrados = [{ id: 1, correo: 'ANA@ejemplo.cl' }];

    expect(validarCandidato(candidatoValido, registrados, null).correo).toMatch(/Ya existe/);
    expect(validarCandidato(candidatoValido, registrados, 1)).toEqual({});
  });
});

describe('validarSolicitud', () => {
  test('indica los campos vacíos y rechaza una fecha futura', () => {
    // Reloj falso: el resultado no depende del día en que se ejecute la prueba
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 2));

    const errores = validarSolicitud({ candidatoId: '', cargo: '', familiaCargo: '', evaluador: '', fechaSolicitud: '2026-11-03' });

    expect(Object.keys(errores).sort()).toEqual(['candidatoId', 'cargo', 'evaluador', 'familiaCargo', 'fechaSolicitud']);
    expect(errores.fechaSolicitud).toMatch(/futura/);
    expect(validarSolicitud({ candidatoId: '1', cargo: 'Buzo', familiaCargo: 'Operaciones', evaluador: 'Juan Pérez', fechaSolicitud: '2026-11-02' })).toEqual({});
  });
});

describe('validarEvaluacion', () => {
  test('exige observaciones solo para finalizar y no acepta fechas anteriores a la solicitud', () => {
    const datos = { estado: 'Finalizada', fechaEvaluacion: '2026-10-20', observaciones: '' };

    expect(validarEvaluacion(datos, '2026-10-15').observaciones).toMatch(/para finalizar/);
    expect(validarEvaluacion({ ...datos, estado: 'En proceso' }, '2026-10-15')).toEqual({});
    expect(validarEvaluacion({ ...datos, estado: 'En proceso' }, '2026-10-25').fechaEvaluacion).toMatch(/anterior/);
  });
});
