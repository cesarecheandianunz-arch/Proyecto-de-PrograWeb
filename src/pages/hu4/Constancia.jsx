import PanelEncargado from '../../components/PanelEncargado';
import Pagina from '../../components/Pagina';
import { Link, useParams, useLocation } from 'react-router-dom';
import { usePrestamos } from '../../context/PrestamosContext';
import { useCuenta } from '../../context/CuentaContext';
import { mostrarFecha } from '../../utils/prestamos';

export default function Constancia({ tipo = 'encargado' }) {
  const { codigo } = useParams();
  const { prestamos } = usePrestamos();
  const { estudiante } = useCuenta();
  const location = useLocation();
  let prestamo = prestamos.find((p) => p.codigo === codigo);
  let Contenedor = PanelEncargado;
  let volver = '/encargado/solicitudes';
  if (tipo === 'estudiante') {
    Contenedor = Pagina;
    volver = '/mis-solicitudes';
    if (prestamo && prestamo.estudianteId !== estudiante.id) prestamo = undefined;
  }
  if (!prestamo) return <Contenedor tipo={tipo}><h1 className="text-2xl my-4">Selecciona un préstamo con entrega registrada</h1><Link to={volver} className="text-primario underline">Volver al listado</Link></Contenedor>;

  return (
    <Contenedor tipo={tipo}>
      <Link to={volver} className="text-primario underline print-hidden">← Volver al listado</Link>
      {location.state?.mensaje && <p role="status" className="bg-primario-suave p-3 my-4 print-hidden">{location.state.mensaje}</p>}
      <div className="print-hidden flex flex-wrap gap-3 justify-between items-center max-w-3xl mb-4">
        <h1 className="text-3xl font-semibold">Constancia de entrega</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="border border-primario text-primario px-4 py-2 rounded">Guardar como PDF</button>
          <button onClick={() => window.print()} className="bg-primario text-white px-4 py-2 rounded">Imprimir</button>
        </div>
      </div>

      <p className="text-sm text-gris mb-4 print-hidden">Para descargar: pulsa «Guardar como PDF» y elige esa opción en la ventana de impresión del navegador.</p>
      <div className="constancia-impresa max-w-3xl bg-white border border-borde rounded p-8">
        <div className="flex justify-between border-b-2 border-primario pb-4 mb-6">
          <div>
            <p className="text-xs uppercase text-gris">Universidad de Lima · Facultad de Ingeniería</p>
            <h2 className="text-2xl font-semibold text-primario">Constancia de entrega de equipo</h2>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-gris">Código de préstamo</p>
            <p className="font-mono font-semibold text-lg">{prestamo.codigo}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm mb-6">
          <div><p className="text-xs uppercase text-gris">Estudiante</p>{prestamo.estudiante}<p className="text-gris">Identificador: {prestamo.estudianteId}</p></div>
          <div><p className="text-xs uppercase text-gris">Curso asociado</p>{prestamo.curso}</div>
          <div><p className="text-xs uppercase text-gris">Equipo y unidad</p>{prestamo.equipo}<p className="text-gris font-mono">{prestamo.unidad} · Almacén H-102</p></div>
          <div><p className="text-xs uppercase text-gris">Fechas</p>Entrega: <span className="font-mono">{mostrarFecha(prestamo.fechaEntrega)} {prestamo.fechaEntrega.slice(11)}</span><br />Devolución: <span className="font-mono">{mostrarFecha(prestamo.fin)} 19:00</span></div>
        </div>

        <table className="w-full border border-borde text-sm mb-6">
          <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
            <tr><th className="p-2">Accesorio</th><th className="p-2">Entregado</th></tr>
          </thead>
          <tbody>
            {prestamo.accesorios.map((accesorio) => {
              let texto = 'No';
              if (accesorio.entregado) texto = 'Sí';
              return <tr key={accesorio.nombre} className="border-t border-borde"><td className="p-2">{accesorio.nombre}</td><td className="p-2">{texto}</td></tr>;
            })}
            {prestamo.accesorios.length === 0 && <tr><td colSpan={2} className="p-2">Sin accesorios registrados.</td></tr>}
          </tbody>
        </table>

        <p className="text-sm mb-4"><b>Estado inicial:</b> {prestamo.observaciones || 'Sin observaciones.'}</p>
        <p className="text-sm">Declaro recibir el equipo en las condiciones descritas y me comprometo a devolverlo en la fecha pactada.</p>
        <div className="grid grid-cols-2 gap-12 mt-12 text-sm text-gris">
          <div className="border-t border-texto pt-1">Firma del estudiante</div>
          <div className="border-t border-texto pt-1">Firma del encargado de almacén</div>
        </div>
      </div>
    </Contenedor>
  );
}
