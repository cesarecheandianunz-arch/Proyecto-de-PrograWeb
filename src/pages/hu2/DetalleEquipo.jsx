import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import Etiqueta from '../../components/Etiqueta';
import { useInventario } from '../../context/InventarioContext.jsx';
export default function DetalleEquipo() {
  const { id } = useParams();
  const { equipos, unidades, setUnidades } = useInventario();
  const [pestana, setPestana] = useState('unidades');
  const [duracion, setDuracion] = useState(7);
  const [autorizacion, setAutorizacion] = useState(true);
  const [renovacion, setRenovacion] = useState(false);
  const [penalidad, setPenalidad] = useState(15);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevaUbicacion, setNuevaUbicacion] = useState('');
  const [nuevaObservacion, setNuevaObservacion] = useState('');
  const [modalEstadoAbierto, setModalEstadoAbierto] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [motivoCambio, setMotivoCambio] = useState('');
  const equipo = equipos.find((equipo) => equipo.id === Number(id));

  if (!equipo) {
    return <p> Equipo no encontrado</p>;
  }
  const unidadesEquipo = unidades.filter(
    (unidad) => unidad.equipoId === equipo.id);

  function guardarUnidad() {
    if (nuevoCodigo.trim() === '' || nuevaUbicacion.trim() === '') {
      alert('Completa el código y la ubicación');
      return;
    }
    const nuevaUnidad = {
      codigo: nuevoCodigo.trim(),
      equipoId: equipo.id,
      ubicacion: nuevaUbicacion.trim(),
      estado: 'Disponible',
      observacion: nuevaObservacion.trim(),
      prestamo: '—'
    };
    setUnidades((anteriores) => [...anteriores, nuevaUnidad]);
    setNuevoCodigo('');
    setNuevaUbicacion('');
    setNuevaObservacion('');
    setModalAbierto(false);
  }
  function abrirCambioEstado(unidad) {
    setUnidadSeleccionada(unidad);
    setNuevoEstado('');
    setMotivoCambio('');
    setModalEstadoAbierto(true);
  }
  function guardarCambioEstado() {
    if (nuevoEstado === '') {
      alert('Selecciona el nuevo estado');
      return;
    }
    if (motivoCambio.trim() === '') {
      alert('Ingresa el motivo del cambio');
      return;
    }
    setUnidades((anteriores) =>
      anteriores.map((unidad) => {
        if (unidad.codigo === unidadSeleccionada.codigo) {
          return {
            ...unidad,
            estado: nuevoEstado,
            motivoCambio: motivoCambio.trim()
          };
        } else {
          return unidad;
        }

      })
    );
    setModalEstadoAbierto(false);
    setUnidadSeleccionada(null);
    setNuevoEstado('');
    setMotivoCambio('');
  }

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Inventario / {equipo.categoria} / {equipo.nombre}</p>
      <h1 className="text-3xl font-semibold">{equipo.nombre}</h1>
      <p className="text-gris text-sm mb-6">{equipo.marca} · {equipo.modelo} · {unidadesEquipo.length} unidades registradas · Almacén H-102</p>

      <div className="flex gap-4 border-b border-borde mb-6">
        <button onClick={() => setPestana('unidades')} className={'pb-2 ' + (pestana === 'unidades' ? 'border-b-2 border-primario text-primario' : 'text-gris')}>Unidades</button>
        <button onClick={() => setPestana('condiciones')} className={'pb-2 ' + (pestana === 'condiciones' ? 'border-b-2 border-primario text-primario' : 'text-gris')}>Condiciones del préstamo</button>
      </div>

      {pestana === 'unidades' && (
        <>
          <div className="flex justify-end mb-3">
            <button onClick={() => setModalAbierto(true)} className="bg-primario text-white px-4 py-2 rounded">Nueva unidad</button>
          </div>
          <table className="w-full bg-white border border-borde text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
              <tr>
                <th className="p-3">Código</th>
                <th className="p-3">Ubicación</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Observaciones</th>
                <th className="p-3">Préstamo vigente</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {unidadesEquipo.map((u) => (
                <tr key={u.codigo} className="border-t border-borde">
                  <td className="p-3 font-mono font-semibold">{u.codigo}</td>
                  <td className="p-3 text-gris">{u.ubicacion}</td>
                  <td className="p-3"><Etiqueta estado={u.estado} /></td>
                  <td className="p-3 text-gris">{u.observacion}</td>
                  <td className="p-3 font-mono">{u.prestamo}</td>
                  <td className="p-3">
                    <button onClick={() => abrirCambioEstado(u)} className="text-primario font-semibold">
                      Cambiar estado</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {pestana === 'condiciones' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-borde rounded p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Duración máxima (días)</label>
              <input type="number" value={duracion} onChange={(e) => setDuracion(e.target.value)} className="w-32 border border-borde rounded px-3 py-2 font-mono" />
            </div>
            <label className="block"><input type="checkbox" checked={autorizacion} onChange={(e) => setAutorizacion(e.target.checked)} /> Requiere autorización del docente</label>
            <label className="block"><input type="checkbox" checked={renovacion} onChange={(e) => setRenovacion(e.target.checked)} /> Admite renovación</label>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Penalidad por día (S/)</label>
              <input type="number" value={penalidad} onChange={(e) => setPenalidad(e.target.value)} className="w-32 border border-borde rounded px-3 py-2 font-mono" />
            </div>
            <button onClick={() => alert('Condiciones guardadas')} className="bg-primario text-white px-4 py-2 rounded">Guardar condiciones</button>
          </div>

          {/* Vista previa: se actualiza mientras escribes */}
          <div className="bg-primario-suave rounded p-6">
            <p className="text-xs font-semibold uppercase text-gris">Vista previa para el estudiante</p>
            <p className="mt-2">
              Préstamo de hasta {duracion} días calendario. {autorizacion ? 'Requiere la autorización del docente.' : 'No requiere autorización.'}{' '}
              {renovacion ? 'Admite renovación.' : 'No admite renovación.'} El retraso genera una penalidad de S/ {penalidad} por día.
            </p>
          </div>
        </div>
      )}

      {/* Modal para nueva unidad */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Nueva unidad</h2>
            <input
              value={nuevoCodigo}
              onChange={(e) => setNuevoCodigo(e.target.value)}
              placeholder="Código: INV-OSC-0047"
              className="w-full border border-borde rounded px-3 py-2 mb-3 font-mono"
            />
            <input
              value={nuevaUbicacion}
              onChange={(e) => setNuevaUbicacion(e.target.value)}
              placeholder="Ubicación"
              className="w-full border border-borde rounded px-3 py-2 mb-3"
            />
            <textarea
              value={nuevaObservacion}
              onChange={(e) => setNuevaObservacion(e.target.value)}
              placeholder="Observaciones"
              className="w-full border border-borde rounded px-3 py-2 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalAbierto(false)} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</button>
              <button onClick={guardarUnidad} className="bg-primario text-white px-4 py-2 rounded">Guardar unidad</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal para cambiar estado de unidad */}
      {modalEstadoAbierto && unidadSeleccionada && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white rounded p-6 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-1">
              Cambiar estado
            </h2>

            <p className="text-sm text-gris mb-4">
              Unidad: {unidadSeleccionada.codigo}
            </p>

            <p className="text-sm mb-3">
              Estado actual: <strong>{unidadSeleccionada.estado}</strong>
            </p>

            <label className="block text-xs font-semibold uppercase mb-1">
              Nuevo estado
            </label>

            <select
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="w-full border border-borde rounded px-3 py-2 mb-4"
            >
              <option value="">Seleccionar estado</option>
              <option value="Disponible">Disponible</option>
              <option value="Prestada">Prestada</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Dada de baja">Dada de baja</option>
            </select>

            <label className="block text-xs font-semibold uppercase mb-1">
              Motivo del cambio
            </label>

            <textarea
              value={motivoCambio}
              onChange={(e) => setMotivoCambio(e.target.value)}
              placeholder="Ej. Equipo enviado a mantenimiento por falla en la sonda"
              className="w-full border border-borde rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setModalEstadoAbierto(false)}
                className="border border-primario text-primario px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCambioEstado}
                className="bg-primario text-white px-4 py-2 rounded">Guardar cambio</button>
            </div>
          </div>
        </div>
      )}

    </PanelEncargado>
  );
}
