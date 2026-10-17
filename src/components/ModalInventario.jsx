import { useEffect, useRef } from 'react';

export default function ModalInventario({ titulo, onCerrar, children }) {
  // Extra de React: useRef guarda la referencia al elemento <dialog>.
  // Cambiar una referencia no vuelve a dibujar la pantalla como hace useState.
  const dialogo = useRef(null);

  useEffect(() => {
    const elemento = dialogo.current;
    // Extra de HTML: abre el diálogo y mantiene el foco dentro de él.
    elemento.showModal();
    // Cerramos el diálogo cuando React retira este componente de la pantalla.
    return () => {
      elemento.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogo}
      aria-label={titulo}
      onCancel={onCerrar}
      className="m-auto w-[calc(100%_-_2rem)] max-w-lg max-h-[90vh] overflow-y-auto rounded border border-borde p-6 backdrop:bg-black/40"
    >
      <h2 className="text-xl font-semibold mb-4">{titulo}</h2>
      {children}
    </dialog>
  );
}
