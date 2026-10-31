import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cada prueba parte limpia: sin componentes dibujados, datos guardados ni reloj falso
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
});
