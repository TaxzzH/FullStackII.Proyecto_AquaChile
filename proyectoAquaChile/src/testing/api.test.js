import { afterEach, describe, expect, test, vi } from 'vitest';
import { actualizarCandidato, obtenerCandidatos } from '../services/api';

afterEach(() => vi.unstubAllGlobals());

const simularFetch = (implementacion) => {
  const fetchFalso = vi.fn(implementacion);
  vi.stubGlobal('fetch', fetchFalso);
  return fetchFalso;
};

describe('services/api', () => {
  test('envía el método, la ruta y los datos, y devuelve la respuesta', async () => {
    const fetchFalso = simularFetch(async () => ({ ok: true, json: async () => ({ success: true }) }));

    await expect(actualizarCandidato(7, { nombre: 'Ana Ficticia' })).resolves.toEqual({ success: true });

    const [url, opciones] = fetchFalso.mock.calls[0];
    expect(url).toMatch(/\/candidatos\/7$/);
    expect(opciones.method).toBe('PUT');
    expect(JSON.parse(opciones.body)).toEqual({ nombre: 'Ana Ficticia' });
  });

  test('entrega el mensaje de error que responde el servidor', async () => {
    simularFetch(async () => ({ ok: false, json: async () => ({ error: 'Correo repetido.' }) }));

    await expect(obtenerCandidatos()).rejects.toThrow('Correo repetido.');
  });

  test('explica el problema cuando el servidor no responde', async () => {
    simularFetch(async () => {
      throw new TypeError('Failed to fetch');
    });

    await expect(obtenerCandidatos()).rejects.toThrow(/No se pudo conectar con el servidor/);
  });
});
