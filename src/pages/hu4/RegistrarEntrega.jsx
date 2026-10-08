import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';

export default function RegistrarEntrega() {
  const navigate = useNavigate();
  const [accesorios, setAccesorios] = useState([
    { nombre: '2 sondas de medición', entregado: true },
    { nombre: 'Cable USB', entregado: true },
    { nombre: 'Estuche rígido', entregado: false },
  ]);
  const [fecha, setFecha] = useState('2026-09-16T09:20');
  const [observaciones, setObservaciones] = useState('');

  function marcar(i) {
    setAccesorios(accesorios.map((a, j) => (j === i ? { ...a, entregado: !a.entregado } : a)));
  }

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Solicitudes / PRE-2026-0318 / Registrar entrega</p>
      <h1 className="text-3xl font-semibold mb-6">Registrar entrega</h1>

      <div className="max-w-3xl bg-white border border-borde rounded p-6">
        <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-borde rounded p-4 mb-6 text-sm">
          <div><p className="text-xs uppercase text-gris">Estudiante</p>Renzo Mendoza Cárdenas</div>
          <div><p className="text-xs uppercase text-gris">Código de préstamo</p><span className="font-mono">PRE-2026-0318</span></div>
          <div><p className="text-xs uppercase text-gris">Equipo y unidad</p>Osciloscopio TBS1052B · <span className="font-mono">INV-OSC-0042</span></div>
          <div><p className="text-xs uppercase text-gris">Devolución pactada</p><span className="font-mono">21/09/2026 · 19:00</span></div>
        </div>

        <p className="text-xs font-semibold uppercase text-primario mb-2">Accesorios entregados</p>
        {accesorios.map((a, i) => (
          <label key={a.nombre} className={'flex gap-2 border rounded px-3 py-2 mb-2 ' + (a.entregado ? 'border-borde' : 'border-amber-300 bg-amber-50')}>
            <input type="checkbox" checked={a.entregado} onChange={() => marcar(i)} /> {a.nombre}
            {!a.entregado && <span className="ml-auto text-alerta text-sm">no se entrega</span>}
          </label>
        ))}

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Fecha de entrega</label>
            <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase mb-1">Observaciones del estado inicial</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => navigate('/encargado/solicitudes')} className="text-primario underline px-4">Cancelar</button>
          <button onClick={() => navigate('/encargado/constancia')} className="bg-primario text-white px-4 py-2 rounded">Registrar entrega y generar constancia</button>
        </div>
      </div>
    </PanelEncargado>
  );
}
