import { Link } from 'react-router-dom';

// Estructura del panel del encargado: cabecera + menú lateral + contenido
export default function PanelEncargado({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-borde h-16 px-6 flex items-center gap-6">
        <Link to="/encargado/inventario" className="flex items-center gap-2 font-semibold text-primario">
          <span className="w-5 h-5 rounded bg-primario"></span>
          Almacén de Equipos
        </Link>
        <span className="text-xs font-semibold uppercase border border-acento text-alerta bg-amber-50 px-2 py-1 rounded">
          Panel del encargado
        </span>
        <input
          className="flex-1 max-w-md border border-borde rounded px-3 py-2 text-sm font-mono bg-fondo"
          placeholder="Buscar por código de inventario: INV-OSC-0042"
        />
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="bg-primario-suave px-3 py-1 rounded">
            Solicitudes pendientes <b className="bg-primario text-white px-2 rounded ml-1">3</b>
          </span>
          <span className="text-gris">Elena Rivas · H-102</span>
          <span className="w-8 h-8 rounded bg-primario text-white grid place-items-center text-xs">ER</span>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-60 bg-white border-r border-borde p-4 text-sm">
          <p className="text-xs font-semibold text-gris uppercase mb-2">Operación</p>
          <Link to="/encargado/inventario" className="block px-3 py-2 rounded hover:bg-primario-suave">Inventario</Link>
          <Link to="/encargado/solicitudes" className="block px-3 py-2 rounded hover:bg-primario-suave">Solicitudes</Link>
          <Link to="/encargado/prestamos" className="block px-3 py-2 rounded hover:bg-primario-suave">Préstamos vigentes</Link>
          <Link to="/encargado/devolucion" className="block px-3 py-2 rounded hover:bg-primario-suave">Devoluciones</Link>
          <Link to="/encargado/historial" className="block px-3 py-2 rounded hover:bg-primario-suave">Historial de estudiante</Link>
          <hr className="my-4 border-borde" />
          <Link to="/" className="block px-3 py-2 rounded text-gris hover:bg-primario-suave">Cerrar sesión</Link>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>

      <footer className="bg-[#13201f] text-gray-300 text-sm px-6 py-4">
        Almacén de Equipos · Panel del encargado · Almacén H-102
      </footer>
    </div>
  );
}
