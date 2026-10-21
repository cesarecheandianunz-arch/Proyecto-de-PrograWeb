import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#13201f] text-gray-300 text-sm mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between flex-wrap gap-4">
        <div>
          <p className="text-white font-semibold">Almacén de Equipos · Facultad de Ingeniería</p>
          <p>Universidad de Lima · Av. Javier Prado Este 4600, Santiago de Surco</p>
        </div>
        <div className="flex flex-wrap gap-6">
          <Link to="/reglamento" className="underline">Reglamento de préstamo</Link>
          <Link to="/ayuda" className="underline">Ayuda</Link>
          <span>almacen.equipos@ulima.edu.pe</span>
          <span>Anexo 3120</span>
        </div>
      </div>
    </footer>
  );
}
