import { describe, expect, test, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Candidatos from '../pages/Candidatos';
import { obtenerSolicitud } from './apiFalsa';

// Mock de la API: la página recibe datos fijos, sin backend
vi.mock('../services/api', () => import('./apiFalsa'));

const verCandidatos = (usuario) =>
  render(
    <MemoryRouter>
      <Candidatos usuario={usuario} />
    </MemoryRouter>
  );

describe('Candidatos', () => {
  test('muestra una fila con enlaces de edición por cada candidato', async () => {
    verCandidatos({ nombre: 'Sofía Lagos', rol: 'Analista' });

    const editar = await screen.findAllByRole('button', { name: 'Editar' });
    expect(editar.map((enlace) => enlace.getAttribute('href'))).toEqual([
      '/candidatos/1/editar',
      '/candidatos/2/editar',
      '/candidatos/3/editar',
      '/candidatos/4/editar',
    ]);
    expect(screen.getByRole('button', { name: 'Registrar candidato' })).toBeTruthy();
  });

  test('la jefatura consulta sin botones de edición ni de evaluación', async () => {
    verCandidatos({ nombre: 'Marta Díaz', rol: 'Jefatura' });

    await screen.findAllByText('María González');
    expect(screen.queryByRole('button', { name: 'Editar' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Iniciar Evaluación' })).toBeNull();
  });

  test('el evaluador inicia una evaluación y la solicitud deja de estar pendiente', async () => {
    verCandidatos({ nombre: 'Juan Pérez', rol: 'Evaluador' });

    const botones = await screen.findAllByRole('button', { name: 'Iniciar Evaluación' });
    expect(botones).toHaveLength(2);
    await userEvent.click(botones[0]);

    expect(await screen.findByText(/Evaluación iniciada para María González/)).toBeTruthy();
    expect(within(document.body).getAllByRole('button', { name: 'Iniciar Evaluación' })).toHaveLength(1);
    expect((await obtenerSolicitud(1)).estado).toBe('En proceso');
  });

  test('exporta a Excel un archivo CSV con los candidatos', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:prueba');
    URL.revokeObjectURL = vi.fn();
    const nombres = [];
    const clic = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      nombres.push(this.download);
    });

    verCandidatos({ nombre: 'Marta Díaz', rol: 'Jefatura' });
    await screen.findAllByText('María González');
    await userEvent.click(screen.getByRole('button', { name: 'Exportar a Excel' }));

    expect(nombres).toEqual(['candidatos.csv']);
    clic.mockRestore();
  });
});
