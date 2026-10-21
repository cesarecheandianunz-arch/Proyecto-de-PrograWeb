import { Link } from 'react-router-dom';
import { useCuenta } from '../context/CuentaContext';

// tipo = "publico" (visitante) o "estudiante"
export default function Navbar({ tipo = 'publico' }) {
  const { estudiante } = useCuenta();
  return (
    <header className="bg-white border-b border-borde">
      <div className="max-w-6xl mx-auto px-4 py-3 min-h-16 flex flex-wrap items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primario">
          <span className="w-5 h-5 rounded bg-primario"></span>
          Almacén de Equipos
        </Link>

        {tipo === 'publico' && (
          <nav className="flex flex-wrap gap-4 text-sm text-gris">
            <Link to="/">Inicio</Link>
            <Link to="/catalogo?vista=publico">Catálogo</Link>
            <Link to="/reglamento">Reglas del préstamo</Link>
            <Link to="/ayuda">Ayuda</Link>
            <Link to="/catalogo">Vista del estudiante</Link>
            <Link to="/encargado/inventario">Vista del encargado</Link>
          </nav>
        )}
        {tipo === 'estudiante' && (
          <nav className="flex flex-wrap gap-6 text-sm text-gris">
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/mis-solicitudes">Mis solicitudes</Link>
            <Link to="/encargado/inventario">Vista del encargado</Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">
          {tipo === 'publico' && (
            <>
              <Link to="/login" className="border border-primario text-primario px-4 py-2 rounded text-sm">Iniciar sesión</Link>
              <Link to="/registro" className="bg-primario text-white px-4 py-2 rounded text-sm">Crear cuenta</Link>
            </>
          )}
          {tipo === 'estudiante' && (
            <>
            <Link to="/mi-cuenta" className="flex items-center gap-2 text-sm text-gris">
              {estudiante.nombre}
              <span className="w-8 h-8 rounded bg-primario text-white grid place-items-center text-xs">{estudiante.nombre.slice(0, 2).toUpperCase()}</span>
            </Link>
            <Link to="/" className="text-sm text-primario underline">Cerrar sesión</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
