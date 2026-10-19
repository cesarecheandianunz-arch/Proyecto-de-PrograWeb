import { Link } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext';
import { usePrestamos } from '../context/PrestamosContext';

// Estructura del panel del encargado: cabecera + menú lateral + contenido
export default function PanelEncargado({ children }) {
  const { errorPersistencia, unidades } = useInventario();
  const { solicitudes, prestamos, restablecer } = usePrestamos();
  const pendientes = solicitudes.filter((s) => s.estado === 'Enviada').length;
  const vencidos = prestamos.filter((x) => x.dias < 0).length;
  return (
    <div className="min-h-screen flex flex-col">
      <header className="print:hidden bg-white border-b border-borde min-h-16 p-4 flex flex-wrap items-center gap-4">
        <Link to="/encargado/inventario" className="flex items-center gap-2 font-semibold text-primario">
          <span className="w-5 h-5 rounded bg-primario"></span>
          Almacén de Equipos
        </Link>
        <span className="text-xs font-semibold uppercase border border-acento text-alerta bg-amber-50 px-2 py-1 rounded">
          Panel del encargado
        </span>
        <input
          className="flex-1 min-w-0 max-w-md border border-borde rounded px-3 py-2 text-sm font-mono bg-fondo"
          placeholder="Buscar por código de inventario: INV-OSC-0042"
        />
        <div className="ml-auto flex flex-wrap items-center gap-4 text-sm">
          <span className="bg-primario-suave px-3 py-1 rounded">
            Solicitudes pendientes <b className="bg-primario text-white px-2 rounded ml-1">{pendientes}</b>
          </span>
          <span className="text-gris">Elena Rivas · H-102</span>
          <span className="w-8 h-8 rounded bg-primario text-white grid place-items-center text-xs">ER</span>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        <aside className="print:hidden w-44 lg:w-60 shrink-0 bg-white border-r border-borde p-4 text-sm max-md:w-full">
          <p className="text-xs font-semibold text-gris uppercase mb-2">Operación</p>
          <Link to="/encargado/inventario" className="block px-3 py-2 rounded hover:bg-primario-suave">Inventario <b className="font-mono text-gris">{unidades.length}</b></Link>
          <Link to="/encargado/solicitudes" className="block px-3 py-2 rounded hover:bg-primario-suave">Solicitudes <b className="font-mono text-gris">{pendientes}</b></Link>
          <Link to="/encargado/prestamos" className="block px-3 py-2 rounded hover:bg-primario-suave">Préstamos vigentes <b className="font-mono text-gris">{prestamos.length}</b></Link>
          <Link to="/encargado/prestamos" className="block px-3 py-2 rounded hover:bg-primario-suave">Vencidos <b className="font-mono text-peligro">{vencidos}</b></Link>
          <Link to="/encargado/devolucion" className="block px-3 py-2 rounded hover:bg-primario-suave">Devoluciones</Link>
          <Link to="/encargado/historial" className="block px-3 py-2 rounded hover:bg-primario-suave">Historial de estudiante</Link>
          <hr className="my-4 border-borde" />
          <Link to="/" className="block px-3 py-2 rounded text-gris hover:bg-primario-suave">Cerrar sesión</Link>
        </aside>
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {errorPersistencia && <p role="alert" className="bg-amber-50 text-alerta p-3 mb-4">{errorPersistencia}</p>}
          {children}
        </main>
      </div>

      <footer className="print:hidden bg-[#13201f] text-gray-300 text-sm px-6 py-4">
        <p>Almacén de Equipos · Panel del encargado · Almacén H-102</p>
        <p>
          Manual del encargado · Soporte: sistemas@ulima.edu.pe · Última sincronización: 14/09/2026 08:05 ·{' '}
          <button type="button" onClick={restablecer} className="underline">Restablecer datos de prueba</button>
        </p>
      </footer>
    </div>
  );
}
