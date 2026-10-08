import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { equipos } from '../../datos';

export default function Inicio() {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  function buscar() {
    navigate('/catalogo');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar tipo="publico" />

      <section className="bg-primario-suave py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-semibold mb-4">Reserva el equipo del laboratorio antes de tu práctica</h1>
            <p className="text-gris mb-6">
              Busca por equipo o categoría, revisa cuántas unidades hay libres y solicita el préstamo con tus fechas. Recojo en el Almacén H-102.
            </p>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-borde rounded px-3 py-2 bg-white"
                placeholder="Busca un equipo: «osciloscopio» o «robótica»"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button onClick={buscar} className="bg-primario text-white px-6 rounded">Buscar</button>
            </div>
          </div>
          <div className="h-64 bg-white border border-borde rounded grid place-items-center text-sm text-gris font-mono">
            fotografía del almacén
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Equipos destacados</h2>
          <Link to="/catalogo" className="text-primario">Ver todo el catálogo →</Link>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {equipos.slice(0, 4).map((e) => (
            <div key={e.id} className="bg-white border border-borde rounded p-4">
              <p className="font-semibold">{e.nombre}</p>
              <p className="text-sm text-gris">{e.marca} · {e.categoria}</p>
              <p className="font-mono text-sm text-exito mt-2">{e.libres} / {e.total} libres</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10 pt-6 border-t border-borde">
          <div><b className="text-acento">1</b> <b>Solicita con anticipación</b><p className="text-sm text-gris">El encargado responde en un máximo de 24 horas hábiles.</p></div>
          <div><b className="text-acento">2</b> <b>Recoge con tu carné</b><p className="text-sm text-gris">Verifica los accesorios en la entrega y firma la constancia.</p></div>
          <div><b className="text-acento">3</b> <b>Devuelve a tiempo</b><p className="text-sm text-gris">Cada día de retraso genera penalidad.</p></div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
