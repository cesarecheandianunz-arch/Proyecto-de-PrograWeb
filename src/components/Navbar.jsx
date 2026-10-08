import { Link } from 'react-router-dom';

// tipo = "publico" (visitante) o "estudiante"
export default function Navbar({ tipo = 'publico' }) {
  return (
    <header className="bg-white border-b border-borde">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primario">
          <span className="w-5 h-5 rounded bg-primario"></span>
          Almacén de Equipos
        </Link>

        {tipo === 'publico' ? (
          <nav className="flex gap-6 text-sm text-gris">
            <Link to="/">Inicio</Link>
            <Link to="/catalogo">Catálogo</Link>
          </nav>
        ) : (
          <nav className="flex gap-6 text-sm text-gris">
            <Link to="/catalogo">Catálogo</Link>
            <Link to="/mis-solicitudes">Mis solicitudes</Link>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">
          {tipo === 'publico' ? (
            <>
              <Link to="/login" className="border border-primario text-primario px-4 py-2 rounded text-sm">Iniciar sesión</Link>
              <Link to="/registro" className="bg-primario text-white px-4 py-2 rounded text-sm">Crear cuenta</Link>
            </>
          ) : (
            <Link to="/mi-cuenta" className="flex items-center gap-2 text-sm text-gris">
              Renzo Mendoza
              <span className="w-8 h-8 rounded bg-primario text-white grid place-items-center text-xs">RM</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
