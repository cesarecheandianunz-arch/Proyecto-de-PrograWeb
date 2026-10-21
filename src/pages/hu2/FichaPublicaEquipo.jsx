import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Pagina from '../../components/Pagina';
import Etiqueta from '../../components/Etiqueta';
import FotoEquipo from '../../components/FotoEquipo';
import { useInventario } from '../../context/InventarioContext';

// La misma ficha se muestra al visitante y al estudiante con distintos enlaces.
export default function FichaPublicaEquipo({ tipo = 'publico' }) {
  const { id } = useParams();
  const { equiposConConteo, unidades, errorPersistencia } = useInventario();
  const [fotoElegida, setFotoElegida] = useState('');
  const equipo = equiposConConteo.find((actual) => actual.id === Number(id));

  if (!equipo) {
    return (
      <Pagina tipo={tipo}>
        <h1 className="text-2xl mb-4">Equipo no encontrado</h1>
        <Link to="/catalogo" className="text-primario hover:underline">
          Volver al catálogo
        </Link>
      </Pagina>
    );
  }

  // Solo mostramos las unidades que pertenecen a este equipo.
  const propias = unidades.filter((unidad) => unidad.equipoId === equipo.id);
  const fotografias = equipo.fotografias || [];
  const accesorios = equipo.accesorios || [];

  let fotoPrincipal = fotografias[0];
  if (fotografias.includes(fotoElegida)) {
    fotoPrincipal = fotoElegida;
  }

  let descripcion = 'Sin descripción registrada.';
  if (equipo.descripcion) {
    descripcion = equipo.descripcion;
  }

  // Algunos equipos iniciales todavía no tienen todas sus condiciones guardadas.
  let duracion = 7;
  if (equipo.duracion !== undefined && equipo.duracion !== null) {
    duracion = equipo.duracion;
  }

  let penalidad = 15;
  if (equipo.penalidad !== undefined && equipo.penalidad !== null) {
    penalidad = equipo.penalidad;
  }

  let autorizacion = true;
  if (equipo.autorizacion !== undefined && equipo.autorizacion !== null) {
    autorizacion = equipo.autorizacion;
  }

  let textoAutorizacion;
  if (autorizacion) {
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

  // Extra: Date obtiene la fecha; toLocaleDateString la presenta en horario de Lima.
  const fechaHoy = new Date().toLocaleDateString('es-PE', {
    timeZone: 'America/Lima',
  });

  let colorDisponibilidad = 'text-exito';
  if (equipo.libres === 0) {
    colorDisponibilidad = 'text-alerta';
  }

  let enlaceSolicitud = '/login';
  let enlaceCatalogo = '/catalogo?vista=publico';
  if (tipo === 'estudiante') {
    enlaceSolicitud = `/catalogo/${id}/solicitar`;
    enlaceCatalogo = '/catalogo';
  }

  return (
    <Pagina tipo={tipo}>
      {errorPersistencia && (
        <p role="alert" className="bg-amber-50 p-3 mb-4">
          {errorPersistencia}
        </p>
      )}

      <p className="text-sm text-gris mb-4">
        <Link to={enlaceCatalogo} className="text-primario hover:underline">
          Catálogo
        </Link>
        {' / '}{equipo.categoria}{' / '}{equipo.nombre}
      </p>

      <div className="grid lg:grid-cols-12 items-start gap-6">
        {/* Columna izquierda: fotografía principal y miniaturas. */}
        <div className="lg:col-span-3">
          <div className="aspect-square bg-gray-100 border border-borde rounded overflow-hidden grid place-items-center">
            <FotoEquipo url={fotoPrincipal} nombre={equipo.nombre} />
          </div>

          {fotografias.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {fotografias.map((url, indice) => {
                let claseFoto = 'w-16 h-16 rounded overflow-hidden grid place-items-center border-2 ';
                if (fotoPrincipal === url) {
                  claseFoto += 'border-primario';
                } else {
                  claseFoto += 'border-borde';
                }

                return (
                  <button
                    key={`${indice}-${url}`}
                    type="button"
                    onClick={() => setFotoElegida(url)}
                    aria-label={`Ver fotografía ${indice + 1}`}
                    aria-pressed={fotoPrincipal === url}
                    className={claseFoto}
                  >
                    <FotoEquipo url={url} nombre={`Fotografía ${indice + 1}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Columna central: datos y condiciones del equipo. */}
        <div className="lg:col-span-6 bg-white border border-borde rounded p-6">
          <h1 className="text-3xl font-semibold">{equipo.nombre}</h1>
          <p className="text-gris mt-1">
            {equipo.marca} · {equipo.modelo} · {equipo.categoria}
          </p>
          <p className="my-4 whitespace-pre-line">{descripcion}</p>

          <h2 className="text-xs font-semibold uppercase text-gris mb-2">
            Accesorios incluidos
          </h2>
          {accesorios.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-4">
              {accesorios.map((accesorio) => (
                <li
                  key={accesorio}
                  className="border border-borde rounded px-2 py-1 text-sm"
                >
                  {accesorio}
                </li>
              ))}
            </ul>
          )}
          {accesorios.length === 0 && (
            <p className="text-sm text-gris mb-4">Sin accesorios registrados.</p>
          )}

          <div className="bg-fondo border border-borde rounded p-4 text-sm">
            <h2 className="font-semibold mb-2">Condiciones del préstamo</h2>
            <p>
              Hasta {duracion} días calendario.{' '}
              {textoAutorizacion}{' '}
              {textoRenovacion}{' '}
              Penalidad de S/ {Number(penalidad).toFixed(2)} por día de retraso.
            </p>
          </div>
        </div>

        {/* Columna derecha: disponibilidad, unidades y acceso a la solicitud. */}
        <div className="lg:col-span-3 bg-white border border-borde rounded p-6">
          <h2 className="text-xs font-semibold uppercase text-gris">
            Disponibilidad actual
          </h2>
          <p className={`text-3xl font-semibold font-mono mt-2 ${colorDisponibilidad}`}>
            {equipo.libres} de {equipo.total}
          </p>
          <p className="text-sm text-gris mb-5">
            unidades libres hoy, {fechaHoy}
          </p>

          {propias.length > 0 && (
            <ul aria-label="Unidades de este equipo" className="space-y-3 mb-5">
              {propias.map((unidad) => (
                <li
                  key={unidad.codigo}
                  className="flex flex-wrap justify-between items-center gap-2"
                >
                  <span className="font-mono text-sm">{unidad.codigo}</span>
                  <Etiqueta estado={unidad.estado} />
                </li>
              ))}
            </ul>
          )}
          {propias.length === 0 && (
            <p className="text-sm text-gris mb-4">
              Este equipo aún no tiene unidades registradas.
            </p>
          )}

          {equipo.libres > 0 && (
            <>
              <Link
                to={enlaceSolicitud}
                className="block text-center bg-primario text-white px-3 py-2 rounded min-h-10"
              >
                Solicitar préstamo
              </Link>
              {tipo === 'publico' && (
                <p className="text-sm text-gris text-center mt-2">
                  Necesitas iniciar sesión para solicitar.
                </p>
              )}
            </>
          )}
          {equipo.libres === 0 && (
            <p className="text-alerta">No hay unidades disponibles actualmente.</p>
          )}

          <p className="text-sm text-gris border-t border-borde pt-4 mt-4">
            Recojo en Almacén H-102, lunes a viernes de 08:00 a 19:00.
          </p>
        </div>
      </div>
    </Pagina>
  );
}
