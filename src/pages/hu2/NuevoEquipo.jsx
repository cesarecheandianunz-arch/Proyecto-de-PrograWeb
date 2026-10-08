import { useState } from 'react';
import { Link } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import { categorias } from '../../datos';

export default function NuevoEquipo() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [accesorio, setAccesorio] = useState('');
  const [accesorios, setAccesorios] = useState(['Estuche rígido']);
  const [mensaje, setMensaje] = useState('');

  function agregarAccesorio() {
    if (accesorio === '') return;
    setAccesorios([...accesorios, accesorio]);
    setAccesorio('');
  }

  function quitarAccesorio(nombreAccesorio) {
    setAccesorios(accesorios.filter((a) => a !== nombreAccesorio));
  }

  function guardar() {
    if (nombre === '') {
      setMensaje('El nombre es obligatorio.');
    } else {
      setMensaje('Equipo «' + nombre + '» guardado.');
    }
  }

  return (
    <PanelEncargado>
      <p className="text-sm text-gris">Inventario / Nuevo equipo</p>
      <h1 className="text-3xl font-semibold mb-6">Nuevo equipo</h1>
      {mensaje && <p className="bg-primario-suave p-3 rounded mb-4">{mensaje}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-borde rounded p-6">
          <h2 className="text-xs font-semibold uppercase text-primario border-b border-borde pb-2 mb-4">Identificación</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del equipo" className="border border-borde rounded px-3 py-2" />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border border-borde rounded px-3 py-2">
              <option value="">Categoría</option>
              {categorias.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca" className="border border-borde rounded px-3 py-2" />
            <input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Modelo" className="border border-borde rounded px-3 py-2" />
          </div>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" rows="4" className="w-full border border-borde rounded px-3 py-2" />
          <p className="text-xs text-gris mb-4">{descripcion.length}/400 caracteres</p>

          <h2 className="text-xs font-semibold uppercase mb-2">Accesorios incluidos</h2>
          {accesorios.map((a) => (
            <div key={a} className="flex justify-between border border-borde rounded px-3 py-2 mb-2">
              {a}
              <button onClick={() => quitarAccesorio(a)} className="text-peligro text-sm">Quitar</button>
            </div>
          ))}
          <div className="flex gap-2">
            <input value={accesorio} onChange={(e) => setAccesorio(e.target.value)} placeholder="Nombre del accesorio" className="flex-1 border border-borde rounded px-3 py-2" />
            <button onClick={agregarAccesorio} className="border border-primario text-primario px-4 rounded">Agregar</button>
          </div>
        </div>

        <div className="bg-white border border-borde rounded p-6">
          <h2 className="text-xs font-semibold uppercase text-primario border-b border-borde pb-2 mb-4">Fotografías</h2>
          <div className="aspect-square border-2 border-dashed border-borde rounded grid place-items-center text-sm text-gris">
            Arrastra las fotografías
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Link to="/encargado/inventario" className="px-4 py-2 text-primario underline">Cancelar</Link>
        <button onClick={() => setMensaje('Borrador guardado.')} className="border border-primario text-primario px-4 py-2 rounded">Guardar borrador</button>
        <button onClick={guardar} className="bg-primario text-white px-4 py-2 rounded">Guardar equipo</button>
      </div>
    </PanelEncargado>
  );
}
