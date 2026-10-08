import { useState } from 'react';
import Pagina from '../../components/Pagina';
import Etiqueta from '../../components/Etiqueta';
import { solicitudes } from '../../datos';

export default function MisSolicitudes() {
  // Solo las solicitudes de Renzo (el estudiante de prueba)
  const [lista, setLista] = useState(solicitudes.filter((s) => s.estudiante === 'Renzo Mendoza Cárdenas'));
  const [estado, setEstado] = useState('');

  function retirar(codigo) {
    if (confirm('¿Retirar la solicitud ' + codigo + '?')) {
      setLista(lista.filter((s) => s.codigo !== codigo));
    }
  }

  const visibles = estado === '' ? lista : lista.filter((s) => s.estado === estado);

  return (
    <Pagina tipo="estudiante">
      <h1 className="text-3xl font-semibold">Mis solicitudes</h1>
      <p className="text-gris text-sm mb-6">{lista.length} solicitudes</p>

      <select value={estado} onChange={(e) => setEstado(e.target.value)} className="border border-borde rounded px-3 py-2 bg-white mb-4">
        <option value="">Estado: todos</option>
        <option>Enviada</option>
        <option>Aprobada</option>
        <option>Entregada</option>
        <option>Rechazada</option>
      </select>

      {visibles.length === 0 ? (
        <div className="bg-white border border-borde rounded p-10 text-center">
          <p className="font-semibold">Aún no tienes solicitudes</p>
          <p className="text-gris text-sm">Busca un equipo en el catálogo y solicita tu primer préstamo.</p>
        </div>
      ) : (
        <table className="w-full bg-white border border-borde text-sm">
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
                <td className="p-3 font-mono">{s.fechas}</td>
                <td className="p-3 font-mono text-gris">{s.unidad}</td>
                <td className="p-3"><Etiqueta estado={s.estado} /></td>
                <td className="p-3">
                  {s.estado === 'Enviada' ? (
                    <button onClick={() => retirar(s.codigo)} className="text-peligro">Retirar solicitud</button>
                  ) : (
                    <span className="text-primario">Ver detalle</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Pagina>
  );
}
