import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Candidatos from '../pages/Candidatos';

// Mock del módulo de datos: la página recibe estos candidatos
vi.mock('../data/mockData', () => ({
  getCandidatos: () => [
    { id: 1, nombre: 'Ana Ficticia', correo: 'ana@ejemplo.cl', telefono: '+56 9 1111 1111', cargo: 'Operador', familiaCargo: 'Operaciones' },
    { id: 2, nombre: 'Luis Ficticio', correo: 'luis@ejemplo.cl', telefono: '+56 9 2222 2222', cargo: 'Analista', familiaCargo: 'Calidad' },
  ],
  getSolicitudes: () => [],
  saveSolicitudes: vi.fn(),
}));

vi.mock('../services/api', () => ({
  obtenerCandidatos: vi.fn().mockResolvedValue([
    { id: 1, solicitudId: 1, nombre: 'Ana Ficticia', correo: 'ana@ejemplo.cl', telefono: '+56 9 1111 1111', cargo: 'Operador', familiaCargo: 'Operaciones', estadoSolicitud: 'Pendiente' },
    { id: 2, solicitudId: 2, nombre: 'Luis Ficticio', correo: 'luis@ejemplo.cl', telefono: '+56 9 2222 2222', cargo: 'Analista', familiaCargo: 'Calidad', estadoSolicitud: 'Pendiente' },
  ]),
  iniciarEvaluacion: vi.fn().mockResolvedValue({ success: true }),
}));

describe('Candidatos', () => {
  test('muestra la lista de candidatos que enviaron el formulario y permite Iniciar Evaluación', () => {
    render(
      <MemoryRouter>
        <Candidatos />
      </MemoryRouter>
    );

    expect(screen.getByText('Ana Ficticia')).toBeTruthy();
    expect(screen.getByText('Luis Ficticio')).toBeTruthy();

    const botonesIniciar = screen.getAllByRole('button', { name: /Iniciar Evaluación/i });
    expect(botonesIniciar.length).toBeGreaterThan(0);
  });
});
