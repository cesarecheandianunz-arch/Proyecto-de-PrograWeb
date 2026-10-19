import { createContext, useContext, useEffect, useState } from 'react';
import {
  solicitudes as solicitudesIniciales,
  prestamos as prestamosIniciales,
  equipos as equiposIniciales,
  unidades as unidadesIniciales,
  diasHasta, fmt, sumarDias,
} from '../datos';
import { useInventario } from './InventarioContext';

// Estado de HU-4: solicitudes y préstamos. Se guarda en localStorage como el inventario.
const PrestamosContext = createContext();

function leerGuardados(clave, iniciales) {
  try {
    const guardados = JSON.parse(localStorage.getItem(clave));
    return Array.isArray(guardados) ? guardados : iniciales;
  } catch {
    return iniciales;
  }
}

export function PrestamosProvider({ children }) {
  const { unidades, setUnidades, setEquipos } = useInventario();
  const [solicitudes, setSolicitudes] = useState(() => leerGuardados('solicitudes', solicitudesIniciales));
  const [prestamosBase, setPrestamos] = useState(() => leerGuardados('prestamos', prestamosIniciales));

  useEffect(() => {
    try {
      localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
      localStorage.setItem('prestamos', JSON.stringify(prestamosBase));
    } catch { /* el inventario ya avisa si el navegador no guarda */ }
  }, [solicitudes, prestamosBase]);

  // Vencimiento y días restantes se derivan de `fin`, así una renovación se refleja sola
  const prestamos = prestamosBase.map((p) => ({ ...p, vence: fmt(p.fin), dias: diasHasta(p.fin) }));

  const actualizar = (codigo, cambios) =>
    setSolicitudes((lista) => lista.map((s) => (s.codigo === codigo ? { ...s, ...cambios } : s)));

  // Unidades disponibles de un equipo que aún no fueron asignadas a otra solicitud aprobada
  function libresDe(equipoId) {
    const asignadas = solicitudes.filter((s) => s.estado === 'Aprobada').map((s) => s.unidad);
    return unidades
      .filter((u) => u.equipoId === equipoId && u.estado === 'Disponible' && !asignadas.includes(u.codigo))
      .map((u) => u.codigo);
  }

  const aprobar = (codigo, unidad) => actualizar(codigo, { estado: 'Aprobada', unidad });
  const rechazar = (codigo, motivoRechazo) => actualizar(codigo, { estado: 'Rechazada', unidad: '—', motivoRechazo });

  // entrega = { accesorios: [{ nombre, entregado }], fecha, observaciones }
  // La unidad pasa a «Prestada» en el inventario de HU-2 y se crea el préstamo vigente.
  function registrarEntrega(codigo, entrega) {
    const s = solicitudes.find((x) => x.codigo === codigo);
    actualizar(codigo, { estado: 'Entregada', entrega });
    setUnidades((lista) => lista.map((u) => (u.codigo === s.unidad ? { ...u, estado: 'Prestada', prestamo: codigo } : u)));
    setPrestamos((lista) => [...lista, { codigo, unidad: s.unidad, estudiante: s.estudiante, equipoId: s.equipoId, fin: s.fin }]);
  }

  const renovar = (codigo, dias) =>
    setPrestamos((lista) => lista.map((p) => (p.codigo === codigo ? { ...p, fin: sumarDias(p.fin, dias), renovado: true } : p)));

  function restablecer() {
    setSolicitudes(solicitudesIniciales);
    setPrestamos(prestamosIniciales);
    setEquipos(equiposIniciales);
    setUnidades(unidadesIniciales);
  }

  return (
    <PrestamosContext.Provider value={{ solicitudes, prestamos, libresDe, aprobar, rechazar, registrarEntrega, renovar, restablecer }}>
      {children}
    </PrestamosContext.Provider>
  );
}

export function usePrestamos() {
  return useContext(PrestamosContext);
}
