import React, { useState } from 'react';
import { Search, ShoppingBag, ArrowRight, CheckCircle, X, SlidersHorizontal } from 'lucide-react';

export default function CatalogoSolicitud({ datosIniciales = [], onCrearSolicitud }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [motivoSolicitud, setMotivoSolicitud] = useState("");
  const [solicitudEnviada, setSolicitudEnviada] = useState(false);

  const equipos = datosIniciales.length > 0 ? datosIniciales : [
    { id: 1, codigo: "EQ-SRV-001", nombre: "Servidor Rack Dell PowerEdge", categoria: "Servidores", estado: "Disponible", serial: "SV98234XYZ" },
    { id: 2, codigo: "EQ-LAP-042", nombre: "Laptop Lenovo ThinkPad T14", categoria: "Portátiles", estado: "Disponible", serial: "TP88412ABC" },
    { id: 3, codigo: "EQ-NET-012", nombre: "Switch Cisco Catalyst 2960", categoria: "Redes", estado: "Mantenimiento", serial: "CS55219NET" },
    { id: 4, codigo: "EQ-PER-005", nombre: "Monitor UltraWide LG 34\"", categoria: "Periféricos", estado: "Disponible", serial: "LG77321MON" },
  ];

  const categorias = ["Todos", "Portátiles", "Servidores", "Redes", "Periféricos"];

  const equiposFiltrados = equipos.filter(eq => {
    const coincideTexto = eq.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          eq.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = categoriaSeleccionada === "Todos" || eq.categoria === categoriaSeleccionada;
    return coincideTexto && coincideCat;
  });

  const manejarSolicitud = (e) => {
    e.preventDefault();
    if (!equipoSeleccionado || !motivoSolicitud) return;

    const nuevaSolicitud = {
      id: Date.now(),
      equipoId: equipoSeleccionado.id,
      equipoNombre: equipoSeleccionado.nombre,
      codigo: equipoSeleccionado.codigo,
      motivo: motivoSolicitud,
      fecha: new Date().toLocaleDateString(),
      estado: "Pendiente de aprobación"
    };

    if (onCrearSolicitud) {
      onCrearSolicitud(nuevaSolicitud);
    }

    setSolicitudEnviada(true);
    setTimeout(() => {
      setSolicitudEnviada(false);
      setEquipoSeleccionado(null);
      setMotivoSolicitud("");
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Cabecera de la HU-3 */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" /> HU-3: Catálogo y Solicitud de Equipos
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore el inventario tecnológico disponible y genere solicitudes de reserva temporal para sus prácticas.
        </p>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500" 
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categorias.map(cat => (
            <button 
              key={cat} 
              onClick={() => setCategoriaSeleccionada(cat)} 
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                categoriaSeleccionada === cat 
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/10' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cuadrícula de Equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equiposFiltrados.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 bg-slate-800/20 rounded-xl border border-slate-800">
            No se encontraron equipos en esta categoría o búsqueda.
          </div>
        ) : (
          equiposFiltrados.map(eq => (
            <div key={eq.id} className="bg-slate-800/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    {eq.codigo}
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    eq.estado === 'Disponible' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {eq.estado}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-100 text-lg mb-1">{eq.nombre}</h3>
                <p className="text-xs text-slate-400 mb-4">Categoría: {eq.categoria}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">SN: {eq.serial}</span>
                <button 
                  disabled={eq.estado !== 'Disponible'} 
                  onClick={() => setEquipoSeleccionado(eq)} 
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    eq.estado === 'Disponible' 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold shadow-md shadow-emerald-500/10' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Solicitar <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Solicitud */}
      {equipoSeleccionado && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button 
              onClick={() => setEquipoSeleccionado(null)} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {solicitudEnviada ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-100">¡Solicitud Registrada con Éxito!</h3>
                <p className="text-sm text-slate-400">Su petición ha sido enviada para la aprobación del encargado.</p>
              </div>
            ) : (
              <form onSubmit={manejarSolicitud} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-1">Solicitar Préstamo</h3>
                  <p className="text-xs text-slate-400">Estás solicitando el equipo: <span className="text-emerald-400 font-semibold">{equipoSeleccionado.nombre}</span></p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Motivo del Préstamo / Proyecto</label>
                  <textarea 
                    rows="3" 
                    required 
                    placeholder="Ej. Requerido para prácticas del laboratorio..." 
                    value={motivoSolicitud} 
                    onChange={(e) => setMotivoSolicitud(e.target.value)} 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setEquipoSeleccionado(null)} 
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/10 cursor-pointer"
                  >
                    Confirmar Solicitud
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
