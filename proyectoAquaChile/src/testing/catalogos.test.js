import { describe, expect, test } from 'vitest';
import { cerrarSesion, getSesion, iniciarSesion, responsables, usuarios } from '../data/catalogos';

describe('catalogos', () => {
  test('los responsables son los usuarios con rol Evaluador', () => {
    expect(responsables).toEqual(['Juan Pérez', 'Camila Fuentes', 'Rodrigo Vera']);
    expect(usuarios.map((u) => u.rol)).toEqual(expect.arrayContaining(['Administrador', 'Analista', 'Evaluador', 'Jefatura']));
  });

  test('guarda y cierra la sesión', () => {
    expect(getSesion()).toBeNull();
    iniciarSesion({ id: 2, nombre: 'Sofía Lagos', rol: 'Analista' });
    expect(getSesion().rol).toBe('Analista');
    cerrarSesion();
    expect(getSesion()).toBeNull();
  });
});
