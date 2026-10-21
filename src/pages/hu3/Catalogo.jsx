import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import FotoEquipo from '../../components/FotoEquipo';
import { categorias } from '../../datos';
import { useInventario } from '../../context/InventarioContext';
import Paginacion from '../../components/Paginacion';

export default function Catalogo() {
  const { equiposConConteo, unidades } = useInventario();
  const [parametros] = useSearchParams();
  const [busqueda, setBusqueda] = useState(parametros.get('buscar') || '');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [duracion, setDuracion] = useState('');
  const [orden, setOrden] = useState('nombre');
  const [pagina, setPagina] = useState(1);
  useEffect(() => {
    setBusqueda(parametros.get('buscar') || '');
    setCategoriaSeleccionada('');
    setDisponibilidad('');
    setDuracion('');
    setPagina(1);
  }, [parametros]);
  let tipo = 'estudiante';
  if (parametros.get('vista') === 'publico') tipo = 'publico';

  // El catálogo consulta los equipos de HU-2 que tienen alguna unidad activa.
  let lista = equiposConConteo.filter((equipo) => {
    const activas = unidades.filter((unidad) => {
      return unidad.equipoId === equipo.id && unidad.estado !== 'Dada de baja';
    });
    return activas.length > 0;
  });

  if (categoriaSeleccionada !== '') {
    lista = lista.filter((equipo) => equipo.categoria === categoriaSeleccionada);
  }

  if (busqueda.trim() !== '') {
    const texto = busqueda.trim().toLowerCase();
    lista = lista.filter((equipo) => {
      const coincideNombre = equipo.nombre.toLowerCase().includes(texto);
      const coincideModelo = equipo.modelo.toLowerCase().includes(texto);
      const coincideCategoria = equipo.categoria.toLowerCase().includes(texto);
      const coincideMarca = equipo.marca.toLowerCase().includes(texto);
      const codigos = unidades.filter((unidad) => {
        return unidad.equipoId === equipo.id && unidad.codigo.toLowerCase().includes(texto);
      });
      return coincideNombre || coincideModelo || coincideCategoria || coincideMarca || codigos.length > 0;
    });
  }

  if (disponibilidad === 'libres') lista = lista.filter((e) => e.libres > 0);
  if (duracion !== '') lista = lista.filter((e) => e.duracion <= Number(duracion));
  // sort modifica su lista: copiamos primero para no ordenar el Context.
  lista = [...lista];
  lista.sort((primero, segundo) => {
    if (orden === 'disponibles') return segundo.libres - primero.libres;
    if (orden === 'categoria') return primero.categoria.localeCompare(segundo.categoria, 'es');
    return primero.nombre.localeCompare(segundo.nombre, 'es');
  });
  const paginas = Math.max(1, Math.ceil(lista.length / 8));
  const paginaActual = Math.min(pagina, paginas);
  const inicio = (paginaActual - 1) * 8;
  const visibles = lista.slice(inicio, inicio + 8);
  function enlaceDetalle(id) {
    if (tipo === 'publico') return `/equipos/${id}`;
    return `/catalogo/${id}`;
  }
  function enlaceSolicitud(id) {
    if (tipo === 'publico') return '/login';
    return `/catalogo/${id}/solicitar`;
  }

  return (
    <Pagina tipo={tipo}>
      <h1 className="text-3xl font-semibold">Catálogo de equipos</h1>
      <p className="text-sm text-gris mt-1 mb-6">
        Consulta el detalle de un equipo y sus condiciones antes de solicitarlo.
      </p>

      <div className="grid lg:grid-cols-[230px_1fr] gap-6 items-start">
      <aside className="bg-white border border-borde rounded p-4">
        <h2 className="font-semibold text-primario mb-4">Filtros</h2>
      <div className="grid gap-3">
        <input
          aria-label="Buscar equipo o código"
          value={busqueda}
          onChange={(evento) => { setBusqueda(evento.target.value); setPagina(1); }}
          placeholder="Nombre, modelo o código de inventario"
          className="flex-1 min-w-0 border border-borde rounded px-3 py-2 bg-white"
        />
        <select
          aria-label="Categoría"
          value={categoriaSeleccionada}
          onChange={(evento) => { setCategoriaSeleccionada(evento.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2 bg-white"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria}>{categoria}</option>
          ))}
        </select>
        <select
          aria-label="Disponibilidad"
          value={disponibilidad}
          onChange={(e) => { setDisponibilidad(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2 bg-white"
        >
          <option value="">Disponibilidad: todas</option>
          <option value="libres">Con unidades libres</option>
        </select>
        <select
          aria-label="Duración máxima"
          value={duracion}
          onChange={(e) => { setDuracion(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2 bg-white"
        >
          <option value="">Duración: sin límite</option>
          <option value="7">Hasta 7 días</option>
          <option value="15">Hasta 15 días</option>
        </select>

        <button
          type="button"
          onClick={() => {
            setBusqueda('');
            setCategoriaSeleccionada('');
            setDisponibilidad('');
            setDuracion('');
            setOrden('nombre');
            setPagina(1);
          }}
          className="border border-primario text-primario rounded px-4 py-2"
        >
          Limpiar filtros
        </button>
      </div>

      </aside>
      <section className="min-w-0">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
      <p className="text-sm text-gris">{lista.length} equipos encontrados</p>
        <select
          aria-label="Ordenar equipos"
          value={orden}
          onChange={(e) => { setOrden(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2 bg-white"
        >
          <option value="nombre">Ordenar: nombre</option>
          <option value="categoria">Ordenar: categoría</option>
          <option value="disponibles">Ordenar: más disponibles</option>
        </select>
      </div>
      {lista.length === 0 && (
        <p className="bg-white border border-borde rounded p-8 text-center text-gris">
          No hay equipos que coincidan con la búsqueda y tengan unidades activas.
        </p>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {visibles.map((equipo) => (
          <article key={equipo.id} className="bg-white border border-borde rounded overflow-hidden">
            <div className="h-36 bg-gray-100 grid place-items-center overflow-hidden">
              <FotoEquipo url={equipo.fotografias?.[0]} nombre={equipo.nombre} />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase text-gris">{equipo.categoria}</p>
              <h2 className="text-lg font-semibold mt-1">{equipo.nombre}</h2>
              <p className="text-sm text-gris">{equipo.marca} · {equipo.modelo}</p>
              <p className="font-mono text-sm mt-3">
                {equipo.libres} de {equipo.total} unidades disponibles
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  to={enlaceDetalle(equipo.id)}
                  className="border border-primario text-primario rounded px-4 py-2"
                >
                  Ver detalle
                </Link>
                {(equipo.libres > 0 || equipo.prestadas > 0) && (
                  <Link
                    to={enlaceSolicitud(equipo.id)}
                    className="bg-primario text-white rounded px-4 py-2"
                  >
                    Solicitar préstamo
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-gris mt-4">Mostrando {Math.min(inicio + 1, lista.length)} a {Math.min(inicio + 8, lista.length)} de {lista.length} equipos</p>
      <Paginacion pagina={paginaActual} paginas={paginas} onCambiar={setPagina} />
      </section>
      </div>
    </Pagina>
  );
}
