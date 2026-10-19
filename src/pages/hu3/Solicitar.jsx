import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import { equipos } from '../../datos';

export default function Solicitar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const equipo = equipos.find((e) => e.id === Number(id));

  const [curso, setCurso] = useState('Programación Web');
  const [motivo, setMotivo] = useState('');

  if (!equipo) {
    return <Pagina tipo="estudiante"><p>Equipo no encontrado.</p></Pagina>;
  }

  function enviarSolicitud(e) {
    e.preventDefault();
    alert('¡Solicitud enviada con éxito para ' + equipo.nombre + '!');
    navigate('/mis-solicitudes');
  }

  return (
    <Pagina tipo="estudiante">
      <p className="text-sm text-gris mb-4">Catálogo / {equipo.categoria} / {equipo.nombre} / Solicitar</p>
      
      <div className="max-w-xl bg-white border border-borde rounded p-6">
        <h1 className="text-2xl font-semibold mb-2">Solicitar préstamo de equipo</h1>
        <p className="text-gris text-sm mb-6">Estás solicitando: <b>{equipo.nombre}</b> ({equipo.marca} {equipo.modelo})</p>

        <form onSubmit={enviarSolicitud} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gris mb-1">Curso o proyecto</label>
            <input 
              type="text" 
              value={curso} 
              onChange={(e) => setCurso(e.target.value)} 
              className="w-full border border-borde rounded px-3 py-2 text-sm bg-gray-50"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gris mb-1">Motivo del uso</label>
            <textarea 
              rows="4" 
              value={motivo} 
              onChange={(e) => setMotivo(e.target.value)} 
              placeholder="Explica brevemente para qué necesitas el equipo..." 
              className="w-full border border-borde rounded px-3 py-2 text-sm"
              required
            ></textarea>
          </div>

          <div className="bg-primario-suave p-4 rounded text-sm">
            <p><b>Nota importante:</b> El recojo se realiza en el almacén presentando tu carné universitario vigente.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => window.history.back()} 
              className="px-4 py-2 border border-borde rounded text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primario text-white rounded text-sm font-semibold"
            >
              Enviar solicitud
            </button>
          </div>
        </form>
      </div>
    </Pagina>
  );
}
