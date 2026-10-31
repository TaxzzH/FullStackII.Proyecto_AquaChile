import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioEvaluacion from '../components/organisms/FormularioEvaluacion';

const solicitud = {
  id: 1,
  estado: 'En proceso',
  fechaSolicitud: '2026-10-15',
  fechaEvaluacion: '2026-10-20',
  observaciones: '',
};

describe('FormularioEvaluacion', () => {
  test('llama a onGuardar con el estado elegido y las observaciones', async () => {
    const onGuardar = vi.fn();
    render(<FormularioEvaluacion solicitud={solicitud} onGuardar={onGuardar} onCancelar={vi.fn()} />);

    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'Finalizada');
    await userEvent.type(screen.getByLabelText('Resultado u observaciones'), 'Perfil compatible.');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar evaluación' }));

    expect(onGuardar).toHaveBeenCalledWith({
      fechaEvaluacion: '2026-10-20',
      estado: 'Finalizada',
      observaciones: 'Perfil compatible.',
    });
  });
});
