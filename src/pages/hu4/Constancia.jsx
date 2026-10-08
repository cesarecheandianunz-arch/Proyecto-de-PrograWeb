import PanelEncargado from '../../components/PanelEncargado';

export default function Constancia() {
  return (
    <PanelEncargado>
      <div className="flex justify-between items-center max-w-3xl mb-4">
        <h1 className="text-3xl font-semibold">Constancia de entrega</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="border border-primario text-primario px-4 py-2 rounded">Descargar PDF</button>
          <button onClick={() => window.print()} className="bg-primario text-white px-4 py-2 rounded">Imprimir</button>
        </div>
      </div>

      <div className="max-w-3xl bg-white border border-borde rounded p-8">
        <div className="flex justify-between border-b-2 border-primario pb-4 mb-6">
          <div>
            <p className="text-xs uppercase text-gris">Universidad de Lima · Facultad de Ingeniería</p>
            <h2 className="text-2xl font-semibold text-primario">Constancia de entrega de equipo</h2>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-gris">Código de préstamo</p>
            <p className="font-mono font-semibold text-lg">PRE-2026-0318</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm mb-6">
          <div><p className="text-xs uppercase text-gris">Estudiante</p>Renzo Andrés Mendoza Cárdenas<p className="text-gris">Ing. Electrónica · 6.º ciclo · código 20213456</p></div>
          <div><p className="text-xs uppercase text-gris">Curso asociado</p>IN324 Laboratorio de Circuitos<p className="text-gris">Docente: Ing. Elena Rivas Talledo</p></div>
          <div><p className="text-xs uppercase text-gris">Equipo y unidad</p>Osciloscopio Tektronix TBS1052B<p className="text-gris font-mono">INV-OSC-0042 · Almacén H-102</p></div>
          <div><p className="text-xs uppercase text-gris">Fechas</p>Entrega: <span className="font-mono">16/09/2026 09:20</span><br />Devolución: <span className="font-mono">21/09/2026 19:00</span></div>
        </div>

        <table className="w-full border border-borde text-sm mb-6">
          <thead className="bg-gray-50 text-xs uppercase text-gris text-left">
            <tr><th className="p-2">Accesorio</th><th className="p-2">Entregado</th></tr>
          </thead>
          <tbody>
            <tr className="border-t border-borde"><td className="p-2">2 sondas de medición</td><td className="p-2">Sí</td></tr>
            <tr className="border-t border-borde"><td className="p-2">Cable USB</td><td className="p-2">Sí</td></tr>
            <tr className="border-t border-borde"><td className="p-2">Estuche rígido</td><td className="p-2">No</td></tr>
          </tbody>
        </table>

        <p className="text-sm">Declaro recibir el equipo en las condiciones descritas y me comprometo a devolverlo en la fecha pactada.</p>
        <div className="grid grid-cols-2 gap-12 mt-12 text-sm text-gris">
          <div className="border-t border-texto pt-1">Firma del estudiante</div>
          <div className="border-t border-texto pt-1">Firma del encargado de almacén</div>
        </div>
      </div>
    </PanelEncargado>
  );
}
