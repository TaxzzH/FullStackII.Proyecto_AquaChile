import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Resumen from '../pages/Resumen';
import SolicitudDetalle from '../pages/SolicitudDetalle';
import Solicitudes from '../pages/Solicitudes';
import { getSolicitudes } from '../data/mockData';

const juan = { nombre: 'Juan Pérez', rol: 'Evaluador' };
const marta = { nombre: 'Marta Díaz', rol: 'Jefatura' };

const verDetalle = (id, usuario) =>
  render(
    <MemoryRouter initialEntries={[`/solicitudes/${id}`]}>
      <Routes>
        <Route path="/solicitudes/:id" element={<SolicitudDetalle usuario={usuario} />} />
      </Routes>
    </MemoryRouter>
  );

afterEach(() => vi.restoreAllMocks());

describe('Solicitudes', () => {
  const verListado = (ruta = '/solicitudes') =>
    render(<MemoryRouter initialEntries={[ruta]}><Solicitudes usuario={marta} /></MemoryRouter>);

  test('toma el estado desde la URL, filtra y permite limpiar', async () => {
    verListado('/solicitudes?estado=Finalizada');
    expect(screen.getByText('Mostrando 1 de 4 solicitudes.')).toBeTruthy();
    expect(screen.getByText('Felipe Morales')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(screen.getByText('Mostrando 4 de 4 solicitudes.')).toBeTruthy();

    await userEvent.type(screen.getByLabelText('Candidato'), 'sin coincidencias');
    expect(screen.getByText('No hay solicitudes que coincidan con estos filtros.')).toBeTruthy();
  });

  test('exporta a Excel un archivo CSV con el listado', async () => {
    // Mock de lo que jsdom no implementa: crear el enlace de descarga y hacerle clic
    URL.createObjectURL = vi.fn(() => 'blob:prueba');
    URL.revokeObjectURL = vi.fn();
    const nombres = [];
    const clic = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      nombres.push(this.download);
    });

    verListado();
    await userEvent.click(screen.getByRole('button', { name: 'Exportar a Excel' }));

    expect(clic).toHaveBeenCalledOnce();
    expect(nombres).toEqual(['solicitudes.csv']);
    expect(URL.createObjectURL.mock.calls[0][0].type).toContain('text/csv');
  });
});

describe('SolicitudDetalle', () => {
  test('lee el id de la URL, muestra los datos y permite iniciar la evaluación', async () => {
    verDetalle(1, juan);
    expect(screen.getByText('Solicitud de María González')).toBeTruthy();
    expect(screen.getByText('mgonzalez@ejemplo.cl')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Iniciar Evaluación' }));

    expect(screen.getByRole('button', { name: 'Registrar Evaluación' })).toBeTruthy();
    expect(getSolicitudes().find((s) => s.id === 1).estado).toBe('En proceso');
  });

  test('la jefatura solo consulta y un id inexistente muestra un aviso', () => {
    const { unmount } = verDetalle(1, marta);
    expect(screen.queryByRole('button', { name: 'Iniciar Evaluación' })).toBeNull();
    unmount();

    verDetalle(99, marta);
    expect(screen.getByText(/No encontramos esa solicitud/)).toBeTruthy();
  });
});

describe('Resumen', () => {
  test('finalizar una evaluación mueve la solicitud a Finalizadas y la guarda', async () => {
    render(<MemoryRouter><Resumen usuario={juan} /></MemoryRouter>);
    expect(screen.getByText('Solicitudes En Proceso (1)')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Registrar Evaluación' }));
    const modal = within(screen.getByRole('dialog'));
    await userEvent.selectOptions(modal.getByLabelText('Estado'), 'Finalizada');
    await userEvent.click(modal.getByRole('button', { name: 'Guardar evaluación' }));

    expect(await screen.findByText('Solicitudes Finalizadas (2)')).toBeTruthy();
    expect(screen.getByText('Solicitudes En Proceso (0)')).toBeTruthy();
    expect(getSolicitudes().find((s) => s.id === 3).estado).toBe('Finalizada');
  });
});
