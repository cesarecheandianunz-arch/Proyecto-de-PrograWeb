import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PanelEncargado from '../../components/PanelEncargado';
import Renovacion from '../hu5/Renovacion';
import { usePrestamos } from '../../context/PrestamosContext';
import { useInventario } from '../../context/InventarioContext';
import { hoyISO, diasEntre, mostrarFecha, sumarDias, motivoNoRenovar } from '../../utils/prestamos';

// Indicador de vencimiento: rojo si está vencido, amarillo si vence hoy, verde si falta
function Vencimiento({ dias }) {
  if (dias < 0) return <span className="bg-peligro text-white font-mono text-xs px-2 py-1 rounded">{-dias} d de retraso</span>;
  if (dias === 0) return <span className="border border-acento text-alerta font-mono text-xs px-2 py-1 rounded">vence hoy</span>;
  return <span className="border border-green-300 text-exito font-mono text-xs px-2 py-1 rounded">vence en {dias} d</span>;
}

function Tabla({ titulo, filas, color, onRenovar }) {
  return (
    <section className="mb-8">
      <h2 className={'text-xs font-semibold uppercase mb-2 ' + color}>{titulo} · {filas.length}</h2>
      {filas.length === 0 && <p className="bg-white p-4 text-gris">No hay préstamos en este grupo.</p>}
      <div className="overflow-x-auto"><table className="w-full bg-white border border-borde text-sm">
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
              <td className="p-3"><Link to={`/encargado/historial/${p.estudianteId}`} className="underline">{p.estudiante}</Link></td>
              <td className="p-3 font-mono">{p.vence}</td>
              <td className="p-3"><Vencimiento dias={p.dias} /></td>
              <td className="p-3 text-primario">
                <Link
                  to={`/encargado/devolucion/${p.codigo}`}
                  className="text-primario"
                >
                  Registrar devolución
                </Link>

                <Link to={`/encargado/constancia/${p.codigo}`} className="block text-primario underline">Ver constancia</Link>
                {p.dias >= 0 && (
                  <button
                    type="button"
                    onClick={() => onRenovar(p)}
                    className="ml-3 text-primario"
                  >
                    Renovar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </section>
  );
}

export default function Prestamos() {
  const [prestamoRenovar, setPrestamoRenovar] = useState(null);
  const { prestamos: guardados, solicitudes, estudiantes, renovarPrestamo } = usePrestamos();
  const { equipos } = useInventario();
  const [parametros] = useSearchParams();
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  let prestamos = guardados.filter((p) => p.estado === 'Activo').map((p) => ({ ...p, vence: mostrarFecha(p.fin), dias: diasEntre(hoyISO(), p.fin) }));
  if (busqueda.trim()) prestamos = prestamos.filter((p) => (p.codigo + ' ' + p.unidad + ' ' + p.estudiante).toLowerCase().includes(busqueda.trim().toLowerCase()));
  if (parametros.get('estado') === 'vencidos') prestamos = prestamos.filter((p) => p.dias < 0);
  const vencidos = prestamos.filter((p) => p.dias < 0);
  const hoy = prestamos.filter((p) => p.dias === 0);
  const enCurso = prestamos.filter((p) => p.dias > 0);
  let equipoRenovar;
  let impedimento = '';
  let fechaNueva = '';
  if (prestamoRenovar) {
    equipoRenovar = equipos.find((e) => e.id === prestamoRenovar.equipoId);
    impedimento = motivoNoRenovar(prestamoRenovar, equipoRenovar, solicitudes);
    const estudiante = estudiantes.find((e) => e.id === prestamoRenovar.estudianteId);
    if (estudiante && (estudiante.deuda > 0 || estudiante.bloqueada)) impedimento = 'El estudiante tiene deuda o bloqueo.';
    if (equipoRenovar) fechaNueva = mostrarFecha(sumarDias(prestamoRenovar.fin, equipoRenovar.duracion));
  }
  function confirmarRenovacion() {
    const resultado = renovarPrestamo(prestamoRenovar.codigo);
    if (resultado.error) { setMensaje(resultado.error); return; }
    setMensaje('Renovación registrada. Nueva fecha: ' + fechaNueva + '.');
    setPrestamoRenovar(null);
  }

  return (
    <PanelEncargado>
      <h1 className="text-3xl font-semibold">Préstamos vigentes</h1>
      <p className="text-gris text-sm mb-6">{prestamos.length} préstamos activos · {hoy.length} vence hoy · {vencidos.length} vencidos</p>
      {mensaje && <p role="status" className="bg-primario-suave p-3 mb-4">{mensaje}</p>}
      <input
        aria-label="Buscar préstamos"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Código de préstamo, unidad o estudiante"
        className="w-full border border-borde rounded px-3 py-2 mb-4"
      />
      <Link to="/encargado/prestamos" className="inline-block text-primario underline mb-4">Ver todos los préstamos vigentes</Link>
      <Tabla
        titulo="Vencidos"
        filas={vencidos}
        color="text-peligro"
        onRenovar={setPrestamoRenovar}
      />

      <Tabla
        titulo="Vencen hoy"
        filas={hoy}
        color="text-alerta"
        onRenovar={setPrestamoRenovar}
      />

      <Tabla
        titulo="En curso"
        filas={enCurso}
        color="text-texto"
        onRenovar={setPrestamoRenovar}
      />
      {prestamoRenovar && (
        <Renovacion
          prestamo={prestamoRenovar.codigo}
          equipo={prestamoRenovar.equipo}
          unidad={prestamoRenovar.unidad}
          fechaActual={prestamoRenovar.vence}
          fechaNueva={fechaNueva}
          admiteRenovacion={Boolean(equipoRenovar && equipoRenovar.renovacion)}
          haySolicitudEnEspera={impedimento !== ''}
          motivoBloqueo={impedimento}
          onClose={() => setPrestamoRenovar(null)}
          onConfirm={confirmarRenovacion}
        />
      )}
    </PanelEncargado>
  );
}
