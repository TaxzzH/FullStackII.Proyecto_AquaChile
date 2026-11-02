import { afterEach, describe, expect, test, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CandidatoForm from '../pages/CandidatoForm';
import RellenarNuevoFormulario from '../pages/RellenarNuevoFormulario';
import Resumen from '../pages/Resumen';
import SolicitudDetalle from '../pages/SolicitudDetalle';
import Solicitudes from '../pages/Solicitudes';
import { obtenerCandidatos, obtenerSolicitud, obtenerSolicitudes, simularSinConexion } from './apiFalsa';

// Mock de la API: las páginas reciben datos fijos, sin backend
vi.mock('../services/api', () => import('./apiFalsa'));

const juan = { nombre: 'Juan Pérez', rol: 'Evaluador' };
const camila = { nombre: 'Camila Fuentes', rol: 'Evaluador' };
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
    expect(await screen.findByText('Mostrando 1 de 4 solicitudes.')).toBeTruthy();
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
    await screen.findByText('Mostrando 4 de 4 solicitudes.');
    await userEvent.click(screen.getByRole('button', { name: 'Exportar a Excel' }));

    expect(clic).toHaveBeenCalledOnce();
    expect(nombres).toEqual(['solicitudes.csv']);
    expect(URL.createObjectURL.mock.calls[0][0].type).toContain('text/csv');
  });
});

describe('SolicitudDetalle', () => {
  test('lee el id de la URL, muestra los datos y permite iniciar la evaluación', async () => {
    verDetalle(1, juan);
    expect(await screen.findByText('Solicitud de María González')).toBeTruthy();
    expect(screen.getByText('mgonzalez@ejemplo.cl')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Iniciar Evaluación' }));

    expect(await screen.findByRole('button', { name: 'Registrar Evaluación' })).toBeTruthy();
    expect((await obtenerSolicitud(1)).estado).toBe('En proceso');
  });

  test('registra el resultado de la evaluación desde el detalle', async () => {
    verDetalle(3, juan);

    await userEvent.click(await screen.findByRole('button', { name: 'Registrar Evaluación' }));
    const modal = within(screen.getByRole('dialog'));
    await userEvent.selectOptions(modal.getByLabelText('Estado'), 'Rechazada');
    await userEvent.click(modal.getByRole('button', { name: 'Guardar evaluación' }));

    expect(await screen.findByRole('button', { name: 'Editar Evaluación' })).toBeTruthy();
    expect((await obtenerSolicitud(3)).estado).toBe('Rechazada');
  });

  test('la jefatura solo consulta y un id inexistente muestra un aviso', async () => {
    const { unmount } = verDetalle(1, marta);
    await screen.findByText('Solicitud de María González');
    expect(screen.queryByRole('button', { name: 'Iniciar Evaluación' })).toBeNull();
    unmount();

    verDetalle(99, marta);
    expect(await screen.findByText(/No encontramos esa solicitud/)).toBeTruthy();
  });

  test('un evaluador no puede abrir una solicitud de otro evaluador', async () => {
    verDetalle(1, camila);

    expect(await screen.findByText(/No encontramos esa solicitud/)).toBeTruthy();
  });
});

describe('Resumen', () => {
  test('finalizar una evaluación cambia los contadores y se guarda en la API', async () => {
    render(<MemoryRouter><Resumen usuario={juan} /></MemoryRouter>);

    await screen.findByRole('button', { name: 'En proceso (1)' });
    await userEvent.click(screen.getByRole('button', { name: 'Registrar Evaluación' }));
    const modal = within(screen.getByRole('dialog'));
    await userEvent.selectOptions(modal.getByLabelText('Estado'), 'Finalizada');
    await userEvent.click(modal.getByRole('button', { name: 'Guardar evaluación' }));

    expect(await screen.findByRole('button', { name: 'Finalizadas (2)' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'En proceso (0)' })).toBeTruthy();
    expect((await obtenerSolicitud(3)).estado).toBe('Finalizada');
  });

  test('filtra por estado con los botones', async () => {
    render(<MemoryRouter><Resumen usuario={marta} /></MemoryRouter>);

    await userEvent.click(await screen.findByRole('button', { name: 'Finalizadas (1)' }));

    expect(screen.getByText('Felipe Morales')).toBeTruthy();
    expect(screen.queryByText('Andrea Soto')).toBeNull();
    expect(screen.getByRole('link', { name: 'Ver detalle' })).toBeTruthy();
  });
});

describe('CandidatoForm', () => {
  const verFormulario = (ruta) =>
    render(
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/candidatos/:id/editar" element={<CandidatoForm />} />
          <Route path="/candidatos" element={<p>Lista de candidatos</p>} />
        </Routes>
      </MemoryRouter>
    );

  test('carga los datos del candidato, los guarda y vuelve a la lista', async () => {
    verFormulario('/candidatos/2/editar');

    const nombre = await screen.findByLabelText('Nombre');
    expect(nombre.value).toBe('Carlos Rojas');
    await userEvent.clear(nombre);
    await userEvent.type(nombre, 'Carlos Editado');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar candidato' }));

    expect(await screen.findByText('Lista de candidatos')).toBeTruthy();
    expect((await obtenerCandidatos()).find((c) => c.id === 2).nombre).toBe('Carlos Editado');
  });

  test('avisa si el candidato no existe', async () => {
    verFormulario('/candidatos/99/editar');

    expect(await screen.findByText(/No encontramos ese candidato/)).toBeTruthy();
  });
});

describe('RellenarNuevoFormulario', () => {
  const completar = async (correo) => {
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana Ficticia');
    await userEvent.type(screen.getByLabelText('Correo electrónico'), correo);
    await userEvent.type(screen.getByLabelText('Teléfono'), '+56 9 1111 2222');
    await userEvent.type(screen.getByLabelText('Cargo al que postula'), 'Buzo');
    await userEvent.selectOptions(screen.getByLabelText('Familia de cargo'), 'Operaciones');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar postulación' }));
  };

  test('registra al postulante y crea su solicitud Pendiente', async () => {
    render(<RellenarNuevoFormulario tema="light" />);

    await completar('ana@ejemplo.cl');

    expect(await screen.findByText('Recibimos tu postulación')).toBeTruthy();
    expect((await obtenerSolicitudes()).at(-1)).toMatchObject({ nombreCandidato: 'Ana Ficticia', estado: 'Pendiente' });
  });

  test('muestra el error del servidor y conserva lo escrito', async () => {
    render(<RellenarNuevoFormulario tema="light" />);

    await completar('mgonzalez@ejemplo.cl');

    expect(await screen.findByText('Correo repetido en el servidor.')).toBeTruthy();
    expect(screen.getByLabelText('Nombre').value).toBe('Ana Ficticia');
  });

  test('explica el problema si no hay conexión', async () => {
    simularSinConexion();
    render(<RellenarNuevoFormulario tema="light" />);

    await completar('ana@ejemplo.cl');

    expect(await screen.findByText(/No se pudo conectar/)).toBeTruthy();
  });
});
