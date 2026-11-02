import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BadgeEstado from '../components/atoms/BadgeEstado';
import EstadoCarga from '../components/molecules/EstadoCarga';
import TarjetaIndicador from '../components/molecules/TarjetaIndicador';
import FormularioIngreso from '../components/organisms/FormularioIngreso';
import Navbar from '../components/Navbar';
import RutaProtegida from '../components/RutaProtegida';

describe('BadgeEstado', () => {
  test('aplica el color según el estado recibido por props', () => {
    const { rerender } = render(<BadgeEstado estado="Pendiente" />);
    expect(screen.getByText('Pendiente').className).toContain('estado-pendiente');

    rerender(<BadgeEstado estado="Rechazada" />);
    expect(screen.getByText('Rechazada').className).toContain('estado-rechazada');
  });
});

describe('TarjetaIndicador', () => {
  test('muestra los valores recibidos por props y enlaza al listado', () => {
    render(
      <MemoryRouter>
        <TarjetaIndicador titulo="En Proceso" valor={7} descripcion="En curso" tono="proceso" enlace="/solicitudes" textoEnlace="Ver" />
      </MemoryRouter>
    );

    expect(screen.getByText('En Proceso').closest('.card').className).toContain('indicador-proceso');
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ver' }).getAttribute('href')).toBe('/solicitudes');
  });
});

describe('EstadoCarga', () => {
  test('muestra la espera, el error con reintento y luego el contenido', async () => {
    const onReintentar = vi.fn();
    const { rerender } = render(<EstadoCarga cargando hayDatos={false}><p>Contenido</p></EstadoCarga>);
    expect(screen.getByRole('status')).toBeTruthy();
    expect(screen.queryByText('Contenido')).toBeNull();

    rerender(<EstadoCarga error="Sin conexión" hayDatos={false} onReintentar={onReintentar}><p>Contenido</p></EstadoCarga>);
    expect(screen.getByText('Sin conexión')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onReintentar).toHaveBeenCalledOnce();

    rerender(<EstadoCarga hayDatos><p>Contenido</p></EstadoCarga>);
    expect(screen.getByText('Contenido')).toBeTruthy();
  });
});

describe('FormularioIngreso', () => {
  const usuarios = [{ id: 2, nombre: 'Sofía Lagos', rol: 'Analista' }];

  test('muestra un error sin usuario y entrega el usuario elegido', async () => {
    const onIngresar = vi.fn();
    render(<FormularioIngreso usuarios={usuarios} onIngresar={onIngresar} />);

    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(screen.getByText('Selecciona un usuario para ingresar.')).toBeTruthy();
    expect(onIngresar).not.toHaveBeenCalled();

    await userEvent.selectOptions(screen.getByLabelText('Usuario de prueba'), 'Sofía Lagos (Analista)');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(onIngresar).toHaveBeenCalledWith(usuarios[0]);
  });
});

describe('RutaProtegida', () => {
  test('avisa cuando el rol no tiene el permiso y muestra la página cuando sí', () => {
    const { rerender } = render(
      <MemoryRouter>
        <RutaProtegida usuario={{ rol: 'Jefatura' }} permiso="gestionarRegistros"><p>Página privada</p></RutaProtegida>
      </MemoryRouter>
    );
    expect(screen.queryByText('Página privada')).toBeNull();
    expect(screen.getByText(/no tiene permiso/)).toBeTruthy();

    rerender(
      <MemoryRouter>
        <RutaProtegida usuario={{ rol: 'Analista' }} permiso="gestionarRegistros"><p>Página privada</p></RutaProtegida>
      </MemoryRouter>
    );
    expect(screen.getByText('Página privada')).toBeTruthy();
  });
});

describe('Navbar', () => {
  test('oculta los enlaces sin sesión, llama a onSalir y pide cambiar el tema', async () => {
    const onSalir = vi.fn();
    const onCambiarTema = vi.fn();
    const props = { onSalir, onCambiarTema, tema: 'light' };
    const { rerender } = render(<MemoryRouter><Navbar usuario={null} {...props} /></MemoryRouter>);
    expect(screen.queryByText('Solicitudes')).toBeNull();

    rerender(<MemoryRouter><Navbar usuario={{ nombre: 'Sofía Lagos', rol: 'Analista' }} {...props} /></MemoryRouter>);
    expect(screen.getByText('Solicitudes')).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Salir' }));
    expect(onSalir).toHaveBeenCalled();

    await userEvent.click(screen.getByLabelText('Modo oscuro'));
    expect(onCambiarTema).toHaveBeenCalled();
  });
});
