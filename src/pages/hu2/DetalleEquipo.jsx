import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import Etiqueta from '../../components/Etiqueta';
import CampoInventario from '../../components/CampoInventario';
import ModalInventario from '../../components/ModalInventario';
import { useInventario } from '../../context/InventarioContext.jsx';
import { estadosPermitidos, validarUnidad, validarCondiciones } from './inventarioUtils';

const campoClase = 'w-full border border-borde rounded px-3 py-2';

export default function DetalleEquipo() {
  const { id } = useParams();
  const location = useLocation();
  const { equipos, setEquipos, unidades, setUnidades } = useInventario();
  const [duracion, setDuracion] = useState(7);
  const [autorizacion, setAutorizacion] = useState(true);
  const [renovacion, setRenovacion] = useState(false);
  const [penalidad, setPenalidad] = useState(15);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevaUbicacion, setNuevaUbicacion] = useState('');
  const [nuevaObservacion, setNuevaObservacion] = useState('');
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [motivoCambio, setMotivoCambio] = useState('');
  const [erroresUnidad, setErroresUnidad] = useState({});
  const [erroresEstado, setErroresEstado] = useState({});
  const [erroresCondiciones, setErroresCondiciones] = useState({});
  const [mensaje, setMensaje] = useState(location.state?.mensaje || '');
  const equipo = equipos.find((actual) => actual.id === Number(id));
  // La dirección decide la pestaña: el enlace directo también funciona al recargar.
  let pestana = 'unidades';
  if (location.pathname.endsWith('/condiciones')) {
    pestana = 'condiciones';
  } else if (location.hash === '#historial') {
    pestana = 'historial';
  }

  function clasePestana(nombre) {
    if (pestana === nombre) {
      return 'pb-2 border-b-2 border-primario text-primario';
    } else {
      return 'pb-2 text-gris';
    }
  }

  function cargarCondiciones(actual) {
    setDuracion(actual.duracion ?? 7);
    setAutorizacion(actual.autorizacion ?? true);
    setRenovacion(actual.renovacion ?? false);
    setPenalidad(actual.penalidad ?? 15);
    setErroresCondiciones({});
  }

  useEffect(() => {
    if (equipo) {
      cargarCondiciones(equipo);
    }
    setModalAbierto(false);
    setUnidadSeleccionada(null);
  }, [equipo]);

  if (!equipo) {
    return <PanelEncargado><h1 className="text-2xl mb-4">Equipo no encontrado</h1><Link to="/encargado/inventario">Volver al inventario</Link></PanelEncargado>;
  }

  const unidadesEquipo = unidades.filter((unidad) => unidad.equipoId === equipo.id);
  // Reunimos los cambios de cada unidad en una lista nueva.
  const historial = [];
  unidadesEquipo.forEach((unidad) => {
    if (unidad.historial) {
      unidad.historial.forEach((cambio) => {
        historial.push({ ...cambio, codigo: unidad.codigo });
      });
    }
  });
  // Extra: sort ordena la lista. La fecha más reciente aparece primero.
  historial.sort((primero, segundo) => {
    return new Date(segundo.fecha) - new Date(primero.fecha);
  });

  let textoAutorizacion;
  if (autorizacion) {
    textoAutorizacion = 'Requiere la autorización del docente.';
  } else {
    textoAutorizacion = 'No requiere autorización adicional.';
  }

  let textoRenovacion;
  if (renovacion) {
    textoRenovacion = 'Admite renovación.';
  } else {
    textoRenovacion = 'No admite renovación.';
  }

  function abrirNuevaUnidad() {
    setNuevoCodigo('');
    setNuevaUbicacion('');
    setNuevaObservacion('');
    setErroresUnidad({});
    setModalAbierto(true);
  }

  function guardarUnidad(evento) {
    evento.preventDefault();
    const encontrados = validarUnidad(nuevoCodigo, nuevaUbicacion, unidades);
    setErroresUnidad(encontrados);
    if (Object.keys(encontrados).length > 0) {
      return;
    }
    const nuevaUnidad = {
      codigo: nuevoCodigo.trim().toUpperCase(),
      equipoId: equipo.id,
      ubicacion: nuevaUbicacion.trim(),
      estado: 'Disponible',
      observacion: nuevaObservacion.trim(),
      prestamo: '—',
      historial: [],
    };
    setUnidades((anteriores) => [...anteriores, nuevaUnidad]);
    setMensaje(`Unidad ${nuevaUnidad.codigo} registrada.`);
    setModalAbierto(false);
  }

  function abrirCambioEstado(unidad) {
    setUnidadSeleccionada(unidad);
    setNuevoEstado('');
    setMotivoCambio('');
    setErroresEstado({});
  }

  function guardarCambioEstado(evento) {
    evento.preventDefault();
    const actual = unidades.find((unidad) => unidad.equipoId === equipo.id && unidad.codigo === unidadSeleccionada.codigo);
    const encontrados = {};
    if (!actual || !estadosPermitidos(actual).includes(nuevoEstado)) {
      encontrados.estado = 'Selecciona una transición permitida.';
    }
    if (motivoCambio.trim() === '') {
      encontrados.motivo = 'Ingresa el motivo del cambio.';
    }
    setErroresEstado(encontrados);
    if (Object.keys(encontrados).length > 0) {
      return;
    }
    if (nuevoEstado === 'Dada de baja') {
      const confirmada = window.confirm(`¿Dar de baja la unidad ${actual.codigo}? La baja es definitiva y la unidad dejará de estar disponible.`);
      if (!confirmada) {
        return;
      }
    }
    const cambio = {
      fecha: new Date().toISOString(),
      anterior: actual.estado,
      nuevo: nuevoEstado,
      motivo: motivoCambio.trim(),
    };
    setUnidades((anteriores) => {
      return anteriores.map((unidad) => {
        if (unidad.equipoId === equipo.id && unidad.codigo === actual.codigo) {
          let cambiosAnteriores = [];
          if (unidad.historial) {
            cambiosAnteriores = unidad.historial;
          }
          return {
            ...unidad,
            estado: nuevoEstado,
            motivoCambio: cambio.motivo,
            historial: [...cambiosAnteriores, cambio],
          };
        } else {
          return unidad;
        }
      });
    });
    setMensaje(`Estado de ${actual.codigo} actualizado a ${nuevoEstado}.`);
    setUnidadSeleccionada(null);
  }

  function guardarCondiciones(evento) {
    evento.preventDefault();
    const encontrados = validarCondiciones(duracion, penalidad);
    setErroresCondiciones(encontrados);
    if (Object.keys(encontrados).length > 0) {
      return;
    }
    setEquipos((anteriores) => {
      return anteriores.map((actual) => {
        if (actual.id === equipo.id) {
          return {
            ...actual,
            duracion: Number(duracion),
            autorizacion: autorizacion,
            renovacion: renovacion,
            penalidad: Number(penalidad),
          };
        } else {
          return actual;
        }
      });
    });
    setMensaje('Condiciones del préstamo guardadas.');
  }

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Inventario / {equipo.categoria} / {equipo.nombre}</p>
      <h1 className="text-3xl font-semibold">{equipo.nombre}</h1>
      <div className="flex flex-wrap gap-4 my-3 text-primario">
        <Link to="/encargado/inventario" className="hover:underline">← Volver al inventario</Link>
        <Link to={`/encargado/equipo/${id}/editar`} className="hover:underline">Editar equipo</Link>
        <Link to={`/equipos/${id}`} className="hover:underline">Ver ficha pública</Link>
      </div>
      <p className="text-gris text-sm mb-6">{equipo.marca} · {equipo.modelo} · {unidadesEquipo.length} unidades registradas</p>
      {mensaje && <p role="status" className="bg-primario-suave p-3 rounded mb-4">{mensaje}</p>}
      <nav aria-label="Secciones del equipo" className="flex flex-wrap gap-4 border-b border-borde mb-6">
        <Link to={`/encargado/equipo/${id}`} className={clasePestana('unidades')}>Unidades</Link>
        <Link to={`/encargado/equipo/${id}/condiciones`} className={clasePestana('condiciones')}>Condiciones del préstamo</Link>
        <Link to={`/encargado/equipo/${id}#historial`} className={clasePestana('historial')}>Historial</Link>
      </nav>
      {pestana === 'unidades' && <>
        <div className="flex justify-end mb-3"><button onClick={abrirNuevaUnidad} className="bg-primario text-white px-4 py-2 rounded">Nueva unidad</button></div>
        {unidadesEquipo.length === 0 && <div className="bg-white border border-borde rounded text-center p-8">
          <h2 className="text-xl font-semibold">Este equipo aún no tiene unidades</h2>
          <p className="text-gris mt-2">Registra una unidad con su código de inventario para que aparezca en el catálogo.</p>
        </div>}
        {unidadesEquipo.length > 0 && <div className="overflow-x-auto"><table className="w-full bg-white border border-borde text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gris text-left"><tr>{['Código', 'Ubicación', 'Estado', 'Observaciones', 'Préstamo vigente', 'Acciones'].map((titulo) => <th key={titulo} className="p-3">{titulo}</th>)}</tr></thead>
          <tbody>{unidadesEquipo.map((unidad) => <tr key={unidad.codigo} className="border-t border-borde">
            <td className="p-3 font-mono font-semibold">{unidad.codigo}</td>
            <td className="p-3 text-gris">{unidad.ubicacion}</td>
            <td className="p-3"><Etiqueta estado={unidad.estado} /></td>
            <td className="p-3 text-gris">{unidad.observacion || '—'}</td>
            <td className="p-3 font-mono">{unidad.prestamo || '—'}</td>
            <td className="p-3">
              {estadosPermitidos(unidad).length > 0 && (
                <button onClick={() => abrirCambioEstado(unidad)} className="text-primario font-semibold">Cambiar estado</button>
              )}
              {unidad.estado === 'Dada de baja' && <span className="text-gris">Baja definitiva</span>}
              {estadosPermitidos(unidad).length === 0 && unidad.estado !== 'Dada de baja' && (
                <span className="text-gris">Requiere registrar la devolución</span>
              )}
            </td>
          </tr>)}</tbody>
        </table></div>}
      </>}
      {pestana === 'condiciones' && <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={guardarCondiciones} noValidate className="bg-white border border-borde rounded p-6 space-y-4">
          <CampoInventario id="duracion" etiqueta="Duración máxima (días)" error={erroresCondiciones.duracion}>
            <input
              id="duracion"
              type="number"
              min="1"
              step="1"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              aria-invalid={Boolean(erroresCondiciones.duracion)}
              aria-describedby={erroresCondiciones.duracion && 'duracion-error'}
              className={campoClase}
            />
          </CampoInventario>
          <label className="block"><input type="checkbox" checked={autorizacion} onChange={(e) => setAutorizacion(e.target.checked)} /> Requiere autorización del docente</label>
          <label className="block"><input type="checkbox" checked={renovacion} onChange={(e) => setRenovacion(e.target.checked)} /> Admite renovación</label>
          <CampoInventario id="penalidad" etiqueta="Penalidad por día (S/)" error={erroresCondiciones.penalidad}>
            <input
              id="penalidad"
              type="number"
              min="0"
              step="0.01"
              value={penalidad}
              onChange={(e) => setPenalidad(e.target.value)}
              aria-invalid={Boolean(erroresCondiciones.penalidad)}
              aria-describedby={erroresCondiciones.penalidad && 'penalidad-error'}
              className={campoClase}
            />
          </CampoInventario>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { cargarCondiciones(equipo); setMensaje('Se recuperaron las últimas condiciones guardadas.'); }} className="border border-primario text-primario px-4 py-2 rounded">Descartar</button>
            <button type="submit" className="bg-primario text-white px-4 py-2 rounded">Guardar condiciones</button>
          </div>
        </form>
        <div className="bg-primario-suave rounded p-6">
          <h2 className="text-xs font-semibold uppercase text-gris">Vista previa para el estudiante</h2>
          <p className="mt-2">Préstamo de hasta {duracion || '—'} días calendario. {textoAutorizacion} {textoRenovacion} El retraso genera una penalidad de S/ {penalidad || '0'} por día.</p>
        </div>
      </div>}
      {pestana === 'historial' && <div className="bg-white border border-borde rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Historial de cambios de estado</h2>
        {historial.length === 0 && <p className="text-gris">Aún no hay cambios de estado registrados. Los cambios nuevos aparecerán aquí.</p>}
        {historial.length > 0 && <ul className="space-y-4">{historial.map((cambio, indice) => <li key={`${cambio.codigo}-${cambio.fecha}-${indice}`} className="border-b border-borde pb-3">
            <p className="font-mono text-sm">{cambio.codigo} · {new Date(cambio.fecha).toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
            <p>{cambio.anterior} → {cambio.nuevo}</p><p className="text-gris">Motivo: {cambio.motivo}</p>
          </li>)}</ul>}
      </div>}
      {modalAbierto && <ModalInventario titulo="Nueva unidad" onCerrar={() => setModalAbierto(false)}>
        <form onSubmit={guardarUnidad} noValidate className="space-y-4">
          <CampoInventario id="codigo-unidad" etiqueta="Código de inventario" error={erroresUnidad.codigo}>
            <input
              autoFocus
              id="codigo-unidad"
              value={nuevoCodigo}
              onChange={(e) => setNuevoCodigo(e.target.value)}
              placeholder="INV-OSC-0047"
              aria-invalid={Boolean(erroresUnidad.codigo)}
              aria-describedby={erroresUnidad.codigo && 'codigo-unidad-error'}
              className={`${campoClase} font-mono`}
            />
          </CampoInventario>
          <CampoInventario id="ubicacion" etiqueta="Ubicación" error={erroresUnidad.ubicacion}>
            <input
              id="ubicacion"
              value={nuevaUbicacion}
              onChange={(e) => setNuevaUbicacion(e.target.value)}
              aria-invalid={Boolean(erroresUnidad.ubicacion)}
              aria-describedby={erroresUnidad.ubicacion && 'ubicacion-error'}
              className={campoClase}
            />
          </CampoInventario>
          <CampoInventario id="observacion" etiqueta="Observaciones (opcional)">
            <textarea
              id="observacion"
              value={nuevaObservacion}
              onChange={(e) => setNuevaObservacion(e.target.value)}
              className={campoClase}
            />
          </CampoInventario>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setModalAbierto(false)} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-primario text-white px-4 py-2 rounded">Guardar unidad</button>
          </div>
        </form>
      </ModalInventario>}
      {unidadSeleccionada && <ModalInventario titulo="Cambiar estado" onCerrar={() => setUnidadSeleccionada(null)}>
        <p className="text-sm mb-4">Unidad: <b>{unidadSeleccionada.codigo}</b> · Estado actual: {unidadSeleccionada.estado}</p>
        <form onSubmit={guardarCambioEstado} noValidate className="space-y-4">
          <CampoInventario id="nuevo-estado" etiqueta="Nuevo estado" error={erroresEstado.estado}>
            <select
              autoFocus
              id="nuevo-estado"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              aria-invalid={Boolean(erroresEstado.estado)}
              aria-describedby={erroresEstado.estado && 'nuevo-estado-error'}
              className={campoClase}
            >
              <option value="">Seleccionar estado</option>
              {estadosPermitidos(unidadSeleccionada).map((estado) => <option key={estado}>{estado}</option>)}
            </select>
          </CampoInventario>
          <CampoInventario id="motivo" etiqueta="Motivo del cambio" error={erroresEstado.motivo}>
            <textarea
              id="motivo"
              value={motivoCambio}
              onChange={(e) => setMotivoCambio(e.target.value)}
              aria-invalid={Boolean(erroresEstado.motivo)}
              aria-describedby={erroresEstado.motivo && 'motivo-error'}
              className={campoClase}
            />
          </CampoInventario>
          {nuevoEstado === 'Dada de baja' && <p className="text-peligro text-sm">La baja es definitiva. Se pedirá confirmación antes de guardarla.</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setUnidadSeleccionada(null)} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-primario text-white px-4 py-2 rounded">Guardar cambio</button>
          </div>
        </form>
      </ModalInventario>}
    </PanelEncargado>
  );
}
