import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      // 1. Comprobar si el usuario ya eligió una preferencia anteriormente
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;

      // 2. Si no hay preferencia guardada, usar la del sistema operativo
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement; // Aplica el tema en <html>

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Guardar la elección en localStorage para futuras visitas
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre oscuro y claro
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}