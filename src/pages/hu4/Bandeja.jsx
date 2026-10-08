import { useState } from 'react';
import { Link } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import Etiqueta from '../../components/Etiqueta';
import { solicitudes } from '../../datos';

export default function Bandeja() {
  const [lista, setLista] = useState(solicitudes);
  const [filtro, setFiltro] = useState('Enviada');
  const [aprobando, setAprobando] = useState(null); // solicitud del modal de aprobar
  const [rechazando, setRechazando] = useState(null); // solicitud del modal de rechazar
  const [unidad, setUnidad] = useState('INV-OSC-0042');
  const [motivo, setMotivo] = useState('');

  function cambiarEstado(codigo, nuevoEstado) {
    setLista(lista.map((s) => (s.codigo === codigo ? { ...s, estado: nuevoEstado } : s)));
  }

  function aprobar() {
    cambiarEstado(aprobando.codigo, 'Aprobada');
    setAprobando(null);
  }

  function rechazar() {
    cambiarEstado(rechazando.codigo, 'Rechazada');
    setRechazando(null);
    setMotivo('');
  }

  const contar = (estado) => lista.filter((s) => s.estado === estado).length;
  const visibles = lista.filter((s) => s.estado === filtro);

  return (
    <PanelEncargado>
      <h1 className="text-3xl font-semibold">Bandeja de solicitudes</h1>
      <p className="text-gris text-sm mb-4">{lista.length} solicitudes · Almacén H-102</p>

      <div className="flex gap-2 mb-4">
        {['Enviada', 'Aprobada', 'Rechazada'].map((e) => (
          <button key={e} onClick={() => setFiltro(e)} className={'border rounded px-4 py-2 text-sm ' + (filtro === e ? 'border-primario bg-primario-suave' : 'border-borde bg-white')}>
            {e}s <b className="font-mono">{contar(e)}</b>
          </button>
        ))}
      </div>

      <p className="bg-red-50 border-l-4 border-peligro p-3 text-sm mb-4">
        <b>Aviso de deuda pendiente.</b> 2 solicitantes de esta bandeja tienen penalidades sin regularizar.
      </p>

      <table className="w-full bg-white border border-borde text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
          <tr>
            <th className="p-3">Solicitante</th>
            <th className="p-3">Equipo</th>
            <th className="p-3">Fechas</th>
            <th className="p-3">Motivo</th>
            <th className="p-3">Antigüedad</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visibles.map((s) => (
            <tr key={s.codigo} className={'border-t border-borde ' + (s.carrera.startsWith('Deuda') ? 'bg-red-50' : '')}>
              <td className="p-3">
                {s.estudiante}
                <p className={'text-xs ' + (s.carrera.startsWith('Deuda') ? 'text-peligro' : 'text-gris')}>{s.carrera}</p>
              </td>
              <td className="p-3">{s.equipo}</td>
              <td className="p-3 font-mono">{s.fechas}</td>
              <td className="p-3 text-gris">{s.motivo}</td>
              <td className="p-3 font-mono">{s.hace}</td>
              <td className="p-3"><Etiqueta estado={s.estado} /></td>
              <td className="p-3">
                {s.estado === 'Enviada' && (
                  <div className="flex gap-2">
                    <button onClick={() => setAprobando(s)} className="bg-primario text-white px-3 py-1 rounded">Aprobar</button>
                    <button onClick={() => setRechazando(s)} className="border border-peligro text-peligro px-3 py-1 rounded">Rechazar</button>
                  </div>
                )}
                {s.estado === 'Aprobada' && <Link to="/encargado/entrega" className="text-primario">Registrar entrega</Link>}
                {s.estado === 'Rechazada' && <span className="text-primario">Ver motivo</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal aprobar */}
      {aprobando && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold">Aprobar solicitud</h2>
            <p className="text-sm text-gris mb-4">{aprobando.estudiante} · {aprobando.equipo} · {aprobando.fechas}</p>
            <p className="text-xs font-semibold uppercase mb-2">Unidad a asignar</p>
            {['INV-OSC-0042', 'INV-OSC-0043', 'INV-OSC-0046'].map((u) => (
              <label key={u} className={'flex gap-2 border rounded px-3 py-2 mb-2 font-mono ' + (unidad === u ? 'border-primario bg-primario-suave' : 'border-borde')}>
                <input type="radio" checked={unidad === u} onChange={() => setUnidad(u)} /> {u}
              </label>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setAprobando(null)} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</button>
              <button onClick={aprobar} className="bg-primario text-white px-4 py-2 rounded">Aprobar y asignar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal rechazar */}
      {rechazando && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold">Rechazar solicitud</h2>
            <p className="text-sm text-gris mb-4">{rechazando.estudiante} · {rechazando.equipo}</p>
            <select className="w-full border border-borde rounded px-3 py-2 mb-3">
              <option>Penalidad pendiente</option>
              <option>Sin unidades disponibles</option>
              <option>Falta autorización del docente</option>
            </select>
            <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Detalle (lo verá el estudiante)" className="w-full border border-borde rounded px-3 py-2 mb-3" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRechazando(null)} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</button>
              <button onClick={rechazar} className="bg-peligro text-white px-4 py-2 rounded">Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </PanelEncargado>
  );
}
