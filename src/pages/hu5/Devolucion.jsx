import { useState } from 'react';
import PanelEncargado from '../../components/PanelEncargado';

export default function Devolucion() {
  const [codigo, setCodigo] = useState('PRE-2026-0291');
  const [encontrado, setEncontrado] = useState(false);
  const [accesorios, setAccesorios] = useState([
    { nombre: 'Lápiz digital', devuelto: true },
    { nombre: 'Cable USB', devuelto: true },
    { nombre: 'Estuche', devuelto: true },
  ]);
  const [estadoRetorno, setEstadoRetorno] = useState('Sin novedades');
  const [fechaRetorno, setFechaRetorno] = useState('2026-09-14');
  const [descripcion, setDescripcion] = useState('');
  const [mantenimiento, setMantenimiento] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Cálculo del retraso respecto de la fecha pactada (11/09/2026)
  const diasRetraso = Math.max(0, (new Date(fechaRetorno) - new Date('2026-09-11')) / (1000 * 60 * 60 * 24));
  const penalidad = diasRetraso * 15;

  function marcar(i) {
    setAccesorios(accesorios.map((a, j) => (j === i ? { ...a, devuelto: !a.devuelto } : a)));
  }

  function registrar() {
    setMensaje('Devolución registrada. ' + (penalidad > 0 ? 'Penalidad: S/ ' + penalidad.toFixed(2) : 'Sin penalidad.'));
    setEncontrado(false);
  }

  return (
    <PanelEncargado>
      <h1 className="text-3xl font-semibold mb-6">Registrar devolución</h1>
      {mensaje && <p className="bg-green-50 border-l-4 border-exito p-3 mb-4">{mensaje}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-borde rounded p-6">
          <label className="block text-xs font-semibold uppercase mb-1">Buscar préstamo</label>
          <div className="flex gap-2 mb-4">
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} className="flex-1 border border-borde rounded px-3 py-2 font-mono" />
            <button onClick={() => { setEncontrado(true); setMensaje(''); }} className="bg-primario text-white px-4 rounded">Buscar</button>
          </div>

          {encontrado && (
            <>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-borde rounded p-4 text-sm mb-4">
                <div><p className="text-xs uppercase text-gris">Estudiante</p>Camila Quispe Andrade</div>
                <div><p className="text-xs uppercase text-gris">Equipo y unidad</p>Tableta Wacom · <span className="font-mono">INV-TAB-0004</span></div>
                <div><p className="text-xs uppercase text-gris">Devolución pactada</p><span className="font-mono">11/09/2026</span></div>
              </div>

              <p className="text-xs font-semibold uppercase text-primario mb-2">Verificación de accesorios</p>
              {accesorios.map((a, i) => (
                <label key={a.nombre} className={'flex gap-2 border rounded px-3 py-2 mb-2 ' + (a.devuelto ? 'border-borde' : 'border-red-300 bg-red-50')}>
                  <input type="checkbox" checked={a.devuelto} onChange={() => marcar(i)} /> {a.nombre}
                  {!a.devuelto && <span className="ml-auto text-peligro text-sm">faltante</span>}
                </label>
              ))}

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs font-semibold uppercase mb-1">Estado de retorno</p>
                  {['Sin novedades', 'Con daños', 'Faltantes'].map((op) => (
                    <label key={op} className="block text-sm"><input type="radio" checked={estadoRetorno === op} onChange={() => setEstadoRetorno(op)} /> {op}</label>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase mb-1">Fecha de retorno</p>
                  <input type="date" value={fechaRetorno} onChange={(e) => setFechaRetorno(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
                </div>
              </div>

              {diasRetraso > 0 ? (
                <p className="bg-red-50 border-l-4 border-peligro p-3 text-sm mt-4">
                  <b>{diasRetraso} días de retraso.</b> Penalidad calculada: S/ {penalidad.toFixed(2)} (S/ 15.00 por día).
                </p>
              ) : (
                <p className="bg-green-50 border-l-4 border-exito p-3 text-sm mt-4">Devolución a tiempo. Sin penalidad.</p>
              )}

              {estadoRetorno === 'Sin novedades' && (
                <div className="flex justify-end mt-4">
                  <button onClick={registrar} className="bg-primario text-white px-4 py-2 rounded">Registrar devolución</button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Panel de daños: solo aparece si el retorno no es "sin novedades" */}
        {encontrado && estadoRetorno !== 'Sin novedades' && (
          <div className="bg-white border border-borde rounded p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Registrar daños o faltantes</h2>
            <label className="block text-xs font-semibold uppercase mb-1">Descripción del daño</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3" className="w-full border border-borde rounded px-3 py-2 mb-4" />
            <label className="block mb-4"><input type="checkbox" checked={mantenimiento} onChange={(e) => setMantenimiento(e.target.checked)} /> Derivar la unidad a mantenimiento</label>
            {mantenimiento && (
              <p className="bg-amber-50 border-l-4 border-acento p-3 text-sm mb-4">
                La unidad INV-TAB-0004 pasará a «En mantenimiento».
              </p>
            )}
            <div className="flex justify-end">
              <button onClick={registrar} className="bg-primario text-white px-4 py-2 rounded">Guardar y cerrar devolución</button>
            </div>
          </div>
        )}
      </div>
    </PanelEncargado>
  );
}
