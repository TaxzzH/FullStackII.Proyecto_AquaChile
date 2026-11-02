import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { reiniciarApiFalsa } from './apiFalsa';

// jsdom no trae matchMedia, que useTheme usa para leer la preferencia del sistema
window.matchMedia = () => ({ matches: false });

beforeEach(() => reiniciarApiFalsa());

// Cada prueba parte limpia: sin componentes dibujados, datos guardados ni reloj falso
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
  vi.useRealTimers();
});
