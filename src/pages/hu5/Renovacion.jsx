export default function Renovacion({
  prestamo,
  equipo,
  unidad,
  fechaActual,
  fechaNueva,
  admiteRenovacion,
  haySolicitudEnEspera,
  motivoBloqueo = '',
  onClose,
  onConfirm,
}) {
  const bloqueada = !admiteRenovacion || haySolicitudEnEspera || motivoBloqueo !== '';
  let explicacion = motivoBloqueo;
  if (!explicacion) {
    if (!admiteRenovacion) explicacion = 'Este equipo no admite renovación.';
    else explicacion = 'Existe una solicitud en espera para este equipo.';
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-borde rounded w-full max-w-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold uppercase text-gris">5.3 · Renovación</p>
            <h2 className="text-2xl font-semibold">Renovar préstamo</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gris text-xl"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="bg-gray-50 border border-borde rounded p-4 text-sm mb-5">
          <p><span className="text-gris">Préstamo:</span> <span className="font-mono font-semibold">{prestamo}</span></p>
          <p><span className="text-gris">Equipo:</span> {equipo}</p>
          <p><span className="text-gris">Unidad:</span> <span className="font-mono">{unidad}</span></p>
          <p><span className="text-gris">Vencimiento actual:</span> {fechaActual}</p>
        </div>

        {bloqueada && (
          <div className="bg-red-50 border-l-4 border-peligro p-4 text-sm mb-5">
            <b>No es posible renovar.</b>{' '}
            {explicacion}
          </div>
        )}
        {!bloqueada && (
          <div className="bg-green-50 border-l-4 border-exito p-4 text-sm mb-5">
            El equipo admite renovación y no existen solicitudes en espera.
            <br />
            Nueva fecha propuesta: <b>{fechaNueva}</b>.
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-borde px-4 py-2 rounded min-h-10"
          >
            Cancelar
          </button>
          {!bloqueada && (
            <button
              type="button"
              onClick={onConfirm}
              className="bg-primario text-white px-4 py-2 rounded min-h-10"
            >
              Confirmar renovación
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
