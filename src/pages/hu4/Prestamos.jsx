import { Link } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import { prestamos } from '../../datos';

// Indicador de vencimiento: rojo si está vencido, amarillo si vence hoy, verde si falta
function Vencimiento({ dias }) {
  if (dias < 0) return <span className="bg-peligro text-white font-mono text-xs px-2 py-1 rounded">{-dias} d de retraso</span>;
  if (dias === 0) return <span className="border border-acento text-alerta font-mono text-xs px-2 py-1 rounded">vence hoy</span>;
  return <span className="border border-green-300 text-exito font-mono text-xs px-2 py-1 rounded">vence en {dias} d</span>;
}

function Tabla({ titulo, filas, color }) {
  return (
    <section className="mb-8">
      <h2 className={'text-xs font-semibold uppercase mb-2 ' + color}>{titulo} · {filas.length}</h2>
      <table className="w-full bg-white border border-borde text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
          <tr>
            <th className="p-3">Préstamo</th>
            <th className="p-3">Unidad</th>
            <th className="p-3">Estudiante</th>
            <th className="p-3">Vencimiento</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((p) => (
            <tr key={p.codigo} className="border-t border-borde">
              <td className="p-3 font-mono font-semibold">{p.codigo}</td>
              <td className="p-3 font-mono">{p.unidad}</td>
              <td className="p-3">{p.estudiante}</td>
              <td className="p-3 font-mono">{p.vence}</td>
              <td className="p-3"><Vencimiento dias={p.dias} /></td>
              <td className="p-3 text-primario">
                <Link to="/encargado/devolucion">Registrar devolución</Link>
                {p.dias > 0 && <button onClick={() => alert('Préstamo ' + p.codigo + ' renovado')} className="ml-2 text-primario">· Renovar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function Prestamos() {
  const vencidos = prestamos.filter((p) => p.dias < 0);
  const hoy = prestamos.filter((p) => p.dias === 0);
  const enCurso = prestamos.filter((p) => p.dias > 0);

  return (
    <PanelEncargado>
      <h1 className="text-3xl font-semibold">Préstamos vigentes</h1>
      <p className="text-gris text-sm mb-6">{prestamos.length} préstamos activos · {hoy.length} vence hoy · {vencidos.length} vencidos</p>
      <Tabla titulo="Vencidos" filas={vencidos} color="text-peligro" />
      <Tabla titulo="Vencen hoy" filas={hoy} color="text-alerta" />
      <Tabla titulo="En curso" filas={enCurso} color="text-texto" />
    </PanelEncargado>
  );
}
