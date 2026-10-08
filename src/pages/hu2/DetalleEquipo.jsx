import { useState } from 'react';
import PanelEncargado from '../../components/PanelEncargado';
import Etiqueta from '../../components/Etiqueta';
import { unidades } from '../../datos';

export default function DetalleEquipo() {
  const [pestana, setPestana] = useState('unidades');
  const [duracion, setDuracion] = useState(7);
  const [autorizacion, setAutorizacion] = useState(true);
  const [renovacion, setRenovacion] = useState(false);
  const [penalidad, setPenalidad] = useState(15);
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Inventario / Medición / Osciloscopio TBS1052B</p>
      <h1 className="text-3xl font-semibold">Osciloscopio TBS1052B</h1>
      <p className="text-gris text-sm mb-6">Tektronix · TBS1052B · 5 unidades registradas · Almacén H-102</p>

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
              </tr>
            </thead>
            <tbody>
              {unidades.map((u) => (
                <tr key={u.codigo} className="border-t border-borde">
                  <td className="p-3 font-mono font-semibold">{u.codigo}</td>
                  <td className="p-3 text-gris">{u.ubicacion}</td>
                  <td className="p-3"><Etiqueta estado={u.estado} /></td>
                  <td className="p-3 text-gris">{u.observacion}</td>
                  <td className="p-3 font-mono">{u.prestamo}</td>
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
            <input placeholder="Código: INV-OSC-0047" className="w-full border border-borde rounded px-3 py-2 mb-3 font-mono" />
            <input placeholder="Ubicación" className="w-full border border-borde rounded px-3 py-2 mb-3" />
            <textarea placeholder="Observaciones" className="w-full border border-borde rounded px-3 py-2 mb-3" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setModalAbierto(false)} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</button>
              <button onClick={() => setModalAbierto(false)} className="bg-primario text-white px-4 py-2 rounded">Guardar unidad</button>
            </div>
          </div>
        </div>
      )}
    </PanelEncargado>
  );
}
