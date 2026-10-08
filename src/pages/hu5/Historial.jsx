import { useState } from 'react';
import PanelEncargado from '../../components/PanelEncargado';

const historial = [
  { codigo: 'PRE-2026-0291', equipo: 'Tableta Wacom Intuos · INV-TAB-0004', entrega: '07/09/2026', devolucion: '14/09/2026', retraso: '3 d', penalidad: 'S/ 45.00' },
  { codigo: 'PRE-2026-0245', equipo: 'Cámara Canon EOS 90D · INV-CAM-0010', entrega: '20/08/2026', devolucion: '25/08/2026', retraso: '—', penalidad: '—' },
  { codigo: 'PRE-2026-0198', equipo: 'Trípode Manfrotto MT055 · INV-TRI-0007', entrega: '05/08/2026', devolucion: '09/08/2026', retraso: '1 d', penalidad: 'S/ 15.00 pagada' },
  { codigo: 'PRE-2026-0142', equipo: 'Multímetro Fluke 117 · INV-MUL-0022', entrega: '14/07/2026', devolucion: '18/07/2026', retraso: '—', penalidad: '—' },
];

export default function Historial() {
  const [deuda, setDeuda] = useState(45);

  function registrarPago() {
    if (confirm('¿Registrar el pago de S/ ' + deuda.toFixed(2) + '?')) {
      setDeuda(0);
    }
  }

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Usuarios / Estudiantes / Camila Quispe Andrade</p>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-semibold">Camila Quispe Andrade</h1>
          <p className="text-gris text-sm">Ingeniería Industrial · 8.º ciclo · código 20204512 · cquispe@aloe.ulima.edu.pe</p>
        </div>
        <button onClick={registrarPago} className="border border-primario text-primario px-4 py-2 rounded">Registrar pago</button>
      </div>

      {deuda > 0 && (
        <p className="bg-red-50 border-l-4 border-peligro p-3 text-sm mb-6">
          <b>Aviso de deuda pendiente.</b> S/ {deuda.toFixed(2)} por 3 días de retraso en PRE-2026-0291. La estudiante no puede solicitar equipos.
        </p>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-borde rounded p-4"><p className="text-xs uppercase text-gris">Préstamos</p><p className="text-3xl font-semibold">14</p></div>
        <div className="bg-white border border-borde rounded p-4"><p className="text-xs uppercase text-gris">Retrasos acumulados</p><p className="text-3xl font-semibold text-peligro">2</p></div>
        <div className="bg-white border border-borde rounded p-4"><p className="text-xs uppercase text-gris">Penalidades</p><p className="text-3xl font-semibold font-mono text-alerta">S/ {deuda.toFixed(2)}</p></div>
        <div className="bg-white border border-borde rounded p-4">
          <p className="text-xs uppercase text-gris">Estado</p>
          <span className={'text-sm border rounded px-2 py-1 ' + (deuda > 0 ? 'text-peligro border-red-300' : 'text-exito border-green-300')}>
            {deuda > 0 ? 'Con deuda' : 'Habilitado'}
          </span>
        </div>
      </div>

      <table className="w-full bg-white border border-borde text-sm">
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
    </PanelEncargado>
  );
}
