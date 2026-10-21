import { createContext, useContext, useState, useEffect } from 'react';
import { leerObjeto } from '../utils/almacenamiento';
import { usePrestamos } from './PrestamosContext';

const CuentaContext = createContext();

// Selección de la vista de demostración, sin autenticar ni guardar contraseñas.
export function CuentaProvider({ children }) {
  const { estudiantes } = usePrestamos();
  const [vista, setVista] = useState(() => leerObjeto('vista-demo-v1', { estudianteId: 'renzo' }));
  const estudiante = estudiantes.find((e) => e.id === vista.estudianteId) || estudiantes[0];
  useEffect(() => {
    try { localStorage.setItem('vista-demo-v1', JSON.stringify(vista)); } catch { /* Solo afecta a la selección de vista. */ }
  }, [vista]);

  function seleccionarEstudiante(correo) {
    const encontrado = estudiantes.find((e) => e.correo === correo.trim().toLowerCase());
    if (encontrado) setVista({ estudianteId: encontrado.id });
    else setVista({ estudianteId: 'renzo' });
  }

  return <CuentaContext.Provider value={{ estudiante, seleccionarEstudiante }}>{children}</CuentaContext.Provider>;
}

export function useCuenta() { return useContext(CuentaContext); }
