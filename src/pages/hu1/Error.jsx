import { Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';

// Sirve para el 403 y el 404
export default function Error({ codigo }) {
  const es403 = codigo === 403;
  return (
    <Pagina tipo="publico">
      <div className="text-center py-20">
        <p className="text-4xl font-semibold text-gris">{es403 ? '!' : '?'}</p>
        <p className="font-mono text-sm text-gris mt-2">
          ERROR {codigo} · {es403 ? 'ACCESO DENEGADO' : 'PÁGINA NO ENCONTRADA'}
        </p>
        <h1 className="text-3xl font-semibold mt-2">
          {es403 ? 'No tienes permiso para ver esta página' : 'No encontramos esta página'}
        </h1>
        <div className="flex justify-center gap-2 mt-6">
          <Link to="/" className="bg-primario text-white px-4 py-2 rounded">Ir al inicio</Link>
          <Link to="/catalogo" className="border border-primario text-primario px-4 py-2 rounded">Buscar un equipo</Link>
        </div>
      </div>
    </Pagina>
  );
}
