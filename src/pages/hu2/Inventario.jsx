import { useState } from 'react';
import { Link } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import { equipos, categorias } from '../../datos';

export default function Inventario() {
  const [categoria, setCategoria] = useState('');
  const [codigo, setCodigo] = useState('');
  const[disponibilidad, setDisponibilidad] = useState('');
// Filtramos los equipos según su categoría
let lista;

if (categoria === '') {
  lista = equipos;
} else {
  lista = equipos.filter((equipo) => equipo.categoria === categoria);
}
if (codigo.trim() !== '') {
  lista = lista.filter((equipo) =>
    equipo.nombre.toLowerCase().includes(codigo.toLowerCase()) ||
    equipo.modelo.toLowerCase().includes(codigo.toLowerCase())
  );}
if(disponibilidad === 'conLibres') {
  lista=lista.filter((equipo)=>equipo.libres>0);
}else if(disponibilidad === 'sinLibres') {
  lista=lista.filter((equipo)=>equipo.libres===0);
}


  return (
    <PanelEncargado>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Inventario de equipos</h1>
          <p className="text-gris text-sm">{equipos.length} modelos registrados en el Almacén H-102</p>
        </div>
        <Link to="/encargado/nuevo-equipo" className="bg-primario text-white px-4 py-2 rounded">Nuevo equipo</Link>
      </div>

      <div className="flex gap-3 mb-4">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="border border-borde rounded px-3 py-2 bg-white">
          <option value="">Categoría: todas</option>
          {categorias.map((c) => <option key={c}>{c}</option>)}
        </select>
<select
  value={disponibilidad}
  onChange={(evento) => setDisponibilidad(evento.target.value)}
  className="border border-borde rounded px-3 py-2 bg-white"
>
  <option value="">Disponibilidad: todas</option>
  <option value="conLibres">Con unidades libres</option>
  <option value="sinLibres">Sin unidades libres</option>
</select>
        <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Buscar por nombre o modelo" className="flex-1 border border-borde rounded px-3 py-2 font-mono bg-white" />
      </div>

      <table className="w-full bg-white border border-borde rounded text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
          <tr>
            <th className="p-3">Foto</th>
            <th className="p-3">Equipo</th>
            <th className="p-3">Marca y modelo</th>
            <th className="p-3">Categoría</th>
            <th className="p-3">Unidades</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((e) => (
            <tr key={e.id} className="border-t border-borde">
              <td className="p-3"><div className="w-10 h-10 bg-gray-100 rounded"></div></td>
              <td className="p-3 font-medium">{e.nombre}</td>
              <td className="p-3 text-gris">{e.marca} · {e.modelo}</td>
              <td className="p-3 text-gris">{e.categoria}</td>
              <td className="p-3 font-mono text-exito">{e.libres} libres de {e.total}</td>
              <td className="p-3 text-primario">
                <Link to="/encargado/equipo">Unidades</Link> · <Link to="/encargado/equipo">Condiciones</Link> · <Link to="/encargado/nuevo-equipo">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {lista.length === 0 && <p className="text-center text-gris bg-white border border-borde p-8">Ningún equipo coincide con estos filtros</p>}
    </PanelEncargado>
  );
}
