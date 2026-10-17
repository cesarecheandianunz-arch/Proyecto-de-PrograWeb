import { createContext, useContext, useState, useEffect } from 'react';
import { equipos as equiposIniciales, unidades as unidadesIniciales } from '../datos';

const InventarioContext = createContext();

export function InventarioProvider({ children }) {
  const [equipos, setEquipos] = useState(() => {
  const equiposGuardados = localStorage.getItem('equipos');

  if (equiposGuardados) {
    return JSON.parse(equiposGuardados);
  } else {
    return equiposIniciales;
  }
});
const [unidades, setUnidades] = useState(() => {
  const unidadesGuardadas = localStorage.getItem('unidades');

  if (unidadesGuardadas) {
    return JSON.parse(unidadesGuardadas);
  } else {
    return unidadesIniciales;
  }
});
  useEffect(() => {
  localStorage.setItem(
    'equipos',
    JSON.stringify(equipos)
  );
  }, [equipos]);

useEffect(() => {
  localStorage.setItem(
    'unidades',
    JSON.stringify(unidades)
  );
  }, [unidades]);

  return (
    <InventarioContext.Provider
      value={{
        equipos,
        setEquipos,
        unidades,
        setUnidades
      }}
    >{children}</InventarioContext.Provider>
  );
}

export function useInventario() {
  return useContext(InventarioContext);
}