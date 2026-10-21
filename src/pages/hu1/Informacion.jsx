import { Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import PanelEncargado from '../../components/PanelEncargado';

export default function Informacion({ manual = false, reglamento = false }) {
  let Contenedor = Pagina;
  let titulo = 'Ayuda';
  if (manual) { Contenedor = PanelEncargado; titulo = 'Manual del encargado'; }
  if (reglamento) titulo = 'Reglamento de préstamo';
  return (
    <Contenedor>
      <article className="bg-white border border-borde rounded p-6 space-y-4">
        <h1 className="text-3xl font-semibold">{titulo}</h1>
        {!manual && <>
          <p>Consulta el catálogo y las condiciones de cada equipo antes de solicitarlo. Elige las fechas, indica el curso y explica el motivo del préstamo.</p>
          <p>El recojo y la devolución se realizan en Almacén H-102, de lunes a viernes de 08:00 a 19:00. Verifica los accesorios al recibir y devolver el equipo.</p>
          <p>La duración, autorización del docente, renovación y penalidad diaria dependen del equipo. Las penalidades pendientes deben regularizarse antes de solicitar otro préstamo.</p>
          <Link to="/catalogo?vista=publico" className="inline-block text-primario underline">Consultar catálogo y condiciones</Link>
        </>}
        {manual && <ol className="list-decimal pl-6 space-y-3">
          <li><Link to="/encargado/inventario" className="text-primario underline">Inventario:</Link> registra equipos, unidades y condiciones.</li>
          <li><Link to="/encargado/solicitudes" className="text-primario underline">Solicitudes:</Link> revisa las fechas y la deuda, confirma la autorización cuando corresponda y asigna una unidad o registra el motivo del rechazo.</li>
          <li><Link to="/encargado/prestamos" className="text-primario underline">Préstamos:</Link> consulta vencimientos, renovaciones y devoluciones.</li>
          <li><Link to="/encargado/historial" className="text-primario underline">Historial:</Link> consulta deudas y registra pagos.</li>
        </ol>}
        <p>Contacto: almacen.equipos@ulima.edu.pe · Anexo 3120.</p>
      </article>
    </Contenedor>
  );
}
