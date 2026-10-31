import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormularioSolicitud from '../components/organisms/FormularioSolicitud';

const candidatos = [
  { id: 1, nombre: 'Ana Ficticia', cargo: 'Operador de Planta', familiaCargo: 'Operaciones' },
  { id: 2, nombre: 'Luis Ficticio', cargo: 'Analista de Calidad', familiaCargo: 'Calidad' },
];

describe('FormularioSolicitud', () => {
  test('propone el cargo y la familia del candidato elegido', async () => {
    render(
      <FormularioSolicitud
        candidatos={candidatos}
        familias={['Operaciones', 'Calidad']}
        responsables={['Juan Pérez']}
        onGuardar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );

    await userEvent.selectOptions(screen.getByLabelText('Candidato'), 'Luis Ficticio');

    expect(screen.getByLabelText('Cargo').value).toBe('Analista de Calidad');
    expect(screen.getByLabelText('Familia de cargo').value).toBe('Calidad');
  });
});
