import { useState, useEffect } from 'react';
import PanelEncargado from '../../components/PanelEncargado';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePrestamos } from '../../context/PrestamosContext';
import { hoyISO, mostrarFecha, diasEntre } from '../../utils/prestamos';
import SelectorFotos from '../../components/SelectorFotos';

export default function Devolucion() {
  const { codigo: codigoRuta } = useParams();
  const navigate = useNavigate();
  const { prestamos, registrarDevolucion } = usePrestamos();
  const [codigo, setCodigo] = useState(codigoRuta || '');
  const [cargado, setCargado] = useState('');
  const [encontrado, setEncontrado] = useState(false);
  const [accesorios, setAccesorios] = useState([]);
  const [estadoRetorno, setEstadoRetorno] = useState('Sin novedades');
  const [fechaRetorno, setFechaRetorno] = useState(hoyISO());
  const [descripcion, setDescripcion] = useState('');
  const [mantenimiento, setMantenimiento] = useState(false);
  const [foto, setFoto] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const prestamo = prestamos.find((p) => p.codigo === cargado);
  let prestamoActual = {};
  let diasRetraso = 0;
  let penalidad = 0;
  if (prestamo) {
    prestamoActual = { ...prestamo, fechaPactada: prestamo.fin, fechaPactadaTexto: mostrarFecha(prestamo.fin) };
    diasRetraso = Math.max(0, diasEntre(prestamo.fin, fechaRetorno) || 0);
    penalidad = diasRetraso * prestamo.tarifa;
  }
  const faltantes = accesorios.filter((a) => !a.devuelto);

  function cargarPrestamo(valor) {
    const actual = prestamos.find((p) => p.codigo === valor.trim().toUpperCase() && p.estado === 'Activo');
    if (!actual) { setEncontrado(false); setError('No encontramos un préstamo activo con ese código. Selecciona uno desde «Préstamos vigentes».'); return; }
    setCargado(actual.codigo);
    setCodigo(actual.codigo);
    setAccesorios(actual.accesorios.filter((a) => a.entregado).map((a) => ({ nombre: a.nombre, devuelto: true })));
    setEncontrado(true);
    setEstadoRetorno('Sin novedades');
    setFechaRetorno(hoyISO());
    setDescripcion('');
    setMantenimiento(false);
    setFoto('');
    setError('');
    setMensaje('');
  }
  useEffect(() => {
    if (codigoRuta) cargarPrestamo(codigoRuta);
    else { setEncontrado(false); setCodigo(''); }
  }, [codigoRuta]);

  function buscarPrestamo() { cargarPrestamo(codigo); }
  function marcarAccesorio(index) {
    setAccesorios((actuales) => actuales.map((accesorio, i) => {
      if (i === index) return { ...accesorio, devuelto: !accesorio.devuelto };
      return accesorio;
    }));
    setError('');
  }
  function cancelar() { navigate('/encargado/prestamos'); }
  function guardarDevolucion() {
    const resultado = registrarDevolucion(cargado, { fecha: fechaRetorno, estadoRetorno, accesorios, descripcion, mantenimiento, foto });
    if (resultado.error) { setError(resultado.error); return; }
    setError('');
    setMensaje('Devolución registrada. ' + resultado.calculo.retraso + ' días de retraso. Penalidad: S/ ' + resultado.calculo.penalidad.toFixed(2) + '. El inventario y el historial fueron actualizados.');
    setEncontrado(false);
  }

  function claseAccesorio(devuelto) {
    if (devuelto) return 'border-borde';
    return 'border-red-300 bg-red-50';
  }

  function cambiarEstado(opcion) {
    setEstadoRetorno(opcion);
    if (opcion === 'Con daños') setMantenimiento(true);
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

      <Link to="/encargado/prestamos" className="inline-block text-primario underline mb-4">← Préstamos vigentes</Link>
      {!encontrado && <Link to="/encargado/historial" className="inline-block text-primario underline ml-4">Consultar historial</Link>}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white border border-borde rounded p-6">
          <h2 className="text-xl font-semibold mb-1">Devolución de equipo</h2>
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
                  <p>{prestamoActual.estudiante}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gris">Equipo y unidad</p>
                  <p>
                    {prestamoActual.equipo} ·{' '}
                    <span className="font-mono">{prestamoActual.unidad}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gris">Devolución pactada</p>
                  <span className="font-mono">{prestamoActual.fechaPactadaTexto}</span>
                </div>
                <div>
                  <p className="text-xs uppercase text-gris">Retorno real</p>
                  <span className="font-mono">{mostrarFecha(fechaRetorno)}</span>
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
                    claseAccesorio(accesorio.devuelto)
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

              {diasRetraso > 0 && (
                <div className="bg-red-50 border-l-4 border-peligro p-3 text-sm mt-5">
                  <b>{diasRetraso} días de retraso.</b> Penalidad calculada: S/{' '}
                  {penalidad.toFixed(2)} (S/ {Number(prestamoActual.tarifa || 0).toFixed(2)} por día). La cuenta quedará bloqueada
                  hasta regularizar.
                </div>
              )}
              {diasRetraso === 0 && (
                <div className="bg-green-50 border-l-4 border-exito p-3 text-sm mt-5">
                  Devolución a tiempo · 0 días de retraso. Sin penalidad. La unidad{' '}
                  <span className="font-mono">{prestamoActual.unidad}</span> se actualizará al guardar la devolución.
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => navigate('/encargado/prestamos')}
                  className="border border-primario text-primario px-4 py-2 rounded min-h-10"
                >
                  Ver préstamos y renovaciones
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
              {foto && <img src={foto} alt="Fotografía del daño" className="w-full h-full object-contain" />}
                {!foto && <span>Sin fotografía adjunta</span>}
            </div>

            <SelectorFotos onAgregar={setFoto} onError={setError} />
            <label className="flex items-center gap-2 mb-4 text-sm">
              <input
                type="checkbox"
                checked={mantenimiento}
                disabled={estadoRetorno === 'Con daños'}
                onChange={(e) => setMantenimiento(e.target.checked)}
              />
              Derivar la unidad a mantenimiento
            </label>

            {mantenimiento && (
              <div className="bg-amber-50 border-l-4 border-acento p-3 text-sm mb-5">
                La unidad <span className="font-mono">{prestamoActual.unidad}</span> pasará a
                «Mantenimiento» y no podrá volver a prestarse hasta su reparación.
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


    </PanelEncargado>
  );
}
