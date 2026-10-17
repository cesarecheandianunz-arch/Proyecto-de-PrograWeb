import { useState } from 'react';
import PanelEncargado from '../../components/PanelEncargado';
import Renovacion from './Renovacion';

const PRESTAMO_DEMO = {
  codigo: 'PRE-2026-0291',
  estudiante: 'Camila Quispe Andrade',
  equipo: 'Tableta Wacom Intuos',
  unidad: 'INV-TAB-0004',
  fechaPactada: '2026-09-11',
  fechaPactadaTexto: '11/09/2026',
};

const ACCESORIOS_INICIALES = [
  { nombre: 'Lápiz digital', devuelto: true },
  { nombre: 'Cable USB', devuelto: false },
  { nombre: 'Estuche', devuelto: true },
];

function formatearFecha(fecha) {
  if (!fecha) return '';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

function calcularDiasRetraso(fechaRetorno, fechaPactada) {
  if (!fechaRetorno || !fechaPactada) return 0;
  const retorno = new Date(`${fechaRetorno}T00:00:00`);
  const pactada = new Date(`${fechaPactada}T00:00:00`);
  return Math.max(0, Math.round((retorno - pactada) / 86400000));
}

export default function Devolucion() {
  const [codigo, setCodigo] = useState(PRESTAMO_DEMO.codigo);
  const [encontrado, setEncontrado] = useState(false);
  const [accesorios, setAccesorios] = useState(ACCESORIOS_INICIALES);
  const [estadoRetorno, setEstadoRetorno] = useState('Faltantes');
  const [fechaRetorno, setFechaRetorno] = useState('2026-09-14');
  const [descripcion, setDescripcion] = useState(
    'Superficie activa con rayadura profunda en la esquina inferior derecha; el trazo se corta en esa zona.'
  );
  const [mantenimiento, setMantenimiento] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mostrarRenovacion, setMostrarRenovacion] = useState(false);

  const diasRetraso = calcularDiasRetraso(fechaRetorno, PRESTAMO_DEMO.fechaPactada);
  const penalidad = diasRetraso * 15;
  const faltantes = accesorios.filter((a) => !a.devuelto);

  function buscarPrestamo() {
    setError('');
    setMensaje('');

    if (codigo.trim().toUpperCase() !== PRESTAMO_DEMO.codigo) {
      setEncontrado(false);
      setError('No encontramos un préstamo con ese código. Prueba con PRE-2026-0291.');
      return;
    }

    setEncontrado(true);
  }

  function marcarAccesorio(index) {
    setAccesorios((actuales) =>
      actuales.map((accesorio, i) =>
        i === index ? { ...accesorio, devuelto: !accesorio.devuelto } : accesorio
      )
    );
    setError('');
  }

  function cancelar() {
    setEncontrado(false);
    setError('');
    setMensaje('');
  }

  function guardarDevolucion() {
    setError('');

    if (estadoRetorno === 'Con daños' && descripcion.trim() === '') {
      setError('Describe el daño antes de guardar la devolución.');
      return;
    }

    if (estadoRetorno === 'Faltantes' && faltantes.length === 0) {
      setError('Marca al menos un accesorio como faltante o selecciona «Sin novedades».');
      return;
    }

    let texto = 'Devolución registrada correctamente.';

    if (diasRetraso > 0) {
      texto += ` ${diasRetraso} días de retraso. Penalidad: S/ ${penalidad.toFixed(2)}.`;
    } else {
      texto += ' Devolución a tiempo. Sin penalidad.';
    }

    if (faltantes.length > 0) {
      texto += ` ${faltantes.length} accesorio(s) faltante(s) pendiente(s) de valorización.`;
    }

    if (mantenimiento) {
      texto += ` La unidad ${PRESTAMO_DEMO.unidad} pasa a «En mantenimiento».`;
    }

    setMensaje(texto);
    setEncontrado(false);
  }

  function cambiarEstado(opcion) {
    setEstadoRetorno(opcion);
    setError('');
  }

  return (
    <PanelEncargado>
      <p className="text-sm text-gris mb-1">Préstamos / Devoluciones</p>
      <h1 className="text-3xl font-semibold">Registrar devolución</h1>
      <p className="text-gris text-sm mb-6">
        Registra la fecha real de retorno, el estado de la unidad y los accesorios devueltos.
      </p>

      {mensaje && (
        <div className="bg-green-50 border border-green-200 border-l-4 border-l-exito p-4 mb-6 text-sm">
          <b>Operación realizada.</b> {mensaje}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 border-l-4 border-l-peligro p-4 mb-6 text-sm text-peligro">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white border border-borde rounded p-6">
          <h2 className="text-xl font-semibold mb-1">Devolución con retraso y accesorio faltante</h2>
          <p className="text-sm text-gris mb-5">Busca el préstamo para cargar sus datos.</p>

          <label className="block text-xs font-semibold uppercase mb-1">Buscar préstamo</label>
          <div className="flex gap-2 mb-5">
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarPrestamo()}
              className="flex-1 border border-borde rounded px-3 py-2 font-mono"
              placeholder="PRE-2026-0291"
            />
            <button
              type="button"
              onClick={buscarPrestamo}
              className="bg-primario text-white px-5 py-2 rounded min-h-10"
            >
              Buscar
            </button>
          </div>

          {encontrado && (
            <>
              <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-borde rounded p-4 text-sm mb-5">
                <div>
                  <p className="text-xs uppercase text-gris">Estudiante</p>
                  <p>{PRESTAMO_DEMO.estudiante}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gris">Equipo y unidad</p>
                  <p>
                    {PRESTAMO_DEMO.equipo} ·{' '}
                    <span className="font-mono">{PRESTAMO_DEMO.unidad}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gris">Devolución pactada</p>
                  <span className="font-mono">{PRESTAMO_DEMO.fechaPactadaTexto}</span>
                </div>
                <div>
                  <p className="text-xs uppercase text-gris">Retorno real</p>
                  <span className="font-mono">{formatearFecha(fechaRetorno)}</span>
                </div>
              </div>

              <p className="text-xs font-semibold uppercase text-primario mb-2">
                Verificación de accesorios
              </p>
              {accesorios.map((accesorio, index) => (
                <label
                  key={accesorio.nombre}
                  className={
                    'flex items-center gap-2 border rounded px-3 py-2 mb-2 cursor-pointer ' +
                    (accesorio.devuelto
                      ? 'border-borde'
                      : 'border-red-300 bg-red-50')
                  }
                >
                  <input
                    type="checkbox"
                    checked={accesorio.devuelto}
                    onChange={() => marcarAccesorio(index)}
                  />
                  <span>{accesorio.nombre}</span>
                  {!accesorio.devuelto && (
                    <span className="ml-auto text-peligro text-sm">faltante</span>
                  )}
                </label>
              ))}

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div>
                  <p className="text-xs font-semibold uppercase mb-2">Estado de retorno</p>
                  {['Sin novedades', 'Con daños', 'Faltantes'].map((opcion) => (
                    <label key={opcion} className="block text-sm mb-2">
                      <input
                        type="radio"
                        name="estadoRetorno"
                        checked={estadoRetorno === opcion}
                        onChange={() => cambiarEstado(opcion)}
                      />{' '}
                      {opcion}
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-2">
                    Fecha de retorno
                  </label>
                  <input
                    type="date"
                    value={fechaRetorno}
                    onChange={(e) => setFechaRetorno(e.target.value)}
                    className="w-full border border-borde rounded px-3 py-2"
                  />
                </div>
              </div>

              {diasRetraso > 0 ? (
                <div className="bg-red-50 border-l-4 border-peligro p-3 text-sm mt-5">
                  <b>{diasRetraso} días de retraso.</b> Penalidad calculada: S/{' '}
                  {penalidad.toFixed(2)} (S/ 15.00 por día). La cuenta quedará bloqueada
                  hasta regularizar.
                </div>
              ) : (
                <div className="bg-green-50 border-l-4 border-exito p-3 text-sm mt-5">
                  Devolución a tiempo · 0 días de retraso. Sin penalidad. La unidad{' '}
                  <span className="font-mono">{PRESTAMO_DEMO.unidad}</span> vuelve al estado «Disponible».
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setMostrarRenovacion(true)}
                  className="border border-primario text-primario px-4 py-2 rounded min-h-10"
                >
                  Renovar préstamo
                </button>
                <button
                  type="button"
                  onClick={cancelar}
                  className="border border-borde px-4 py-2 rounded min-h-10"
                >
                  Cancelar
                </button>
                {estadoRetorno === 'Sin novedades' && (
                  <button
                    type="button"
                    onClick={guardarDevolucion}
                    className="bg-primario text-white px-4 py-2 rounded min-h-10"
                  >
                    Registrar devolución
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        {encontrado && estadoRetorno !== 'Sin novedades' && (
          <section className="bg-white border border-borde rounded p-6 h-fit">
            <h2 className="text-xl font-semibold mb-1">Registrar daños o faltantes</h2>
            <p className="text-sm text-gris mb-5">
              Paso siguiente cuando el retorno no es «sin novedades».
            </p>

            <label className="block text-xs font-semibold uppercase mb-1">
              Descripción del daño
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full border border-borde rounded px-3 py-2 mb-4"
              placeholder="Describe el daño encontrado..."
            />

            <p className="text-xs font-semibold uppercase mb-2">Accesorios faltantes</p>
            <div className="border border-borde rounded p-3 mb-4 bg-gray-50">
              {accesorios.map((accesorio, index) => (
                <label key={accesorio.nombre} className="block text-sm mb-2 last:mb-0">
                  <input
                    type="checkbox"
                    checked={!accesorio.devuelto}
                    onChange={() => marcarAccesorio(index)}
                  />{' '}
                  {accesorio.nombre}
                </label>
              ))}
            </div>

            <label className="block text-xs font-semibold uppercase mb-1">
              Fotografía del daño
            </label>
            <div className="border border-borde bg-gray-50 rounded h-32 flex items-center justify-center text-gris text-sm mb-4">
              fotografía del daño
            </div>

            <label className="flex items-center gap-2 mb-4 text-sm">
              <input
                type="checkbox"
                checked={mantenimiento}
                onChange={(e) => setMantenimiento(e.target.checked)}
              />
              Derivar la unidad a mantenimiento
            </label>

            {mantenimiento && (
              <div className="bg-amber-50 border-l-4 border-acento p-3 text-sm mb-5">
                La unidad <span className="font-mono">{PRESTAMO_DEMO.unidad}</span> pasará a
                «En mantenimiento» y la disponibilidad del equipo bajará de 1 a 0 unidades libres.
                Hay 1 reserva del 22/09/2026 que deberá reasignarse.
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelar}
                className="border border-borde px-4 py-2 rounded min-h-10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarDevolucion}
                className="bg-primario text-white px-4 py-2 rounded min-h-10"
              >
                Guardar y cerrar devolución
              </button>
            </div>
          </section>
        )}
      </div>

      {mostrarRenovacion && (
        <Renovacion
          prestamo={PRESTAMO_DEMO.codigo}
          equipo={PRESTAMO_DEMO.equipo}
          unidad={PRESTAMO_DEMO.unidad}
          fechaActual="21/09/2026"
          fechaNueva="26/09/2026"
          admiteRenovacion={true}
          haySolicitudEnEspera={false}
          onClose={() => setMostrarRenovacion(false)}
          onConfirm={() => {
            setMostrarRenovacion(false);
            setMensaje(
              `Renovación registrada para ${PRESTAMO_DEMO.codigo}. Nueva fecha de devolución: 26/09/2026.`
            );
          }}
        />
      )}
    </PanelEncargado>
  );
}
