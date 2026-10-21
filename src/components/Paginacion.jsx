export default function Paginacion({ pagina, paginas, onCambiar }) {
  if (paginas <= 1) return null;
  return (
    <nav aria-label="Paginación" className="flex justify-end items-center gap-3 my-4">
      <button disabled={pagina === 1} onClick={() => onCambiar(pagina - 1)} className="border border-borde rounded px-3 py-2 disabled:opacity-40">Anterior</button>
      <span>Página {pagina} de {paginas}</span>
      <button disabled={pagina === paginas} onClick={() => onCambiar(pagina + 1)} className="border border-borde rounded px-3 py-2 disabled:opacity-40">Siguiente</button>
    </nav>
  );
}
