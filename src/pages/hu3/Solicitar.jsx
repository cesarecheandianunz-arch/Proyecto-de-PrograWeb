import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import { equipos, cursos } from '../../datos';

export default function Solicitar() {
  const { id } = useParams();
  const equipo = equipos.find((e) => e.id === Number(id)) || equipos[0];
  const navigate = useNavigate();

  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [curso, setCurso] = useState('');
  const [motivo, setMotivo] = useState('');
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState('');

  // Días entre las dos fechas
  let dias = 0;
  if (inicio !== '' && fin !== '') {
    dias = (new Date(fin) - new Date(inicio)) / (1000 * 60 * 60 * 24);
  }

  function enviar() {
    if (dias > equipo.duracion) {
      setError('Duración excedida: ' + dias + ' días solicitados y el máximo es ' + equipo.duracion + '.');
      return;
    }
    if (inicio === '' || fin === '' || curso === '' || motivo === '' || !acepto) {
      setError('Completa todos los campos y acepta las condiciones.');
      return;
    }
    alert('Solicitud enviada. El encargado responderá en 24 horas.');
    navigate('/mis-solicitudes');
  }

  return (
    <Pagina tipo="estudiante">
      <p className="text-sm text-gris">Catálogo / {equipo.nombre} / Solicitar préstamo</p>
      <h1 className="text-3xl font-semibold mb-6">Solicitar préstamo</h1>
      {error && <p className="bg-red-50 border border-red-300 text-peligro p-3 rounded mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-borde rounded p-6">
          <h2 className="text-xs font-semibold uppercase text-primario border-b border-borde pb-2 mb-4">Fechas del préstamo</h2>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Fecha de inicio</label>
              <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Fecha de devolución</label>
              <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Duración</label>
              <p className={'font-mono py-2 ' + (dias > equipo.duracion ? 'text-peligro' : '')}>{dias} de {equipo.duracion} días</p>
            </div>
          </div>
          <p className="text-xs text-gris mb-6">La duración máxima de este equipo es de {equipo.duracion} días calendario.</p>

          <h2 className="text-xs font-semibold uppercase text-primario border-b border-borde pb-2 mb-4">Justificación</h2>
          <label className="block text-xs font-semibold uppercase mb-1">Curso asociado</label>
          <select value={curso} onChange={(e) => setCurso(e.target.value)} className="w-full border border-borde rounded px-3 py-2 mb-4">
            <option value="">Selecciona el curso</option>
            {cursos.map((c) => <option key={c}>{c}</option>)}
          </select>
          <label className="block text-xs font-semibold uppercase mb-1">Motivo de la solicitud</label>
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows="4" className="w-full border border-borde rounded px-3 py-2" />

          <div className="flex justify-end gap-2 mt-6">
            <Link to={'/catalogo/' + equipo.id} className="border border-primario text-primario px-4 py-2 rounded">Cancelar</Link>
            <button onClick={enviar} className="bg-primario text-white px-4 py-2 rounded">Enviar solicitud</button>
          </div>
        </div>

        <div className="bg-white border border-borde rounded p-6 h-fit">
          <p className="font-semibold">{equipo.nombre}</p>
          <p className="text-sm text-gris mb-4">{equipo.marca} · {equipo.libres} de {equipo.total} unidades libres</p>
          <p className="text-xs font-semibold uppercase text-gris mb-1">Condiciones que aceptas</p>
          <p className="text-sm mb-4">Devolución antes de las 19:00 en el Almacén H-102 · verificación de accesorios · penalidad de S/ 15.00 por día de retraso.</p>
          <label className="text-sm"><input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} /> Acepto las condiciones del préstamo.</label>
        </div>
      </div>
    </Pagina>
  );
}
