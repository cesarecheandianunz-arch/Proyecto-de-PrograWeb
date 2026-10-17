import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import CampoInventario from '../../components/CampoInventario';
import FotoEquipo from '../../components/FotoEquipo';
import { categorias } from '../../datos';
import { useInventario } from '../../context/InventarioContext.jsx';
import { normalizarTexto, validarEquipo } from './inventarioUtils';

const campoClase = 'w-full border border-borde rounded px-3 py-2';

export default function NuevoEquipo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equipos, setEquipos } = useInventario();
  const editando = id !== undefined;
  const equipoActual = equipos.find((equipo) => equipo.id === Number(id));
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [accesorio, setAccesorio] = useState('');
  const [accesorios, setAccesorios] = useState([]);
  const [fotosTexto, setFotosTexto] = useState('');
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const claveBorrador = `hu2-borrador-${id || 'nuevo'}`;
  // split separa las líneas; trim limpia espacios; filter quita líneas vacías.
  const fotografias = fotosTexto.split('\n').map((url) => {
    return url.trim();
  }).filter((url) => {
    return url !== '';
  });

  let titulo = 'Nuevo equipo';
  let textoBoton = 'Guardar equipo';
  if (editando) {
    titulo = 'Editar equipo';
    textoBoton = 'Guardar cambios';
  }

  function cargarDatos(datos = {}) {
    setNombre(datos.nombre || '');
    setCategoria(datos.categoria || '');
    setMarca(datos.marca || '');
    setModelo(datos.modelo || '');
    setDescripcion(datos.descripcion || '');
    if (Array.isArray(datos.accesorios)) {
      setAccesorios(datos.accesorios);
    } else {
      setAccesorios([]);
    }
    if (Array.isArray(datos.fotografias)) {
      setFotosTexto(datos.fotografias.join('\n'));
    } else {
      setFotosTexto('');
    }
    setAccesorio(datos.accesorio || '');
    setErrores({});
    setMensaje('');
  }

  useEffect(() => {
    cargarDatos(equipoActual);
  }, [equipoActual, id]);

  function obtenerDatos() {
    return { nombre: nombre.trim(), categoria, marca: marca.trim(), modelo: modelo.trim(), descripcion: descripcion.trim(), accesorios, fotografias };
  }

  function agregarAccesorio() {
    const valor = accesorio.trim();
    if (!valor) {
      setErrores((anteriores) => ({ ...anteriores, accesorio: 'Escribe el nombre del accesorio.' }));
      return;
    }
    const repetidos = accesorios.filter((actual) => {
      return normalizarTexto(actual) === normalizarTexto(valor);
    });
    if (repetidos.length > 0) {
      setErrores((anteriores) => ({ ...anteriores, accesorio: 'Este accesorio ya fue agregado.' }));
      return;
    }
    setAccesorios((anteriores) => [...anteriores, valor]);
    setAccesorio('');
    setErrores((anteriores) => ({ ...anteriores, accesorio: '' }));
    setMensaje('Accesorio agregado al formulario. Guarda el equipo para conservarlo.');
  }

  function guardarBorrador() {
    try {
      // Un borrador puede estar incompleto y no aparece en el inventario.
      localStorage.setItem(claveBorrador, JSON.stringify({ ...obtenerDatos(), accesorio, fotografias: fotosTexto.split('\n') }));
      setMensaje('Borrador guardado en este navegador. Puedes recuperarlo con «Cargar borrador».');
    } catch {
      setMensaje('No se pudo guardar el borrador en este navegador.');
    }
  }

  function cargarBorrador() {
    try {
      const borrador = JSON.parse(localStorage.getItem(claveBorrador));
      if (!borrador || typeof borrador.nombre !== 'string') {
        setMensaje('No hay un borrador guardado para este formulario.');
        return;
      }
      cargarDatos(borrador);
      setMensaje('Borrador recuperado. Revisa los datos antes de guardar el equipo.');
    } catch {
      setMensaje('No se pudo recuperar el borrador.');
    }
  }

  function guardar(evento) {
    evento.preventDefault();
    const datos = obtenerDatos();
    const encontrados = validarEquipo(datos, equipos, id);
    if (!categorias.includes(categoria)) encontrados.categoria = 'Selecciona una categoría válida.';
    if (accesorio.trim()) encontrados.accesorio = 'Pulsa «Agregar» para incluir este accesorio o borra el texto.';
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) {
      setMensaje('Revisa los campos marcados antes de guardar.');
      return;
    }
    let nuevoId;
    if (editando) {
      nuevoId = Number(id);
    } else {
      let mayorId = 0;
      equipos.forEach((equipo) => {
        if (equipo.id > mayorId) {
          mayorId = equipo.id;
        }
      });
      nuevoId = mayorId + 1;
    }
    if (editando) {
      setEquipos((anteriores) => {
        return anteriores.map((equipo) => {
          if (equipo.id === nuevoId) {
            return { ...equipo, ...datos };
          } else {
            return equipo;
          }
        });
      });
    } else {
      setEquipos((anteriores) => [...anteriores, { id: nuevoId, duracion: 7, autorizacion: true, renovacion: false, penalidad: 15, ...datos }]);
    }
    try { localStorage.removeItem(claveBorrador); } catch { /* El inventario se conserva en Context. */ }
    let mensajeGuardado;
    if (editando) {
      mensajeGuardado = 'Equipo actualizado.';
    } else {
      mensajeGuardado = 'Equipo registrado. Ahora puedes agregar sus unidades.';
    }
    navigate(`/encargado/equipo/${nuevoId}`, {
      state: { mensaje: mensajeGuardado },
    });
  }

  if (editando && !equipoActual) {
    return <PanelEncargado><h1 className="text-2xl mb-4">Equipo no encontrado</h1><Link to="/encargado/inventario">Volver al inventario</Link></PanelEncargado>;
  }

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Inventario / {titulo}</p>
      <h1 className="text-3xl font-semibold mb-6">{titulo}</h1>
      {mensaje && <p role="status" className="bg-primario-suave p-3 rounded mb-4">{mensaje}</p>}
      <form onSubmit={guardar} noValidate>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-borde rounded p-6 space-y-4">
            <h2 className="font-semibold text-primario border-b border-borde pb-2">Identificación</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <CampoInventario id="nombre" etiqueta="Nombre del equipo" error={errores.nombre}>
                <input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  aria-invalid={Boolean(errores.nombre)}
                  aria-describedby={errores.nombre && 'nombre-error'}
                  className={campoClase}
                />
              </CampoInventario>
              <CampoInventario id="categoria" etiqueta="Categoría" error={errores.categoria}>
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  aria-invalid={Boolean(errores.categoria)}
                  aria-describedby={errores.categoria && 'categoria-error'}
                  className={campoClase}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((opcion) => <option key={opcion}>{opcion}</option>)}
                </select>
              </CampoInventario>
              <CampoInventario id="marca" etiqueta="Marca" error={errores.marca}>
                <input
                  id="marca"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                  aria-invalid={Boolean(errores.marca)}
                  aria-describedby={errores.marca && 'marca-error'}
                  className={campoClase}
                />
              </CampoInventario>
              <CampoInventario id="modelo" etiqueta="Modelo" error={errores.modelo}>
                <input
                  id="modelo"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  aria-invalid={Boolean(errores.modelo)}
                  aria-describedby={errores.modelo && 'modelo-error'}
                  className={campoClase}
                />
              </CampoInventario>
            </div>
            <CampoInventario id="descripcion" etiqueta="Descripción pública" error={errores.descripcion}>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                aria-invalid={Boolean(errores.descripcion)}
                aria-describedby={errores.descripcion && 'descripcion-error'}
                className={campoClase}
              />
            </CampoInventario>
            <p className="text-xs text-gris">{descripcion.length}/400 caracteres</p>
            <h2 className="font-semibold">Accesorios incluidos</h2>
            {accesorios.length === 0 && <p className="text-sm text-gris">Sin accesorios registrados.</p>}
            {accesorios.map((actual) => <div key={actual} className="flex justify-between gap-3 border border-borde rounded px-3 py-2">
              {actual}
              <button type="button" onClick={() => { setAccesorios((anteriores) => anteriores.filter((valor) => valor !== actual)); setMensaje('Accesorio quitado del formulario. Guarda el equipo para conservar el cambio.'); }} className="text-peligro">Quitar</button>
            </div>)}
            <CampoInventario id="accesorio" etiqueta="Agregar accesorio" error={errores.accesorio}>
              <div className="flex gap-2">
                <input
                  id="accesorio"
                  value={accesorio}
                  onChange={(e) => setAccesorio(e.target.value)}
                  aria-invalid={Boolean(errores.accesorio)}
                  aria-describedby={errores.accesorio && 'accesorio-error'}
                  className={`${campoClase} min-w-0`}
                />
                <button type="button" onClick={agregarAccesorio} className="border border-primario text-primario px-4 rounded">Agregar</button>
              </div>
            </CampoInventario>
          </div>
          <div className="bg-white border border-borde rounded p-6 space-y-4">
            <CampoInventario id="fotografias" etiqueta="Fotografías por enlace" error={errores.fotografias}>
              <textarea
                id="fotografias"
                value={fotosTexto}
                onChange={(e) => setFotosTexto(e.target.value)}
                rows={4}
                placeholder="https://ejemplo.com/equipo.jpg"
                aria-invalid={Boolean(errores.fotografias)}
                aria-describedby={errores.fotografias && 'fotografias-error'}
                className={campoClase}
              />
            </CampoInventario>
            <p className="text-xs text-gris">Opcional: una dirección de imagen por línea. La primera será la principal.</p>
            {fotografias.length === 0 && <p className="text-sm text-gris">Sin fotografías registradas.</p>}
            {fotografias.map((url, indice) => <div key={`${indice}-${url}`} className="aspect-square bg-gray-100 rounded overflow-hidden grid place-items-center"><FotoEquipo url={url} nombre={`${nombre || 'Equipo'} · foto ${indice + 1}`} /></div>)}
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-3 mt-6">
          <Link to="/encargado/inventario" className="px-4 py-2 text-primario underline">Cancelar</Link>
          <button type="button" onClick={cargarBorrador} className="border border-borde px-4 py-2 rounded">Cargar borrador</button>
          <button type="button" onClick={guardarBorrador} className="border border-primario text-primario px-4 py-2 rounded">Guardar borrador</button>
          <button type="submit" className="bg-primario text-white px-4 py-2 rounded">{textoBoton}</button>
        </div>
      </form>
    </PanelEncargado>
  );
}
