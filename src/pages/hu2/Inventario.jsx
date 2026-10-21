import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import ModalInventario from '../../components/ModalInventario';
import FotoEquipo from '../../components/FotoEquipo';
import { categorias, equipos as equiposIniciales } from '../../datos';
import { usePrestamos } from '../../context/PrestamosContext';
import { useInventario } from '../../context/InventarioContext.jsx';
import { estadosUnidad, impedimentoEliminar } from './inventarioUtils';

export default function Inventario() {
  const { solicitudes, prestamos } = usePrestamos();
  const { equipos, setEquipos, unidades, setUnidades, equiposConConteo } = useInventario();
  const location = useLocation();
  const [parametros, setParametros] = useSearchParams();
  const [categoria, setCategoria] = useState('');
  const codigo = parametros.get('codigo') || '';
  const [estado, setEstado] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [pagina, setPagina] = useState(1);
  const [porEliminar, setPorEliminar] = useState(null);
  const [mensaje, setMensaje] = useState(location.state?.mensaje || '');

  // Una búsqueda del encabezado empieza sin los filtros de la búsqueda anterior.
  useEffect(() => {
    if (location.state && location.state.busquedaInventario) {
      setCategoria('');
      setEstado('');
      setDisponibilidad('');
      setPagina(1);
      setMensaje('');
    }
  }, [location]);

  // Aplicamos un filtro a la vez para poder seguir cada paso.
  let lista = equiposConConteo;

  if (categoria !== '') {
    lista = lista.filter((equipo) => equipo.categoria === categoria);
  }

  if (estado !== '') {
    lista = lista.filter((equipo) => {
      const coincidencias = unidades.filter((unidad) => {
        return unidad.equipoId === equipo.id && unidad.estado === estado;
      });
      return coincidencias.length > 0;
    });
  }

  if (codigo.trim() !== '') {
    const texto = codigo.trim().toLowerCase();
    lista = lista.filter((equipo) => {
      const coincideNombre = equipo.nombre.toLowerCase().includes(texto);
      const coincideModelo = equipo.modelo.toLowerCase().includes(texto);
      const unidadesCoincidentes = unidades.filter((unidad) => {
        return unidad.equipoId === equipo.id && unidad.codigo.toLowerCase().includes(texto);
      });
      return coincideNombre || coincideModelo || unidadesCoincidentes.length > 0;
    });
  }

  if (disponibilidad === 'conLibres') {
    lista = lista.filter((equipo) => equipo.libres > 0);
  } else if (disponibilidad === 'sinLibres') {
    lista = lista.filter((equipo) => equipo.libres === 0);
  }

  const paginas = Math.max(1, Math.ceil(lista.length / 8));
  const paginaActual = Math.min(pagina, paginas);
  const inicio = (paginaActual - 1) * 8;
  const visibles = lista.slice(inicio, inicio + 8);

  function cambiarCodigo(valor) {
    if (valor === '') {
      setParametros({}, { replace: true });
    } else {
      setParametros({ codigo: valor }, { replace: true });
    }
    setPagina(1);
  }

  function limpiarFiltros() {
    setCategoria('');
    setEstado('');
    setParametros({}, { replace: true });
    setDisponibilidad('');
    setPagina(1);
  }

  let bloqueoEliminacion = '';
  if (porEliminar) {
    bloqueoEliminacion = impedimentoEliminar(porEliminar, unidades, solicitudes, prestamos, equiposIniciales);
  }

  let primerResultado = 0;
  if (lista.length > 0) {
    primerResultado = inicio + 1;
  }

  let mensajeVacio;
  if (equipos.length > 0) {
    mensajeVacio = 'Ningún equipo coincide con estos filtros.';
  } else {
    mensajeVacio = 'Aún no hay equipos. Registra el primero con «Nuevo equipo».';
  }

  function eliminarEquipo() {
    const impedimento = impedimentoEliminar(porEliminar, unidades, solicitudes, prestamos, equiposIniciales);
    if (impedimento) {
      setMensaje(impedimento);
      setPorEliminar(null);
      return;
    }
    setEquipos((anteriores) => anteriores.filter((equipo) => equipo.id !== porEliminar.id));
    setUnidades((anteriores) => anteriores.filter((unidad) => unidad.equipoId !== porEliminar.id));
    setMensaje(`Equipo «${porEliminar.nombre}» y sus unidades eliminados.`);
    setPorEliminar(null);
  }

  return (
    <PanelEncargado>
      <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Inventario de equipos</h1>
          <p className="text-gris text-sm">{equipos.length} modelos · {unidades.length} unidades registradas en el Almacén H-102</p>
        </div>
        <Link to="/encargado/nuevo-equipo" className="bg-primario text-white px-4 py-2 rounded">Nuevo equipo</Link>
      </div>
      {mensaje && <p role="status" className="bg-primario-suave p-3 rounded mb-4">{mensaje}</p>}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          aria-label="Categoría"
          value={categoria}
          onChange={(e) => { setCategoria(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2 bg-white"
        >
          <option value="">Categoría: todas</option>
          {categorias.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          aria-label="Estado de unidad"
          value={estado}
          onChange={(e) => { setEstado(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2 bg-white"
        >
          <option value="">Estado: todos</option>
          {estadosUnidad.map((opcion) => <option key={opcion}>{opcion}</option>)}
        </select>
        <select
          aria-label="Disponibilidad"
          value={disponibilidad}
          onChange={(e) => { setDisponibilidad(e.target.value); setPagina(1); }}
          className="border border-borde rounded px-3 py-2 bg-white"
        >
          <option value="">Disponibilidad: todas</option>
          <option value="conLibres">Con unidades libres</option>
          <option value="sinLibres">Sin unidades libres</option>
        </select>
        <input
          aria-label="Buscar equipo o código"
          value={codigo}
          onChange={(e) => cambiarCodigo(e.target.value)}
          placeholder="Código, nombre o modelo"
          className="min-w-0 flex-1 border border-borde rounded px-3 py-2 bg-white"
        />
        <button onClick={limpiarFiltros} className="border border-borde rounded px-4 py-2 bg-white">Limpiar filtros</button>
      </div>
      <p className="text-sm text-gris mb-3">Mostrando {primerResultado} a {Math.min(inicio + 8, lista.length)} de {lista.length} coincidencias</p>
      <div className="max-h-[65vh] overflow-auto">
        <table className="w-full bg-white border border-borde text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gris text-left">
            <tr>{['Foto', 'Equipo', 'Marca y modelo', 'Categoría', 'Unidades por estado', 'Acciones'].map((titulo) => <th key={titulo} className="p-3">{titulo}</th>)}</tr>
          </thead>
          <tbody>
            {visibles.map((equipo) => (
              <tr key={equipo.id} className="border-t border-borde">
                <td className="p-3"><div className="w-16 h-16 bg-gray-100 rounded overflow-hidden grid place-items-center"><FotoEquipo url={equipo.fotografias?.[0]} nombre={equipo.nombre} /></div></td>
                <td className="p-3 font-medium">{equipo.nombre}</td>
                <td className="p-3 text-gris">{equipo.marca} · {equipo.modelo}</td>
                <td className="p-3 text-gris">{equipo.categoria}</td>
                <td className="p-3 font-mono">
                  <span className="text-exito">{equipo.libres} libres</span>
                  {' · '}
                  <span className="text-info">{equipo.prestadas} prestadas</span>
                  {' · '}
                  <span className="text-alerta">{equipo.mantenimiento} mant.</span>
                  {' · '}
                  <span className="text-gris">{equipo.baja} de baja</span>
                </td>
                <td className="p-3"><div className="flex flex-wrap gap-3 text-primario">
                  <Link to={`/encargado/equipo/${equipo.id}`}>Unidades</Link>
                  <Link to={`/encargado/equipo/${equipo.id}/condiciones`}>Condiciones</Link>
                  <Link to={`/encargado/equipo/${equipo.id}/editar`}>Editar</Link>
                  <Link to={`/equipos/${equipo.id}`}>Ficha pública</Link>
                  <button onClick={() => setPorEliminar(equipo)} className="text-peligro">Eliminar</button>
                </div></td>
              </tr>
            ))}
            {lista.length === 0 && <tr><td colSpan={6} className="text-center text-gris p-8">{mensajeVacio}</td></tr>}
          </tbody>
        </table>
      </div>
      {paginas > 1 && <nav aria-label="Paginación del inventario" className="flex items-center justify-end gap-3 mt-4">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPagina(paginaActual - 1)}
          className="border border-borde px-3 py-2 rounded disabled:opacity-40"
        >Anterior</button>
        <span>Página {paginaActual} de {paginas}</span>
        <button
          disabled={paginaActual === paginas}
          onClick={() => setPagina(paginaActual + 1)}
          className="border border-borde px-3 py-2 rounded disabled:opacity-40"
        >Siguiente</button>
      </nav>}
      {porEliminar && <ModalInventario titulo="Eliminar equipo" onCerrar={() => setPorEliminar(null)}>
        {bloqueoEliminacion !== '' && <p role="alert">{bloqueoEliminacion}</p>}
        {bloqueoEliminacion === '' && <p>Se eliminará «{porEliminar.nombre}» y sus unidades. Esta acción no se puede deshacer.</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button autoFocus onClick={() => setPorEliminar(null)} className="border border-borde rounded px-4 py-2">Cancelar</button>
          {!bloqueoEliminacion && <button onClick={eliminarEquipo} className="bg-peligro text-white rounded px-4 py-2">Eliminar equipo</button>}
        </div>
      </ModalInventario>}
    </PanelEncargado>
  );
}
