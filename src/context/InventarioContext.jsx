import { createContext, useContext, useState, useEffect } from 'react';
import { equipos as equiposIniciales, unidades as unidadesIniciales } from '../datos';
import { contarUnidades } from '../pages/hu2/inventarioUtils';
import { completarEquiposIniciales } from '../utils/inventarioInicial';

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
  const [equipos, setEquipos] = useState(() => {
    const guardados = leerGuardados('equipos', equiposIniciales);
    try {
      if (localStorage.getItem('imagenes-iniciales-v2')) return guardados;
    } catch { return guardados; }
    return completarEquiposIniciales(guardados, equiposIniciales);
  });
  const [unidades, setUnidades] = useState(() => {
    const guardadas = leerGuardados('unidades', unidadesIniciales);
    // Completamos solo las unidades semilla ausentes, una vez, sin reemplazar cambios.
    try {
      if (localStorage.getItem('unidades-semilla-v2')) return guardadas;
    } catch { return guardadas; }
    const completas = [...guardadas];
    for (const inicial of unidadesIniciales) {
      const existeEquipo = equipos.filter((e) => e.id === inicial.equipoId).length > 0;
      const existeCodigo = completas.filter((u) => u.codigo === inicial.codigo).length > 0;
      if (existeEquipo && !existeCodigo) completas.push(inicial);
    }
    return completas;
  });
  const [errorPersistencia, setErrorPersistencia] = useState('');

  useEffect(() => {
    try {
      let actualizados = equipos;
      // También cubre el caso de tener la aplicación abierta durante estos cambios.
      if (!localStorage.getItem('imagenes-iniciales-v2')) {
        actualizados = completarEquiposIniciales(equipos, equiposIniciales);
        setEquipos(actualizados);
      }
      localStorage.setItem('equipos', JSON.stringify(actualizados));
      localStorage.setItem('unidades', JSON.stringify(unidades));
      localStorage.setItem('unidades-semilla-v2', '1');
      localStorage.setItem('imagenes-iniciales-v2', '1');
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
