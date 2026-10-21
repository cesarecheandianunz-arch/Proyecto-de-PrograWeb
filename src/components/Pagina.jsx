import Navbar from './Navbar';
import Footer from './Footer';
import { usePrestamos } from '../context/PrestamosContext';

// Estructura de las páginas públicas y del estudiante: navbar + contenido + footer
export default function Pagina({ tipo, children }) {
  const { errorPersistencia } = usePrestamos();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar tipo={tipo} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {errorPersistencia && <p role="alert" className="bg-amber-50 p-3 mb-4">{errorPersistencia}</p>}
        {children}
      </main>
      <Footer />
    </div>
  );
}
