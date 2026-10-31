import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

// Mock del módulo de datos: 3 pendientes, 2 en proceso y 1 finalizada
vi.mock('../data/mockData', () => ({
  getSolicitudes: () => [
    { id: 1, estado: 'Pendiente' },
    { id: 2, estado: 'Pendiente' },
    { id: 3, estado: 'Pendiente' },
    { id: 4, estado: 'En proceso' },
    { id: 5, estado: 'En proceso' },
    { id: 6, estado: 'Finalizada' },
  ],
  resetSolicitudes: vi.fn(),
}));

const totalDeTarjeta = (titulo) =>
  screen.getByText(titulo).closest('.card-body').querySelector('.display-4').textContent;

describe('Dashboard', () => {
  test('calcula los totales por estado', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(totalDeTarjeta('Solicitudes Pendientes')).toBe('3');
    expect(totalDeTarjeta('En Proceso')).toBe('2');
    expect(totalDeTarjeta('Aprobadas / Finalizadas')).toBe('1');
  });
});
