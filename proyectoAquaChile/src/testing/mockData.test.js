import { describe, expect, test } from 'vitest';
import {
  actualizarCandidato, actualizarSolicitud, agregarCandidato, agregarSolicitud, cerrarSesion,
  getCandidatos, getSesion, getSolicitudes, iniciarSesion, initialCandidatos, resetSolicitudes,
} from '../data/mockData';

const datosCandidato = { nombre: 'Ana Ficticia', correo: 'ana@ejemplo.cl', telefono: '+56 9 1111 1111', cargo: 'Buzo', familiaCargo: 'Operaciones' };

describe('mockData', () => {
  test('entrega los datos iniciales la primera vez y los deja guardados', () => {
    expect(getCandidatos()).toEqual(initialCandidatos);
    expect(JSON.parse(localStorage.getItem('candidatos_aqua'))).toEqual(initialCandidatos);
    expect(getSolicitudes()).toHaveLength(4);
  });

  test('agrega un candidato con el id siguiente y actualiza su contacto en las solicitudes', () => {
    expect(agregarCandidato(datosCandidato).id).toBe(5);

    actualizarCandidato(1, { ...datosCandidato, nombre: 'María Editada' });

    expect(getCandidatos().find((c) => c.id === 1).nombre).toBe('María Editada');
    expect(getSolicitudes().find((s) => s.candidatoId === 1).nombreCandidato).toBe('María Editada');
    expect(getSolicitudes().find((s) => s.candidatoId === 2).nombreCandidato).toBe('Carlos Rojas');
  });

  test('crea solicitudes en estado Pendiente, las actualiza y el reinicio restaura los datos', () => {
    const nueva = agregarSolicitud({ candidatoId: 2, cargo: 'Buzo', familiaCargo: 'Operaciones', fechaSolicitud: '2026-10-30', evaluador: 'Juan Pérez', observaciones: '' });

    expect(nueva).toMatchObject({ id: 5, estado: 'Pendiente', nombreCandidato: 'Carlos Rojas', fechaEvaluacion: '' });

    actualizarSolicitud(5, { estado: 'En proceso' });
    expect(getSolicitudes().find((s) => s.id === 5).estado).toBe('En proceso');

    resetSolicitudes();
    expect(getSolicitudes()).toHaveLength(4);
  });

  test('guarda y cierra la sesión', () => {
    expect(getSesion()).toBeNull();
    iniciarSesion({ id: 2, nombre: 'Sofía Lagos', rol: 'Analista' });
    expect(getSesion().rol).toBe('Analista');
    cerrarSesion();
    expect(getSesion()).toBeNull();
  });
});
