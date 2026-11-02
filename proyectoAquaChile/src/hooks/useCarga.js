import { useCallback, useEffect, useState } from 'react';

// Carga datos del backend y expone su estado. "cargar" debe ser estable:
// una función del módulo o una envuelta en useCallback.
export function useCarga(cargar) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: '' });

  const pedirDatos = useCallback(async () => {
    try {
      const datos = await cargar();
      setEstado({ datos, cargando: false, error: '' });
    } catch (err) {
      setEstado((previo) => ({ ...previo, cargando: false, error: err.message }));
    }
  }, [cargar]);

  useEffect(() => {
    pedirDatos();
  }, [pedirDatos]);

  const recargar = useCallback(() => {
    setEstado((previo) => ({ ...previo, cargando: true, error: '' }));
    return pedirDatos();
  }, [pedirDatos]);

  return { ...estado, recargar };
}
