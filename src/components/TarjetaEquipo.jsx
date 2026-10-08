import { Link } from 'react-router-dom';

export default function TarjetaEquipo({ equipo }) {
  return (
    <Link to={'/catalogo/' + equipo.id} className="bg-white border border-borde rounded overflow-hidden hover:border-primario">
      <div className="aspect-square bg-gray-100 grid place-items-center text-xs text-gris font-mono">foto 1:1</div>
      <div className="p-4">
        <p className="font-semibold">{equipo.nombre}</p>
        <p className="text-sm text-gris">{equipo.marca} · {equipo.modelo}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs font-semibold uppercase bg-primario-suave text-primario-oscuro px-2 py-1 rounded">{equipo.categoria}</span>
          <span className={'font-mono text-sm ' + (equipo.libres === 0 ? 'text-alerta' : 'text-exito')}>
            {equipo.libres} / {equipo.total} libres
          </span>
        </div>
      </div>
    </Link>
  );
}
