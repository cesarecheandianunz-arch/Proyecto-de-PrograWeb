import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import CampoInventario from '../../components/CampoInventario';
import { useInventario } from '../../context/InventarioContext';
import { usePrestamos } from '../../context/PrestamosContext';
import { useCuenta } from '../../context/CuentaContext';
import { cursos } from '../../datos';
import { hoyISO, diasEntre, unidadesDisponibles } from '../../utils/prestamos';

export default function Solicitar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { equiposConConteo, unidades } = useInventario();
  const { solicitudes, prestamos, crearSolicitud } = usePrestamos();
  const { estudiante } = useCuenta();
  const equipo = equiposConConteo.find((e) => e.id === Number(id));
  const [inicio, setInicio] = useState(hoyISO());
  const [fin, setFin] = useState('');
  const [curso, setCurso] = useState('');
  const [motivo, setMotivo] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  if (!equipo) return <Pagina tipo="estudiante"><p>Equipo no encontrado.</p><Link to="/catalogo">Volver al catálogo</Link></Pagina>;
  const disponibles = unidadesDisponibles(equipo.id, inicio, fin, unidades, solicitudes, prestamos);
  let duracion = 'Selecciona las fechas';
  if (inicio && fin) duracion = diasEntre(inicio, fin) + ' de ' + equipo.duracion + ' días';

  function enviarSolicitud(evento) {
    evento.preventDefault();
    const resultado = crearSolicitud({ equipoId: equipo.id, estudianteId: estudiante.id, inicio, fin, curso, motivo, acepta });
    setErrores(resultado.errores || {});
    if (resultado.error) { setMensaje(resultado.error); return; }
    navigate('/mis-solicitudes', { state: { mensaje: 'Solicitud ' + resultado.codigo + ' enviada correctamente.' } });
  }

  return (
    <Pagina tipo="estudiante">
      <p className="text-sm text-gris mb-4">Catálogo / {equipo.nombre} / Solicitar préstamo</p>
      <h1 className="text-3xl font-semibold mb-6">Solicitar préstamo</h1>
      {mensaje && <p role="alert" className="bg-red-50 p-3 mb-4">{mensaje}</p>}
      <form onSubmit={enviarSolicitud} noValidate className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-borde rounded p-6 space-y-4">
          <h2 className="font-semibold">Fechas del préstamo</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <CampoInventario id="inicio" etiqueta="Fecha de inicio" error={errores.inicio}>
              <input
                id="inicio"
                type="date"
                min={hoyISO()}
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                className="w-full border border-borde rounded px-3 py-2"
                aria-invalid={Boolean(errores.inicio)}
              />
            </CampoInventario>
            <CampoInventario id="fin" etiqueta="Fecha de devolución" error={errores.fin}>
              <input
                id="fin"
                type="date"
                min={inicio}
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                className="w-full border border-borde rounded px-3 py-2"
                aria-invalid={Boolean(errores.fin)}
              />
            </CampoInventario>
          </div>
          <p>Duración: {duracion}. Máximo {equipo.duracion} días calendario.</p>
          {errores.disponibilidad && <p role="alert" className="text-peligro">{errores.disponibilidad}</p>}
          <CampoInventario id="curso" etiqueta="Curso asociado" error={errores.curso}>
            <select
              id="curso"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              className="w-full border border-borde rounded px-3 py-2"
              aria-invalid={Boolean(errores.curso)}
            >
              <option value="">Selecciona un curso</option>
              {cursos.map((actual) => <option key={actual}>{actual}</option>)}
            </select>
          </CampoInventario>
          <CampoInventario id="motivo" etiqueta="Motivo de la solicitud" error={errores.motivo}>
            <textarea
              id="motivo"
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full border border-borde rounded px-3 py-2"
              aria-invalid={Boolean(errores.motivo)}
            />
          </CampoInventario>
          <p className="text-sm text-gris">Mínimo 20 caracteres. El encargado lo verá al evaluar tu solicitud.</p>
          <div className="flex justify-end gap-3">
            <Link to={`/catalogo/${id}`} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</Link>
            <button type="submit" className="bg-primario text-white px-4 py-2 rounded">Enviar solicitud</button>
          </div>
        </div>
        <aside className="bg-white border border-borde rounded p-6 space-y-4 self-start">
          <h2 className="text-xl font-semibold">{equipo.nombre}</h2>
          <p>{equipo.marca} · {equipo.libres} de {equipo.total} unidades libres hoy.</p>
          {inicio && fin && <p>{disponibles.length} unidades disponibles en el rango seleccionado.</p>}
          <h3 className="font-semibold">Condiciones que aceptas</h3>
          <p>Recojo y devolución en Almacén H-102 antes de las 19:00. Verificación de accesorios en la entrega y el retorno. Penalidad de S/ {Number(equipo.penalidad ?? 15).toFixed(2)} por día de retraso.</p>
          {equipo.autorizacion && <p>Requiere autorización del docente.</p>}
          {equipo.renovacion && <p>Admite una renovación, sujeta a disponibilidad.</p>}
          {!equipo.renovacion && <p>No admite renovación.</p>}
          <CampoInventario id="acepta" etiqueta="Aceptación" error={errores.acepta}>
            <label className="flex items-start gap-2"><input id="acepta" type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} /> Acepto las condiciones del préstamo.</label>
          </CampoInventario>
        </aside>
      </form>
    </Pagina>
  );
}
