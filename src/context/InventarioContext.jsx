import { createContext, useContext, useState, useEffect } from 'react';
import { equipos as equiposIniciales, unidades as unidadesIniciales } from '../datos';
import { contarUnidades } from '../pages/hu2/inventarioUtils';

const InventarioContext = createContext();

function leerGuardados(clave, iniciales) {
  try {
    const guardados = JSON.parse(localStorage.getItem(clave));
    if (Array.isArray(guardados)) {
      return guardados;
    } else {
      return iniciales;
    }
  } catch {
    return iniciales;
  }
}

export function InventarioProvider({ children }) {
  const [equipos, setEquipos] = useState(() => leerGuardados('equipos', equiposIniciales));
  const [unidades, setUnidades] = useState(() => leerGuardados('unidades', unidadesIniciales));
  const [errorPersistencia, setErrorPersistencia] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('equipos', JSON.stringify(equipos));
      localStorage.setItem('unidades', JSON.stringify(unidades));
      setErrorPersistencia('');
    } catch {
      setErrorPersistencia('Los cambios están en esta sesión, pero el navegador no pudo guardarlos. Podrían perderse al recargar.');
    }
  }, [equipos, unidades]);

  // Los contadores se calculan desde las unidades reales, no desde números fijos.
  const equiposConConteo = equipos.map((equipo) => contarUnidades(equipo, unidades));

  return (
    <InventarioContext.Provider value={{ equipos, setEquipos, unidades, setUnidades, equiposConConteo, errorPersistencia }}>
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  return useContext(InventarioContext);
}
