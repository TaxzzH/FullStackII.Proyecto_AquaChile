import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Candidatos from '../pages/Candidatos';

// Mock del módulo de datos: la página recibe estos datos en vez de leer localStorage
vi.mock('../data/mockData', () => ({
  getCandidatos: () => [
    { id: 1, nombre: 'Ana Ficticia', correo: 'ana@ejemplo.cl', telefono: '+56 9 1111 1111', cargo: 'Operador', familiaCargo: 'Operaciones' },
    { id: 2, nombre: 'Luis Ficticio', correo: 'luis@ejemplo.cl', telefono: '+56 9 2222 2222', cargo: 'Analista', familiaCargo: 'Calidad' },
  ],
  getSolicitudes: () => [],
  saveSolicitudes: vi.fn(),
}));

describe('Candidatos', () => {
  test('muestra una fila con enlaces de edición por cada candidato', () => {
    render(
      <MemoryRouter>
        <Candidatos />
      </MemoryRouter>
    );

    expect(screen.getByText('Ana Ficticia')).toBeTruthy();
    expect(screen.getByText('Luis Ficticio')).toBeTruthy();

    const editar = screen.getAllByRole('button', { name: 'Editar' });
    expect(editar.map((enlace) => enlace.getAttribute('href'))).toEqual(['/candidatos/1/editar', '/candidatos/2/editar']);
  });
});
