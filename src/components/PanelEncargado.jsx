import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInventario } from '../context/InventarioContext';
import { usePrestamos } from '../context/PrestamosContext';
import { hoyISO, mostrarFecha } from '../utils/prestamos';

// Estructura del panel del encargado: cabecera + menú lateral + contenido
export default function PanelEncargado({ children }) {
  const { errorPersistencia, unidades } = useInventario();
  const { solicitudes, prestamos, errorPersistencia: errorOperaciones } = usePrestamos();
  const pendientes = solicitudes.filter((s) => s.estado === 'Enviada').length;
  const activos = prestamos.filter((p) => p.estado === 'Activo');
  const vencidos = activos.filter((p) => p.fin < hoyISO()).length;
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  function buscarInventario(evento) {
    evento.preventDefault();
    if (busqueda.trim() === '') {
      navigate('/encargado/inventario', { state: { busquedaInventario: true } });
    } else {
      // encodeURIComponent conserva espacios y otros caracteres dentro de la URL.
      navigate('/encargado/inventario?codigo=' + encodeURIComponent(busqueda.trim()), {
        state: { busquedaInventario: true },
      });
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-borde min-h-16 p-4 flex flex-wrap items-center gap-4">
        <Link to="/encargado/inventario" className="flex items-center gap-2 font-semibold text-primario">
          <span className="w-5 h-5 rounded bg-primario"></span>
          Almacén de Equipos
        </Link>
        <span className="text-xs font-semibold uppercase border border-acento text-alerta bg-amber-50 px-2 py-1 rounded">
          Panel del encargado
        </span>
        <form onSubmit={buscarInventario} role="search" className="flex flex-1 gap-2 min-w-0 max-w-md">
          <input
            aria-label="Buscar en el inventario"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            className="flex-1 min-w-0 border border-borde rounded px-3 py-2 text-sm font-mono bg-fondo"
            placeholder="Código, nombre o modelo"
          />
          <button type="submit" className="border border-primario text-primario rounded px-3 py-2 text-sm">
            Buscar
          </button>
        </form>
        <div className="ml-auto flex flex-wrap items-center gap-4 text-sm">
          <Link to="/encargado/solicitudes" className="bg-primario-suave px-3 py-1 rounded">
            Solicitudes pendientes <b className="bg-primario text-white px-2 rounded ml-1">{pendientes}</b>
          </Link>
          <span className="text-gris">Elena Rivas · H-102</span>
          <span className="w-8 h-8 rounded bg-primario text-white grid place-items-center text-xs">ER</span>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1">
        <aside className="w-44 lg:w-60 shrink-0 bg-white border-r border-borde p-4 text-sm max-md:w-full">
          <p className="text-xs font-semibold text-gris uppercase mb-2">Operación</p>
          <Link to="/encargado/inventario" className="block px-3 py-2 rounded hover:bg-primario-suave">Inventario <b className="float-right">{unidades.length}</b></Link>
          <Link to="/encargado/solicitudes" className="block px-3 py-2 rounded hover:bg-primario-suave">Solicitudes <b className="float-right">{pendientes}</b></Link>
          <Link to="/encargado/prestamos" className="block px-3 py-2 rounded hover:bg-primario-suave">Préstamos vigentes <b className="float-right">{activos.length}</b></Link>
          <Link to="/encargado/prestamos?estado=vencidos" className="block px-3 py-2 rounded hover:bg-primario-suave">Vencidos <b className="float-right text-peligro">{vencidos}</b></Link>
          <Link to="/encargado/devolucion" className="block px-3 py-2 rounded hover:bg-primario-suave">Devoluciones</Link>
          <Link to="/encargado/historial" className="block px-3 py-2 rounded hover:bg-primario-suave">Historial de estudiante</Link>
          <hr className="my-4 border-borde" />
          <Link to="/catalogo" className="block px-3 py-2 rounded text-primario hover:bg-primario-suave">Vista del estudiante</Link>
          <Link to="/" className="block px-3 py-2 rounded text-gris hover:bg-primario-suave">Cerrar sesión</Link>
        </aside>
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {errorPersistencia && <p role="alert" className="bg-amber-50 text-alerta p-3 mb-4">{errorPersistencia}</p>}
          {errorOperaciones && <p role="alert" className="bg-amber-50 text-alerta p-3 mb-4">{errorOperaciones}</p>}
          {children}
        </main>
      </div>

      <footer className="bg-[#13201f] text-gray-300 text-sm px-6 py-4">
        Almacén de Equipos · Panel del encargado · Almacén H-102
        <div className="flex flex-wrap gap-4 mt-2">
          <Link to="/encargado/ayuda" className="underline">Manual del encargado</Link>
          <span>Soporte: sistemas@ulima.edu.pe</span>
          <span>Fecha de consulta: {mostrarFecha(hoyISO())}</span>
        </div>
      </footer>
    </div>
  );
}
