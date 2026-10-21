import { Link, useParams } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import { usePrestamos } from '../../context/PrestamosContext';
import { useCuenta } from '../../context/CuentaContext';
import { mostrarFecha } from '../../utils/prestamos';
import Etiqueta from '../../components/Etiqueta';

export default function DetalleSolicitud() {
  const { codigo } = useParams();
  const { solicitudes, prestamos } = usePrestamos();
  const { estudiante } = useCuenta();
  const solicitud = solicitudes.find((s) => s.codigo === codigo && s.estudianteId === estudiante.id);
  const prestamo = prestamos.find((p) => p.codigo === codigo);
  return (
    <Pagina tipo="estudiante">
      <Link to="/mis-solicitudes" className="text-primario underline">← Mis solicitudes</Link>
      {!solicitud && <h1 className="text-2xl my-6">Solicitud no encontrada para este estudiante</h1>}
      {solicitud && <article className="bg-white border border-borde rounded p-6 mt-4 space-y-3">
        <h1 className="text-2xl font-semibold">Solicitud {solicitud.codigo}</h1>
        <Etiqueta estado={solicitud.estado} />
        <p><b>Equipo:</b> {solicitud.equipo}</p>
        <p><b>Curso:</b> {solicitud.curso}</p>
        <p><b>Fechas:</b> {mostrarFecha(solicitud.inicio)} → {mostrarFecha(solicitud.fin)}</p>
        <p><b>Unidad:</b> {solicitud.unidad}</p>
        <p><b>Motivo:</b> {solicitud.motivo}</p>
        {solicitud.estado === 'Rechazada' && <p className="bg-red-50 p-3"><b>Motivo del rechazo:</b> {solicitud.motivoRechazo || 'No cumplía las condiciones del préstamo.'}</p>}
        {prestamo && <Link className="inline-block text-primario underline" to={`/mis-solicitudes/${codigo}/constancia`}>Ver constancia de entrega</Link>}
        {prestamo && prestamo.devolucion && <p>Devuelto el {mostrarFecha(prestamo.devolucion.fecha)}. Penalidad: S/ {prestamo.devolucion.penalidad.toFixed(2)}.</p>}
      </article>}
    </Pagina>
  );
}
