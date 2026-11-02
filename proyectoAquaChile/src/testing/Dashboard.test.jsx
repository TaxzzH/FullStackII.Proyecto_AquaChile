import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { evaluarSolicitud, simularSinConexion } from './apiFalsa';

// Mock de la API: la página recibe datos fijos, sin backend
vi.mock('../services/api', () => import('./apiFalsa'));

const verDashboard = (rol = 'Jefatura') =>
  render(
    <MemoryRouter>
      <Dashboard usuario={{ nombre: 'Marta Díaz', rol }} />
    </MemoryRouter>
  );

const totalDeTarjeta = async (titulo) =>
  (await screen.findByText(titulo)).closest('.card-body').querySelector('.indicador-valor').textContent;

afterEach(() => vi.restoreAllMocks());

describe('Dashboard', () => {
  test('muestra los totales de candidatos y de cada estado', async () => {
    await evaluarSolicitud(3, { estado: 'Rechazada' });
    verDashboard();

    expect(await totalDeTarjeta('Total de Candidatos')).toBe('4');
    expect(await totalDeTarjeta('Solicitudes Pendientes')).toBe('2');
    expect(await totalDeTarjeta('En Proceso')).toBe('0');
    expect(await totalDeTarjeta('Finalizadas')).toBe('1');
    expect(await totalDeTarjeta('Rechazadas')).toBe('1');
  });

  test('avisa cuando el servidor no responde', async () => {
    simularSinConexion();
    verDashboard();

    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeTruthy();
  });

  test('solo el administrador puede resetear, y al hacerlo se actualizan los totales', async () => {
    const { unmount } = verDashboard('Jefatura');
    await screen.findByText('Total de Candidatos');
    expect(screen.queryByRole('button', { name: 'Resetear datos de prueba' })).toBeNull();
    unmount();

    await evaluarSolicitud(3, { estado: 'Rechazada' });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    verDashboard('Administrador');
    expect(await totalDeTarjeta('Rechazadas')).toBe('1');

    await userEvent.click(screen.getByRole('button', { name: 'Resetear datos de prueba' }));

    expect(await screen.findByText('Datos de prueba restaurados.')).toBeTruthy();
    expect(await totalDeTarjeta('Rechazadas')).toBe('0');
  });

  test('el administrador exporta los datos a un archivo JSON', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:prueba');
    URL.revokeObjectURL = vi.fn();
    const nombres = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      nombres.push(this.download);
    });

    verDashboard('Administrador');
    await screen.findByText('Total de Candidatos');
    await userEvent.click(screen.getByRole('button', { name: 'Exportar datos (JSON)' }));

    await vi.waitFor(() => expect(nombres).toEqual(['datos_aquachile.json']));
    expect(URL.createObjectURL.mock.calls[0][0].type).toBe('application/json');
  });
});
