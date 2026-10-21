import { useState } from 'react';
import { Link } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import Etiqueta from '../../components/Etiqueta';
import { categorias } from '../../datos';
import { usePrestamos } from '../../context/PrestamosContext';
import { useInventario } from '../../context/InventarioContext';
import { mostrarFecha, unidadesDisponibles } from '../../utils/prestamos';
import Paginacion from '../../components/Paginacion';

export default function Bandeja() {
  const { solicitudes: lista, prestamos, estudiantes, aprobarSolicitud, rechazarSolicitud } = usePrestamos();
  const { equipos, unidades } = useInventario();
  const [filtro, setFiltro] = useState('Enviada');
  const [aprobando, setAprobando] = useState(null); // solicitud del modal de aprobar
  const [rechazando, setRechazando] = useState(null); // solicitud del modal de rechazar
  const [unidad, setUnidad] = useState('');
  const [motivo, setMotivo] = useState('');

  const [causa, setCausa] = useState('Penalidad pendiente');
  const [autorizacion, setAutorizacion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [equipoFiltro, setEquipoFiltro] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [pagina, setPagina] = useState(1);

  function abrirAprobacion(solicitud) {
    setAprobando(solicitud);
    setUnidad('');
    setAutorizacion(false);
    setMensaje('');
  }
  function aprobar() {
    const resultado = aprobarSolicitud(aprobando.codigo, unidad, autorizacion);
    if (resultado.error) { setMensaje(resultado.error); return; }
    setAprobando(null);
    setMensaje('Solicitud aprobada y unidad asignada.');
  }
  function rechazar() {
    if (!motivo.trim()) { setMensaje('Escribe el detalle del rechazo.'); return; }
    const resultado = rechazarSolicitud(rechazando.codigo, causa + ': ' + motivo.trim());
    if (resultado.error) { setMensaje(resultado.error); return; }
    setRechazando(null);
    setMotivo('');
    setMensaje('Solicitud rechazada. El estudiante puede consultar el motivo.');
  }
  function tieneDeuda(solicitud) {
    const estudiante = estudiantes.find((e) => e.id === solicitud.estudianteId);
    return Boolean(estudiante && (estudiante.deuda > 0 || estudiante.bloqueada));
  }
  function claseFiltro(estado) {
    if (filtro === estado) return 'border-primario bg-primario-suave';
    return 'border-borde bg-white';
  }
  function claseFila(solicitud) {
    if (tieneDeuda(solicitud)) return 'bg-red-50';
    return '';
  }
  function claseCarrera(solicitud) {
    if (tieneDeuda(solicitud)) return 'text-peligro';
    return 'text-gris';
  }
  function descripcionEstudiante(solicitud) {
    const estudiante = estudiantes.find((e) => e.id === solicitud.estudianteId);
    if (!estudiante) return solicitud.carrera;
    if (estudiante.deuda > 0) return estudiante.carrera + ' · Deuda S/ ' + estudiante.deuda.toFixed(2);
    if (estudiante.bloqueada) return estudiante.carrera + ' · Cuenta bloqueada';
    return estudiante.carrera;
  }
  function claseUnidad(codigo) {
    if (unidad === codigo) return 'border-primario bg-primario-suave';
    return 'border-borde';
  }
  const contar = (estado) => lista.filter((s) => s.estado === estado).length;
  let filtradas = lista;
  if (filtro !== '') filtradas = filtradas.filter((s) => s.estado === filtro);
  if (equipoFiltro !== '') filtradas = filtradas.filter((s) => s.equipoId === Number(equipoFiltro));
  if (categoria !== '') filtradas = filtradas.filter((s) => equipos.filter((e) => e.id === s.equipoId && e.categoria === categoria).length > 0);
  if (desde) filtradas = filtradas.filter((s) => s.fin >= desde);
  if (hasta) filtradas = filtradas.filter((s) => s.inicio <= hasta);
  if (busqueda.trim()) filtradas = filtradas.filter((s) => (s.estudiante + ' ' + s.curso + ' ' + s.equipo).toLowerCase().includes(busqueda.trim().toLowerCase()));
  const paginas = Math.max(1, Math.ceil(filtradas.length / 8));
  const paginaActual = Math.min(pagina, paginas);
  const visibles = filtradas.slice((paginaActual - 1) * 8, paginaActual * 8);
  let disponibles = [];
  let equipoAprobando;
  if (aprobando) {
    disponibles = unidadesDisponibles(aprobando.equipoId, aprobando.inicio, aprobando.fin, unidades, lista, prestamos);
    equipoAprobando = equipos.find((e) => e.id === aprobando.equipoId);
  }

  return (
    <PanelEncargado>
      <h1 className="text-3xl font-semibold">Bandeja de solicitudes</h1>
      <p className="text-gris text-sm mb-4">{lista.length} solicitudes · Almacén H-102</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {['Enviada', 'Aprobada', 'Rechazada', 'Entregada', 'Devuelta', 'Retirada'].map((e) => (
          <button
            key={e}
            onClick={() => { setFiltro(e); setPagina(1); }}
            className={'border rounded px-4 py-2 text-sm ' + claseFiltro(e)}
          >
            {e}s <b className="font-mono">{contar(e)}</b>
          </button>
        ))}
      </div>

      <div className="bg-red-50 border-l-4 border-peligro p-3 text-sm mb-4">
        <b>Aviso de deuda pendiente.</b>{' '}
        {lista.filter((s) => tieneDeuda(s)).length} solicitudes corresponden a estudiantes con deuda o bloqueo.
        <Link
          to="/encargado/historial"
          className="ml-2 text-primario underline font-semibold"
        >
          Ver historial
        </Link>
      </div>

      {mensaje && <p role="status" className="bg-primario-suave p-3 mb-4">{mensaje}</p>}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          aria-label="Buscar solicitudes"
          placeholder="Estudiante, curso o equipo"
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2"
        />
        <select
          aria-label="Categoría"
          value={categoria}
          onChange={(e) => { setCategoria(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2"
        ><option value="">Todas las categorías</option>{categorias.map((c) => <option key={c}>{c}</option>)}</select>
        <select
          aria-label="Equipo"
          value={equipoFiltro}
          onChange={(e) => { setEquipoFiltro(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2"
        ><option value="">Todos los equipos</option>{equipos.map((e) => <option key={e.id} value={e.id}>{e.nombre}</option>)}</select>
        <label className="text-sm">Desde <input
          aria-label="Desde"
          type="date"
          value={desde}
          onChange={(e) => { setDesde(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2"
        /></label>
        <label className="text-sm">Hasta <input
          aria-label="Hasta"
          type="date"
          value={hasta}
          onChange={(e) => { setHasta(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2"
        /></label>
        <button
          onClick={() => { setBusqueda(''); setCategoria(''); setEquipoFiltro(''); setDesde(''); setHasta(''); setFiltro(''); setPagina(1); }}
          className="text-primario underline"
        >Limpiar filtros</button>
      </div>
      <p className="text-sm text-gris mb-3">{filtradas.length} coincidencias</p>
      <div className="overflow-x-auto"><table className="w-full bg-white border border-borde text-sm">
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
            <tr key={s.codigo} className={'border-t border-borde ' + claseFila(s)}>
              <td className="p-3">
                <Link to={`/encargado/historial/${s.estudianteId}`} className="text-primario underline">{s.estudiante}</Link>
                <p className={'text-xs ' + claseCarrera(s)}>{descripcionEstudiante(s)}</p>
              </td>
              <td className="p-3">{s.equipo}</td>
              <td className="p-3 font-mono">{mostrarFecha(s.inicio)} → {mostrarFecha(s.fin)}</td>
              <td className="p-3 text-gris">{s.motivo}</td>
              <td className="p-3 font-mono">{s.hace}</td>
              <td className="p-3"><Etiqueta estado={s.estado} /></td>
              <td className="p-3">
                {s.estado === 'Enviada' && (
                  <div className="flex gap-2">
                    <button onClick={() => abrirAprobacion(s)} className="bg-primario text-white px-3 py-1 rounded">Aprobar</button>
                    <button onClick={() => { setRechazando(s); setMotivo(''); setMensaje(''); }} className="border border-peligro text-peligro px-3 py-1 rounded">Rechazar</button>
                  </div>
                )}
                {s.estado === 'Aprobada' && <Link to={`/encargado/entrega/${s.codigo}`} className="text-primario">Registrar entrega</Link>}
                {(s.estado === 'Entregada' || s.estado === 'Devuelta') && <Link to={`/encargado/constancia/${s.codigo}`} className="text-primario underline">Ver constancia</Link>}
                {s.estado === 'Rechazada' && <button onClick={() => setMensaje(s.motivoRechazo || 'No cumplía las condiciones del préstamo.')} className="text-primario underline">Ver motivo</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
      {visibles.length === 0 && <p className="bg-white p-6 text-center">No hay solicitudes con esos filtros.</p>}
      <Paginacion pagina={paginaActual} paginas={paginas} onCambiar={setPagina} />

      {/* Modal aprobar */}
      {aprobando && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold">Aprobar solicitud</h2>
            <p className="text-sm text-gris mb-4">{aprobando.estudiante} · {aprobando.equipo} · {mostrarFecha(aprobando.inicio)} → {mostrarFecha(aprobando.fin)}</p>
            <p className="text-xs font-semibold uppercase mb-2">Unidad a asignar</p>
            {disponibles.map((actual) => {
              const u = actual.codigo;
              return (
              <label
                key={u}
                className={'flex gap-2 border rounded px-3 py-2 mb-2 font-mono ' + claseUnidad(u)}
              >
                <input type="radio" checked={unidad === u} onChange={() => setUnidad(u)} /> {u}
              </label>
            ); })}
            {disponibles.length === 0 && <p className="text-peligro">No hay unidades disponibles en ese rango.</p>}
            {tieneDeuda(aprobando) && <p className="text-peligro">El estudiante tiene deuda o bloqueo. <Link to={`/encargado/historial/${aprobando.estudianteId}`} className="underline">Ver historial</Link></p>}
            {equipoAprobando && equipoAprobando.autorizacion && <label className="block my-3"><input type="checkbox" checked={autorizacion} onChange={(e) => setAutorizacion(e.target.checked)} /> Recibí la autorización del docente.</label>}
            {mensaje && <p role="alert" className="text-peligro">{mensaje}</p>}
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
            <select
              aria-label="Motivo del rechazo"
              value={causa}
              onChange={(e) => setCausa(e.target.value)}
              className="w-full border border-borde rounded px-3 py-2 mb-3"
            >
              <option>Penalidad pendiente</option>
              <option>Sin unidades disponibles</option>
              <option>Falta autorización del docente</option>
            </select>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Detalle (lo verá el estudiante)"
              className="w-full border border-borde rounded px-3 py-2 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRechazando(null)} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</button>
              {mensaje && <p role="alert" className="text-peligro">{mensaje}</p>}
              <button onClick={rechazar} className="bg-peligro text-white px-4 py-2 rounded">Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </PanelEncargado>
  );
}
