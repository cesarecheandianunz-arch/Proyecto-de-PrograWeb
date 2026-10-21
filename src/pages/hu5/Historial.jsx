import { useState } from 'react';
import PanelEncargado from '../../components/PanelEncargado';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePrestamos } from '../../context/PrestamosContext';
import { mostrarFecha } from '../../utils/prestamos';

export default function Historial() {
  const { estudianteId } = useParams();
  const navigate = useNavigate();
  const { estudiantes, prestamos, registrarPago: guardarPago, actualizarEstudiante } = usePrestamos();
  const [mensaje, setMensaje] = useState('');
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  let id = estudianteId || 'camila';
  const estudiante = estudiantes.find((e) => e.id === id);
  let deuda = 0;
  let bloqueada = false;
  if (estudiante) { deuda = estudiante.deuda; bloqueada = estudiante.bloqueada; }
  let textoBloqueo = 'Bloquear cuenta';
  let estadoCuenta = 'Habilitado';
  let colorCuenta = 'text-exito border-green-300';
  if (deuda > 0) { estadoCuenta = 'Con deuda'; colorCuenta = 'text-peligro border-red-300'; }
  if (bloqueada) { textoBloqueo = 'Desbloquear cuenta'; estadoCuenta = 'Bloqueada'; colorCuenta = 'text-peligro border-red-300'; }
  const propios = prestamos.filter((p) => p.estudianteId === id);
  const historial = propios.map((p) => {
    let devolucion = 'Pendiente';
    let retraso = '—';
    let penalidad = '—';
    if (p.devolucion) {
      devolucion = mostrarFecha(p.devolucion.fecha);
      retraso = p.devolucion.retraso + ' d';
      penalidad = 'S/ ' + p.devolucion.penalidad.toFixed(2);
      if (p.penalidadPagada && p.devolucion.penalidad > 0) penalidad += ' pagada';
    }
    return { codigo: p.codigo, equipo: p.equipo + ' · ' + p.unidad, entrega: mostrarFecha(p.fechaEntrega), devolucion, retraso, penalidad };
  });
  const retrasos = propios.filter((p) => p.devolucion && p.devolucion.retraso > 0).length;
  function registrarPago() {
    if (deuda <= 0) return;
    if (confirm('¿Registrar el pago de S/ ' + deuda.toFixed(2) + '?')) {
      guardarPago(id);
      setMensaje('Pago registrado. La deuda se actualizó en todas las vistas.');
    }
  }
  function cambiarBloqueo() {
    if (!bloqueada && !motivoBloqueo.trim()) { setMensaje('Escribe el motivo del bloqueo.'); return; }
    if (!bloqueada && propios.filter((p) => p.estado === 'Activo').length > 0) { setMensaje('Registra primero la devolución de los préstamos activos.'); return; }
    let accion = 'bloquear';
    if (bloqueada) accion = 'desbloquear';
    if (confirm('¿Deseas ' + accion + ' la cuenta de ' + estudiante.nombre + '?')) {
      actualizarEstudiante(id, { bloqueada: !bloqueada, motivoBloqueo: motivoBloqueo.trim() });
      setMensaje('Cambio de bloqueo registrado.');
    }
  }
  if (!estudiante) return <PanelEncargado><p>Estudiante no encontrado.</p><Link to="/encargado/historial">Volver al historial</Link></PanelEncargado>;

  return (
    <PanelEncargado>
      <p className="text-sm text-gris mb-1">Usuarios / Estudiantes / {estudiante.nombre}</p>
      <label className="block text-sm my-4">Consultar estudiante
        <select
          aria-label="Consultar estudiante"
          value={id}
          onChange={(e) => { navigate('/encargado/historial/' + e.target.value); setMensaje(''); setMotivoBloqueo(''); }}
          className="border border-borde rounded p-2 ml-3"
        >
          {estudiantes.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-semibold">{estudiante.nombre}</h1>
          <p className="text-gris text-sm">
            {estudiante.carrera} · {estudiante.ciclo}.º ciclo · {estudiante.correo}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={registrarPago}
            disabled={deuda === 0}
            className="border border-primario text-primario disabled:opacity-50 px-4 py-2 rounded min-h-10"
          >
            Registrar pago
          </button>
          <button
            type="button"
            onClick={cambiarBloqueo}
            className="border border-peligro text-peligro px-4 py-2 rounded min-h-10"
          >
            {textoBloqueo}
          </button>
        </div>
      </div>

      {!bloqueada && <label className="block text-sm mb-4">Motivo para bloquear
        <input value={motivoBloqueo} onChange={(e) => setMotivoBloqueo(e.target.value)} className="border border-borde rounded p-2 ml-3" />
      </label>}
      {bloqueada && <p className="text-peligro mb-4">Motivo del bloqueo: {estudiante.motivoBloqueo}</p>}
      {mensaje && (
        <div className="bg-green-50 border border-green-200 border-l-4 border-l-exito p-3 text-sm mb-5">
          {mensaje}
        </div>
      )}

      {deuda > 0 && (
        <div className="bg-red-50 border-l-4 border-peligro p-4 text-sm mb-6">
          <b>Aviso de deuda pendiente.</b> S/ {deuda.toFixed(2)} en penalidades pendientes. No puede solicitar equipos hasta regularizar.
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-borde rounded p-4">
          <p className="text-xs uppercase text-gris">Préstamos</p>
          <p className="text-3xl font-semibold">{propios.length}</p>
        </div>
        <div className="bg-white border border-borde rounded p-4">
          <p className="text-xs uppercase text-gris">Retrasos acumulados</p>
          <p className="text-3xl font-semibold text-peligro">{retrasos}</p>
        </div>
        <div className="bg-white border border-borde rounded p-4">
          <p className="text-xs uppercase text-gris">Penalidades</p>
          <p className="text-3xl font-semibold font-mono text-alerta">S/ {deuda.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-borde rounded p-4">
          <p className="text-xs uppercase text-gris">Estado</p>
          <span
            className={
              'inline-block text-sm border rounded px-2 py-1 ' + colorCuenta
            }
          >
            {estadoCuenta}
          </span>
        </div>
      </div>

      <div className="bg-white border border-borde rounded overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
            <tr>
              <th className="p-3">Préstamo</th>
              <th className="p-3">Equipo y unidad</th>
              <th className="p-3">Entrega</th>
              <th className="p-3">Devolución</th>
              <th className="p-3">Retraso</th>
              <th className="p-3">Penalidad</th>
            </tr>
          </thead>
          <tbody>
            {historial.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-gris">Este estudiante aún no tiene préstamos.</td></tr>}
            {historial.map((h) => (
              <tr key={h.codigo} className="border-t border-borde">
                <td className="p-3 font-mono font-semibold">{h.codigo}</td>
                <td className="p-3">{h.equipo}</td>
                <td className="p-3 font-mono">{h.entrega}</td>
                <td className="p-3 font-mono">{h.devolucion}</td>
                <td className="p-3">{h.retraso}</td>
                <td className="p-3 font-mono">{h.penalidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelEncargado>
  );
}
