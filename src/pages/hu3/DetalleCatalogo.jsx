import { useParams, Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import Etiqueta from '../../components/Etiqueta';
import { equipos, unidades } from '../../datos';

export default function DetalleCatalogo() {
  const { id } = useParams();
  const equipo = equipos.find((e) => e.id === Number(id));

  if (!equipo) {
    return <Pagina tipo="estudiante"><p>Equipo no encontrado.</p></Pagina>;
  }

  return (
    <Pagina tipo="estudiante">
      <p className="text-sm text-gris mb-4">Catálogo / {equipo.categoria} / {equipo.nombre}</p>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="aspect-square bg-gray-100 border border-borde rounded grid place-items-center text-sm text-gris font-mono">
          fotografía principal 1:1
        </div>

        <div>
          <h1 className="text-3xl font-semibold">{equipo.nombre}</h1>
          <p className="text-gris">{equipo.marca} · {equipo.modelo} · {equipo.categoria}</p>
          <p className="my-4">Equipo disponible para las prácticas de laboratorio de la facultad.</p>
          <p className="text-xs font-semibold uppercase text-gris mb-2">Accesorios incluidos</p>
          <div className="flex gap-2 flex-wrap mb-4">
            <span className="border border-borde rounded px-2 py-1 text-sm">Estuche rígido</span>
            <span className="border border-borde rounded px-2 py-1 text-sm">Cable USB</span>
          </div>
          <div className="bg-primario-suave rounded p-4 text-sm mb-4">
            <b>Condiciones del préstamo</b>
            <p>Hasta {equipo.duracion} días calendario · penalidad de S/ 15.00 por día de retraso.</p>
          </div>
          <p className="text-xs font-semibold uppercase text-gris mb-2">Unidades de este equipo</p>
          <div className="flex gap-2 flex-wrap">
            {unidades.map((u) => (
              <span key={u.codigo} className="flex items-center gap-2 border border-borde rounded px-2 py-1 bg-white">
                <span className="font-mono text-sm">{u.codigo}</span> <Etiqueta estado={u.estado} />
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-borde rounded p-6 h-fit">
          <p className="text-xs font-semibold uppercase text-gris">Disponibilidad</p>
          <p className="text-3xl font-semibold"><span className="text-exito">{equipo.libres}</span> de {equipo.total}</p>
          <p className="text-sm text-gris mb-4">unidades libres hoy</p>
          <Link to={'/catalogo/' + equipo.id + '/solicitar'} className="block text-center bg-primario text-white py-2 rounded">Solicitar préstamo</Link>
          <p className="text-sm text-gris mt-4">Recojo en Almacén H-102 · lunes a viernes de 08:00 a 19:00.</p>
        </div>
      </div>
    </Pagina>
  );
}
