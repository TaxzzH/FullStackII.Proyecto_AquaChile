import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioCandidato from '../components/organisms/FormularioCandidato';

const dibujar = () => {
  // Mock: función falsa que registra si el formulario la llamó y con qué datos
  const onGuardar = vi.fn();
  render(<FormularioCandidato candidatos={[]} familias={['Operaciones', 'Calidad']} onGuardar={onGuardar} onCancelar={vi.fn()} />);
  return onGuardar;
};

describe('FormularioCandidato', () => {
  test('muestra un error por cada campo vacío y no guarda', async () => {
    const onGuardar = dibujar();

    await userEvent.click(screen.getByRole('button', { name: 'Guardar candidato' }));

    expect(screen.getByText('Ingresa el nombre del candidato.')).toBeTruthy();
    expect(screen.getByText('Ingresa el correo electrónico.')).toBeTruthy();
    expect(screen.getByText('Ingresa el teléfono.')).toBeTruthy();
    expect(screen.getByText('Ingresa el cargo al que postula.')).toBeTruthy();
    expect(screen.getByText('Selecciona la familia de cargo.')).toBeTruthy();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  test('llama a onGuardar con los datos ingresados, sin espacios sobrantes', async () => {
    const onGuardar = dibujar();

    await userEvent.type(screen.getByLabelText('Nombre'), '  Ana Ficticia ');
    await userEvent.type(screen.getByLabelText('Correo electrónico'), 'ana@ejemplo.cl');
    await userEvent.type(screen.getByLabelText('Teléfono'), '+56 9 1234 5678');
    await userEvent.type(screen.getByLabelText('Cargo al que postula'), 'Operador de Planta');
    await userEvent.selectOptions(screen.getByLabelText('Familia de cargo'), 'Operaciones');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar candidato' }));

    expect(onGuardar).toHaveBeenCalledTimes(1);
    expect(onGuardar).toHaveBeenCalledWith({
      nombre: 'Ana Ficticia',
      correo: 'ana@ejemplo.cl',
      telefono: '+56 9 1234 5678',
      cargo: 'Operador de Planta',
      familiaCargo: 'Operaciones',
    });
  });
});
