import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Pagina from '../../components/Pagina';
import Etiqueta from '../../components/Etiqueta';
import FotoEquipo from '../../components/FotoEquipo';
import { useInventario } from '../../context/InventarioContext';

export default function FichaPublicaEquipo({ tipo = 'publico' }) {
  const { id } = useParams();
  const { equiposConConteo, unidades, errorPersistencia } = useInventario();
  const [fotoElegida, setFotoElegida] = useState(0);
  const equipo = equiposConConteo.find((actual) => actual.id === Number(id));
  if (!equipo) return <Pagina tipo={tipo}><h1 className="text-2xl mb-4">Equipo no encontrado</h1><Link to="/catalogo">Volver al catálogo</Link></Pagina>;
  const propias = unidades.filter((unidad) => unidad.equipoId === equipo.id);
  const fotografias = equipo.fotografias || [];
  const principal = fotografias[fotoElegida] || fotografias[0];
  const accesorios = equipo.accesorios || [];

  let textoAutorizacion;
  if (equipo.autorizacion ?? true) {
    textoAutorizacion = 'Requiere autorización del docente.';
  } else {
    textoAutorizacion = 'No requiere autorización adicional.';
  }

  let textoRenovacion;
  if (equipo.renovacion) {
    textoRenovacion = 'Admite renovación.';
  } else {
    textoRenovacion = 'No admite renovación.';
  }

  let enlaceSolicitud;
  let textoSolicitud;
  if (tipo === 'publico') {
    enlaceSolicitud = '/login';
    textoSolicitud = 'Iniciar sesión para solicitar';
  } else {
    enlaceSolicitud = `/catalogo/${id}/solicitar`;
    textoSolicitud = 'Solicitar préstamo';
  }

  return (
    <Pagina tipo={tipo}>
      {errorPersistencia && <p role="alert" className="bg-amber-50 p-3 mb-4">{errorPersistencia}</p>}
      <p className="text-sm text-gris mb-4"><Link to="/catalogo" className="text-primario hover:underline">Catálogo</Link> / {equipo.categoria} / {equipo.nombre}</p>
      <div className="grid lg:grid-cols-3 gap-6">
        <div>
          <div className="aspect-square bg-gray-100 border border-borde rounded overflow-hidden grid place-items-center"><FotoEquipo url={principal} nombre={equipo.nombre} /></div>
          {fotografias.length > 1 && <div className="flex flex-wrap gap-2 mt-3">{fotografias.map((url, indice) => <button key={`${indice}-${url}`} onClick={() => setFotoElegida(indice)} aria-label={`Ver fotografía ${indice + 1}`} aria-pressed={principal === url} className="w-16 h-16 border border-borde rounded overflow-hidden grid place-items-center"><FotoEquipo url={url} nombre={`Fotografía ${indice + 1}`} /></button>)}</div>}
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{equipo.nombre}</h1>
          <p className="text-gris">{equipo.marca} · {equipo.modelo} · {equipo.categoria}</p>
          <p className="my-4 whitespace-pre-line">{equipo.descripcion || 'Sin descripción registrada.'}</p>
          <h2 className="text-xs font-semibold uppercase text-gris mb-2">Accesorios incluidos</h2>
          {accesorios.length > 0 && <ul className="flex flex-wrap gap-2 mb-4">{accesorios.map((accesorio) => <li key={accesorio} className="border border-borde rounded px-2 py-1 text-sm">{accesorio}</li>)}</ul>}
          {accesorios.length === 0 && <p className="text-sm text-gris mb-4">Sin accesorios registrados.</p>}
          <div className="bg-primario-suave rounded p-4 text-sm mb-4">
            <h2 className="font-semibold">Condiciones del préstamo</h2>
            <p>Hasta {equipo.duracion ?? 7} días calendario. {textoAutorizacion} {textoRenovacion} Penalidad de S/ {Number(equipo.penalidad ?? 15).toFixed(2)} por día de retraso.</p>
          </div>
          <h2 className="text-xs font-semibold uppercase text-gris mb-2">Unidades de este equipo</h2>
          {propias.length > 0 && <ul className="space-y-3">{propias.map((unidad) => <li key={unidad.codigo} className="flex flex-wrap items-center gap-2"><span className="font-mono text-sm">{unidad.codigo}</span><Etiqueta estado={unidad.estado} /></li>)}</ul>}
          {propias.length === 0 && <p className="text-sm text-gris">Este equipo aún no tiene unidades registradas.</p>}
        </div>
        <div className="bg-white border border-borde rounded p-6 h-fit">
          <h2 className="text-xs font-semibold uppercase text-gris">Disponibilidad actual</h2>
          <p className="text-3xl font-semibold"><span className="text-exito">{equipo.libres}</span> de {equipo.total}</p>
          <p className="text-sm text-gris mb-4">unidades libres hoy</p>
          {equipo.libres > 0 && <>
            <Link to={enlaceSolicitud} className="block text-center bg-primario text-white py-2 rounded">{textoSolicitud}</Link>
            {tipo === 'publico' && <p className="text-sm text-gris mt-2">Necesitas una cuenta de estudiante para solicitar un préstamo.</p>}
          </>}
          {equipo.libres === 0 && <p className="text-alerta">No hay unidades disponibles actualmente.</p>}
          <p className="text-sm text-gris mt-4">Recojo en Almacén H-102 · lunes a viernes de 08:00 a 19:00.</p>
        </div>
      </div>
    </Pagina>
  );
}
