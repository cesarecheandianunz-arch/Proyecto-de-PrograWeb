import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import { usePrestamos } from '../../context/PrestamosContext';
import { useInventario } from '../../context/InventarioContext';
import { hoyISO, mostrarFecha } from '../../utils/prestamos';

export default function RegistrarEntrega() {
  const navigate = useNavigate();
  const { codigo } = useParams();
  const { solicitudes, registrarEntrega } = usePrestamos();
  const { equipos } = useInventario();
  const solicitud = solicitudes.find((s) => s.codigo === codigo);
  const [accesorios, setAccesorios] = useState([]);
  const [fecha, setFecha] = useState(hoyISO() + 'T09:00');
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const equipo = equipos.find((e) => e.id === solicitud?.equipoId);
    let lista = [];
    if (equipo) lista = (equipo.accesorios || []).map((nombre) => ({ nombre, entregado: true }));
    setAccesorios(lista);
    setFecha(hoyISO() + 'T09:00');
    setObservaciones('');
    setError('');
  }, [codigo, solicitud?.equipoId, equipos]);

  function guardar() {
    const resultado = registrarEntrega(codigo, { fecha, accesorios, observaciones });
    if (resultado.error) { setError(resultado.error); return; }
    navigate('/encargado/constancia/' + codigo, { state: { mensaje: 'Entrega registrada correctamente.' } });
  }

  function claseAccesorio(entregado) {
    if (entregado) return 'border-borde';
    return 'border-amber-300 bg-amber-50';
  }

  function marcar(i) {
    setAccesorios(accesorios.map((a, j) => {
      if (j === i) return { ...a, entregado: !a.entregado };
      return a;
    }));
  }

  if (!solicitud || solicitud.estado !== 'Aprobada') return (
    <PanelEncargado>
      <h1 className="text-2xl mb-4">Selecciona una solicitud aprobada para registrar su entrega</h1>
      <Link to="/encargado/solicitudes" className="text-primario underline">Ir a la bandeja de solicitudes</Link>
      {solicitudes.filter((s) => s.estado === 'Aprobada').map((s) => <Link key={s.codigo} to={'/encargado/entrega/' + s.codigo} className="block bg-white border border-borde rounded p-4 mt-3">{s.codigo} · {s.equipo} · {s.estudiante}</Link>)}
    </PanelEncargado>
  );

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Solicitudes / {solicitud.codigo} / Registrar entrega</p>
      <h1 className="text-3xl font-semibold mb-6">Registrar entrega</h1>

      {error && <p role="alert" className="bg-red-50 text-peligro p-3 mb-4">{error}</p>}
      <div className="max-w-3xl bg-white border border-borde rounded p-6">
        <div className="grid grid-cols-2 gap-4 bg-gray-50 border border-borde rounded p-4 mb-6 text-sm">
          <div><p className="text-xs uppercase text-gris">Estudiante</p>{solicitud.estudiante}</div>
          <div><p className="text-xs uppercase text-gris">Código de préstamo</p><span className="font-mono">{solicitud.codigo}</span></div>
          <div><p className="text-xs uppercase text-gris">Equipo y unidad</p>{solicitud.equipo} · <span className="font-mono">{solicitud.unidad}</span></div>
          <div><p className="text-xs uppercase text-gris">Devolución pactada</p><span className="font-mono">{mostrarFecha(solicitud.fin)} · 19:00</span></div>
        </div>

        <p className="text-xs font-semibold uppercase text-primario mb-2">Accesorios entregados</p>
        {accesorios.map((a, i) => (
          <label key={a.nombre} className={'flex gap-2 border rounded px-3 py-2 mb-2 ' + claseAccesorio(a.entregado)}>
            <input type="checkbox" checked={a.entregado} onChange={() => marcar(i)} /> {a.nombre}
            {!a.entregado && <span className="ml-auto text-alerta text-sm">no se entrega</span>}
          </label>
        ))}

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Fecha de entrega</label>
            <input
              aria-label="Fecha de entrega"
              type="datetime-local"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-borde rounded px-3 py-2"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase mb-1">Observaciones del estado inicial</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={() => navigate('/encargado/solicitudes')} className="text-primario underline px-4">Cancelar</button>
          <button onClick={guardar} className="bg-primario text-white px-4 py-2 rounded">Registrar entrega y generar constancia</button>
        </div>
      </div>
    </PanelEncargado>
  );
}
