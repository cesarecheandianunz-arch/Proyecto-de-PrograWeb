import { Routes, Route } from 'react-router-dom';

// HU-1 Cuenta y acceso
import Inicio from './pages/hu1/Inicio';
import Login from './pages/hu1/Login';
import Registro from './pages/hu1/Registro';
import RegistroEncargado from './pages/hu1/RegistroEncargado';
import Recuperar from './pages/hu1/Recuperar';
import MiCuenta from './pages/hu1/MiCuenta';
import Error from './pages/hu1/Error';
// HU-2 Inventario
import Inventario from './pages/hu2/Inventario';
import NuevoEquipo from './pages/hu2/NuevoEquipo';
import DetalleEquipo from './pages/hu2/DetalleEquipo';
// HU-3 Catálogo y solicitud
import Catalogo from './pages/hu3/Catalogo';
import DetalleCatalogo from './pages/hu3/DetalleCatalogo';
import Solicitar from './pages/hu3/Solicitar';
import MisSolicitudes from './pages/hu3/MisSolicitudes';
// HU-4 Aprobación y entrega
import Bandeja from './pages/hu4/Bandeja';
import RegistrarEntrega from './pages/hu4/RegistrarEntrega';
import Constancia from './pages/hu4/Constancia';
import Prestamos from './pages/hu4/Prestamos';
// HU-5 Devoluciones
import Devolucion from './pages/hu5/Devolucion';
import Historial from './pages/hu5/Historial';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/registro-encargado" element={<RegistroEncargado />} />
      <Route path="/recuperar" element={<Recuperar />} />
      <Route path="/mi-cuenta" element={<MiCuenta />} />
      <Route path="/acceso-denegado" element={<Error codigo={403} />} />

      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/catalogo/:id" element={<DetalleCatalogo />} />
      <Route path="/catalogo/:id/solicitar" element={<Solicitar />} />
      <Route path="/mis-solicitudes" element={<MisSolicitudes />} />

      <Route path="/encargado/inventario" element={<Inventario />} />
      <Route path="/encargado/nuevo-equipo" element={<NuevoEquipo />} />
      <Route path="/encargado/equipo" element={<DetalleEquipo />} />
      <Route path="/encargado/solicitudes" element={<Bandeja />} />
      <Route path="/encargado/entrega" element={<RegistrarEntrega />} />
      <Route path="/encargado/constancia" element={<Constancia />} />
      <Route path="/encargado/prestamos" element={<Prestamos />} />
      <Route path="/encargado/devolucion" element={<Devolucion />} />
      <Route path="/encargado/historial" element={<Historial />} />

      <Route path="*" element={<Error codigo={404} />} />
    </Routes>
  );
}
