import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { obtenerCandidatos, obtenerSolicitudes } from './apiFalsa';

// Mock de la API: recorre toda la aplicación sin backend
vi.mock('../services/api', () => import('./apiFalsa'));

const ingresar = async (nombre) => {
  await userEvent.selectOptions(await screen.findByLabelText('Usuario de prueba'), nombre);
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
};

describe('Flujo principal', () => {
  test('el analista registra un candidato y crea su solicitud; el evaluador la ve y la inicia', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    // Sin sesión, la ruta protegida lleva al ingreso
    expect(await screen.findByText('Ingreso al sistema')).toBeTruthy();
    await ingresar('Sofía Lagos (Analista)');
    expect(await screen.findByText('¡Bienvenido(a), Sofía Lagos!')).toBeTruthy();

    await userEvent.click(await screen.findByText('Ver Candidatos'));
    await userEvent.click(await screen.findByRole('button', { name: 'Registrar candidato' }));
    await userEvent.type(await screen.findByLabelText('Nombre'), 'Ana Ficticia');
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'ana@ejemplo.cl');
    await userEvent.type(screen.getByLabelText('Teléfono'), '+56 9 1111 2222');
    await userEvent.type(screen.getByLabelText('Cargo al que postula'), 'Buzo');
    await userEvent.selectOptions(screen.getByLabelText('Familia de cargo'), 'Operaciones');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar candidato' }));
    expect(await screen.findByText('Candidato Ana Ficticia registrado.')).toBeTruthy();
    expect(await obtenerCandidatos()).toHaveLength(5);

    await userEvent.click((await screen.findAllByRole('button', { name: 'Crear solicitud' })).at(-1));
    await userEvent.selectOptions(await screen.findByLabelText('Profesional responsable'), 'Camila Fuentes');
    await userEvent.click(screen.getByRole('button', { name: 'Crear solicitud' }));
    expect(await screen.findByText('Solicitud creada para Ana Ficticia.')).toBeTruthy();
    expect((await obtenerSolicitudes()).at(-1)).toMatchObject({ nombreCandidato: 'Ana Ficticia', estado: 'Pendiente', evaluador: 'Camila Fuentes' });

    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));
    await ingresar('Camila Fuentes (Evaluador)');

    await userEvent.click(await screen.findByText('Solicitudes'));
    expect(await screen.findByText('Mostrando 1 de 1 solicitudes.')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Ver detalle' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Iniciar Evaluación' }));
    expect(await screen.findByRole('button', { name: 'Registrar Evaluación' })).toBeTruthy();
    expect((await obtenerSolicitudes()).at(-1).estado).toBe('En proceso');
  });
});
