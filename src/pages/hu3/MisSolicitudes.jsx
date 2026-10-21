import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import Etiqueta from '../../components/Etiqueta';
import { usePrestamos } from '../../context/PrestamosContext';
import { useCuenta } from '../../context/CuentaContext';
import { mostrarFecha } from '../../utils/prestamos';

export default function MisSolicitudes() {
  const { solicitudes, retirarSolicitud } = usePrestamos();
  const { estudiante } = useCuenta();
  const location = useLocation();
  const [mensaje, setMensaje] = useState(location.state?.mensaje || '');
  const lista = solicitudes.filter((s) => s.estudianteId === estudiante.id);
  const [estado, setEstado] = useState('');

  function retirar(codigo) {
    if (confirm('¿Retirar la solicitud ' + codigo + '?')) {
      const resultado = retirarSolicitud(codigo, estudiante.id);
      if (resultado.error) setMensaje(resultado.error);
      else setMensaje('Solicitud retirada correctamente.');
    }
  }

  let tituloVacio = 'Aún no tienes solicitudes';
  let descripcionVacia = 'Busca un equipo en el catálogo y solicita tu primer préstamo.';
  if (lista.length > 0) {
    tituloVacio = 'Ninguna solicitud coincide con el estado seleccionado';
    descripcionVacia = 'Prueba seleccionando otro estado o mostrando todos.';
  }
  let visibles = lista;
  if (estado !== '') visibles = lista.filter((s) => s.estado === estado);

  return (
    <Pagina tipo="estudiante">
      <h1 className="text-3xl font-semibold">Mis solicitudes</h1>
      {mensaje && <p role="status" className="bg-primario-suave p-3 my-3">{mensaje}</p>}
      <p className="text-gris text-sm mb-6">{lista.length} solicitudes</p>

      <select value={estado} onChange={(e) => setEstado(e.target.value)} className="border border-borde rounded px-3 py-2 bg-white mb-4">
        <option value="">Estado: todos</option>
        <option>Enviada</option>
        <option>Aprobada</option>
        <option>Entregada</option>
        <option>Rechazada</option>
        <option>Devuelta</option>
        <option>Retirada</option>
      </select>

      {visibles.length === 0 && (
        <div className="bg-white border border-borde rounded p-10 text-center">
          <p className="font-semibold">{tituloVacio}</p>
          <p className="text-gris text-sm">{descripcionVacia}</p>
          <Link to="/catalogo" className="inline-block text-primario underline mt-3">Ir al catálogo</Link>
        </div>
      )}
      {visibles.length > 0 && (
        <div className="overflow-x-auto"><table className="w-full bg-white border border-borde text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
            <tr>
              <th className="p-3">Equipo y curso</th>
              <th className="p-3">Fechas</th>
              <th className="p-3">Unidad asignada</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((s) => (
              <tr key={s.codigo} className="border-t border-borde">
                <td className="p-3"><b>{s.equipo}</b><p className="text-gris text-xs">{s.curso}</p></td>
                <td className="p-3 font-mono">{mostrarFecha(s.inicio)} → {mostrarFecha(s.fin)}</td>
                <td className="p-3 font-mono text-gris">{s.unidad}</td>
                <td className="p-3"><Etiqueta estado={s.estado} /></td>
                <td className="p-3">
                  {s.estado === 'Enviada' && (
                    <button onClick={() => retirar(s.codigo)} className="text-peligro">Retirar solicitud</button>
                  )}
                  <Link to={`/mis-solicitudes/${s.codigo}`} className="block text-primario underline">Ver detalle</Link>
                  {(s.estado === 'Entregada' || s.estado === 'Devuelta') && <Link to={`/mis-solicitudes/${s.codigo}/constancia`} className="block text-primario underline">Ver constancia</Link>}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </Pagina>
  );
}
