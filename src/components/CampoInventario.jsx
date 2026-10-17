// children es el input, select o textarea que colocamos dentro de este componente.
export default function CampoInventario({ id, etiqueta, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase mb-1">{etiqueta}</label>
      {children}
      {error && <p id={`${id}-error`} role="alert" className="text-peligro text-sm mt-1">{error}</p>}
    </div>
  );
}
