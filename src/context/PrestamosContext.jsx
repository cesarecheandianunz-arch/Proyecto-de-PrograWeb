import { createContext, useContext, useEffect, useState } from 'react';
import { useInventario } from './InventarioContext';
import { crearOperacionesIniciales } from '../data/prestamosIniciales';
import { leerObjeto } from '../utils/almacenamiento';
import * as operaciones from '../utils/operaciones';

const PrestamosContext = createContext();

export function PrestamosProvider({ children }) {
  const { equipos, unidades, setUnidades } = useInventario();
  const [datos, setDatos] = useState(() => {
    const guardados = leerObjeto('operaciones-v1', {});
    if (Array.isArray(guardados.solicitudes) && Array.isArray(guardados.prestamos) && Array.isArray(guardados.estudiantes)) return guardados;
    return crearOperacionesIniciales(unidades, equipos);
  });
  const [errorPersistencia, setErrorPersistencia] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('operaciones-v1', JSON.stringify(datos));
      setErrorPersistencia('');
    } catch {
      setErrorPersistencia('No se pudieron conservar solicitudes y préstamos. Los cambios podrían perderse al recargar.');
    }
  }, [datos]);

  function aplicar(resultado) {
    if (resultado.error) return resultado;
    setDatos(resultado.datos);
    if (resultado.unidad) {
      setUnidades((anteriores) => anteriores.map((unidad) => {
        if (unidad.codigo === resultado.unidad.codigo) {
          let codigo = resultado.unidad.prestamo;
          if (unidad.prestamo && unidad.prestamo !== '—') codigo = unidad.prestamo;
          const cambio = {
            fecha: new Date().toISOString(),
            anterior: unidad.estado,
            nuevo: resultado.unidad.estado,
            motivo: 'Operación de préstamo: ' + codigo,
          };
          return {
            ...unidad,
            ...resultado.unidad,
            historial: [...(unidad.historial || []), cambio],
          };
        }
        return unidad;
      }));
    }
    return resultado;
  }

  function crearSolicitud(formulario) {
    return aplicar(operaciones.crearSolicitud(datos, formulario, equipos, unidades));
  }
  function retirarSolicitud(codigo, estudianteId) {
    return aplicar(operaciones.retirarSolicitud(datos, codigo, estudianteId));
  }
  function aprobarSolicitud(codigo, unidad, autorizacion) {
    return aplicar(operaciones.aprobarSolicitud(datos, codigo, unidad, equipos, unidades, autorizacion));
  }
  function rechazarSolicitud(codigo, motivo) {
    return aplicar(operaciones.rechazarSolicitud(datos, codigo, motivo));
  }
  function registrarEntrega(codigo, formulario) {
    return aplicar(operaciones.registrarEntrega(datos, codigo, formulario, equipos, unidades));
  }
  function registrarDevolucion(codigo, formulario) {
    return aplicar(operaciones.registrarDevolucion(datos, codigo, formulario));
  }
  function renovarPrestamo(codigo) {
    return aplicar(operaciones.renovarPrestamo(datos, codigo, equipos));
  }

  function registrarPago(id) {
    setDatos((anteriores) => ({
      ...anteriores,
      estudiantes: anteriores.estudiantes.map((e) => {
        if (e.id === id) return { ...e, deuda: 0 };
        return e;
      }),
      prestamos: anteriores.prestamos.map((p) => {
        if (p.estudianteId === id && p.estado === 'Devuelto') return { ...p, penalidadPagada: true };
        return p;
      }),
    }));
  }

  function actualizarEstudiante(id, cambios) {
    setDatos((anteriores) => ({
      ...anteriores,
      estudiantes: anteriores.estudiantes.map((e) => {
        if (e.id === id) return { ...e, ...cambios };
        return e;
      }),
    }));
  }

  function registrarEstudiante(formulario) {
    const correo = formulario.correo.trim().toLowerCase();
    if (datos.estudiantes.filter((e) => e.correo === correo).length > 0) return { error: 'Ya existe un estudiante con ese correo.' };
    const estudiante = {
      id: 'estudiante-' + (datos.estudiantes.length + 1),
      nombre: formulario.nombres.trim() + ' ' + formulario.apellidos.trim(),
      nombres: formulario.nombres.trim(),
      apellidos: formulario.apellidos.trim(),
      carrera: formulario.carrera,
      ciclo: formulario.ciclo,
      correo,
      celular: '',
      deuda: 0,
      bloqueada: false,
    };
    // La contraseña solo valida la maqueta; nunca se almacena en el navegador.
    setDatos((anteriores) => ({ ...anteriores, estudiantes: [...anteriores.estudiantes, estudiante] }));
    return { estudiante };
  }

  return (
    <PrestamosContext.Provider value={{
      ...datos,
      errorPersistencia,
      crearSolicitud,
      retirarSolicitud,
      aprobarSolicitud,
      rechazarSolicitud,
      registrarEntrega,
      registrarDevolucion,
      renovarPrestamo,
      registrarPago,
      actualizarEstudiante,
      registrarEstudiante,
    }}>
      {children}
    </PrestamosContext.Provider>
  );
}

export function usePrestamos() { return useContext(PrestamosContext); }
