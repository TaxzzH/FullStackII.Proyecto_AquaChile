import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getCandidatos, getSolicitudes } from '../data/mockData';

const ingresar = async (nombre) => {
  await userEvent.selectOptions(screen.getByLabelText('Usuario de prueba'), nombre);
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
};

describe('Flujo principal', () => {
  test('el analista registra un candidato y crea su solicitud; el evaluador la ve y la inicia', async () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    // Sin sesión, la ruta protegida lleva al ingreso
    expect(screen.getByText('Ingreso al sistema')).toBeTruthy();
    await ingresar('Sofía Lagos (Analista)');
    expect(screen.getByText('¡Bienvenido(a), Sofía Lagos!')).toBeTruthy();

    await userEvent.click(screen.getByText('Ver Candidatos'));
    await userEvent.click(screen.getByRole('button', { name: 'Registrar candidato' }));
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana Ficticia');
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'ana@ejemplo.cl');
    await userEvent.type(screen.getByLabelText('Teléfono'), '+56 9 1111 2222');
    await userEvent.type(screen.getByLabelText('Cargo al que postula'), 'Buzo');
    await userEvent.selectOptions(screen.getByLabelText('Familia de cargo'), 'Operaciones');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar candidato' }));
    expect(screen.getByText('Candidato Ana Ficticia registrado.')).toBeTruthy();
    expect(getCandidatos()).toHaveLength(5);

    await userEvent.click(screen.getAllByRole('button', { name: 'Crear solicitud' }).at(-1));
    await userEvent.selectOptions(screen.getByLabelText('Profesional responsable'), 'Camila Fuentes');
    await userEvent.click(screen.getByRole('button', { name: 'Crear solicitud' }));
    expect(screen.getByText('Solicitud creada para Ana Ficticia.')).toBeTruthy();
    expect(getSolicitudes().at(-1)).toMatchObject({ nombreCandidato: 'Ana Ficticia', estado: 'Pendiente', evaluador: 'Camila Fuentes' });

    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));
    await ingresar('Camila Fuentes (Evaluador)');

    await userEvent.click(screen.getByText('Solicitudes'));
    expect(screen.getByText('Mostrando 1 de 1 solicitudes.')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Ver detalle' }));
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar Evaluación' }));
    expect(getSolicitudes().at(-1).estado).toBe('En proceso');
  });
});
