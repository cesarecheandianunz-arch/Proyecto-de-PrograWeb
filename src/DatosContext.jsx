import { createContext, useContext, useEffect, useState } from 'react';
import { solicitudes as solicitudesIniciales, prestamos as prestamosIniciales, unidadesLibres, diasHasta, fmt, sumarDias } from './datos';

// Estado compartido y guardado en localStorage: sobrevive a recargar la página
const Contexto = createContext(null);
const CLAVE = 'prograweb-tema7-v1';

function cargar() {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE));
    if (g && g.solicitudes && g.prestamos) return g;
  } catch { /* sin datos guardados */ }
  return null;
}

export function DatosProvider({ children }) {
  const [inicial] = useState(cargar);
  const [solicitudes, setSolicitudes] = useState(inicial ? inicial.solicitudes : solicitudesIniciales);
  const [prestamosBase, setPrestamos] = useState(inicial ? inicial.prestamos : prestamosIniciales);

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify({ solicitudes, prestamos: prestamosBase })); } catch { /* ignorar */ }
  }, [solicitudes, prestamosBase]);

  // Vencimiento y días se derivan de `fin`, así una renovación se refleja sola
  const prestamos = prestamosBase.map((p) => ({ ...p, vence: fmt(p.fin), dias: diasHasta(p.fin) }));

  const actualizar = (codigo, cambios) =>
    setSolicitudes((l) => l.map((s) => (s.codigo === codigo ? { ...s, ...cambios } : s)));

  // Unidades libres de un equipo, sin las ya asignadas a solicitudes aprobadas o entregadas
  function libresDe(equipoId) {
    const usadas = solicitudes.filter((s) => s.estado === 'Aprobada' || s.estado === 'Entregada').map((s) => s.unidad);
    return (unidadesLibres[equipoId] || []).filter((u) => !usadas.includes(u));
  }

  const aprobar = (codigo, unidad) => actualizar(codigo, { estado: 'Aprobada', unidad });
  const rechazar = (codigo, motivoRechazo) => actualizar(codigo, { estado: 'Rechazada', unidad: '—', motivoRechazo });

  // entrega = { accesorios: [{ nombre, entregado }], fecha, observaciones }
  function registrarEntrega(codigo, entrega) {
    const s = solicitudes.find((x) => x.codigo === codigo);
    actualizar(codigo, { estado: 'Entregada', entrega });
    setPrestamos((l) => [...l, { codigo, unidad: s.unidad, estudiante: s.estudiante, equipoId: s.equipoId, fin: s.fin }]);
  }

  // Cierra el préstamo; si hay penalidad, se suma como deuda a las demás solicitudes del estudiante
  function devolver(codigo, retorno) {
    const p = prestamosBase.find((x) => x.codigo === codigo);
    setPrestamos((l) => l.filter((x) => x.codigo !== codigo));
    setSolicitudes((l) => l.map((s) => {
      if (s.codigo === codigo) return { ...s, estado: 'Devuelta', retorno };
      if (retorno.penalidad > 0 && s.estudiante === p.estudiante) return { ...s, deuda: s.deuda + retorno.penalidad };
      return s;
    }));
  }

  const renovar = (codigo, dias) =>
    setPrestamos((l) => l.map((p) => (p.codigo === codigo ? { ...p, fin: sumarDias(p.fin, dias), renovado: true } : p)));

  function restablecer() {
    setSolicitudes(solicitudesIniciales);
    setPrestamos(prestamosIniciales);
  }

  return (
    <Contexto.Provider value={{ solicitudes, prestamos, libresDe, aprobar, rechazar, registrarEntrega, devolver, renovar, restablecer }}>
      {children}
    </Contexto.Provider>
  );
}

export const useDatos = () => useContext(Contexto);
