import Navbar from './Navbar';
import Footer from './Footer';

// Estructura de las páginas públicas y del estudiante: navbar + contenido + footer
export default function Pagina({ tipo, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar tipo={tipo} />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">{children}</main>
      <Footer />
    </div>
  );
}
