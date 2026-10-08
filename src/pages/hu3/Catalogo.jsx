import { useState } from 'react';
import Pagina from '../../components/Pagina';
import TarjetaEquipo from '../../components/TarjetaEquipo';
import { equipos, categorias } from '../../datos';

export default function Catalogo() {
  const [texto, setTexto] = useState('');
  const [soloLibres, setSoloLibres] = useState(false);

  // Filtros simples sobre la lista de datos.js
  let lista = equipos.filter((e) => e.nombre.toLowerCase().includes(texto.toLowerCase()));
  if (soloLibres) {
    lista = lista.filter((e) => e.libres > 0);
  }

  return (
    <Pagina tipo="estudiante">
      <div className="grid md:grid-cols-4 gap-6">
        <aside className="bg-white border border-borde rounded p-5 h-fit text-sm">
          <h2 className="font-semibold mb-3">Filtros</h2>
          <p className="text-xs font-semibold uppercase mb-2">Categoría</p>
          {categorias.map((c) => (
            <label key={c} className="block mb-1"><input type="checkbox" /> {c}</label>
          ))}
          <p className="text-xs font-semibold uppercase mt-4 mb-2">Disponibilidad</p>
          <label className="block"><input type="radio" name="disp" onChange={() => setSoloLibres(true)} /> Con unidades libres</label>
          <label className="block"><input type="radio" name="disp" onChange={() => setSoloLibres(false)} /> Todas</label>
          <p className="text-xs font-semibold uppercase mt-4 mb-2">Duración máxima</p>
          <label className="block"><input type="radio" name="dur" /> Hasta 7 días</label>
          <label className="block"><input type="radio" name="dur" /> Hasta 15 días</label>
          <label className="block"><input type="radio" name="dur" /> Sin límite</label>
          <button className="w-full bg-primario text-white py-2 rounded mt-4">Aplicar filtros</button>
        </aside>

        <section className="md:col-span-3">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-semibold">Catálogo de equipos</h1>
              <p className="text-gris text-sm">{lista.length} equipos</p>
            </div>
            <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar equipo" className="border border-borde rounded px-3 py-2 bg-white" />
          </div>

          {lista.length === 0 ? (
            <p className="bg-white border border-borde rounded p-10 text-center text-gris">Ningún equipo coincide con estos filtros</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {lista.map((e) => <TarjetaEquipo key={e.id} equipo={e} />)}
            </div>
          )}
        </section>
      </div>
    </Pagina>
  );
}
