import { useState } from 'react';

export default function SelectorFotos({ onAgregar, onError }) {
  const [leyendo, setLeyendo] = useState(false);

  function leerArchivos(archivos) {
    if (leyendo || archivos.length === 0) return;
    if (archivos.length > 3) { onError('Selecciona como máximo tres imágenes por vez.'); return; }
    for (const archivo of archivos) {
      if (archivo.type !== 'image/jpeg' && archivo.type !== 'image/png') { onError('Solo se admiten imágenes JPG o PNG.'); return; }
      if (archivo.size > 600000) { onError('Cada imagen debe pesar como máximo 600 KB para conservarla en el navegador.'); return; }
    }
    setLeyendo(true);
    onError('');
    let pendientes = archivos.length;
    for (const archivo of archivos) {
      // Extra del navegador: FileReader lee el archivo como texto base64.
      // Al terminar llama a onload; no usamos async/await ni librerías nuevas.
      const lector = new FileReader();
      lector.onload = () => {
        onAgregar(lector.result);
        pendientes -= 1;
        if (pendientes === 0) setLeyendo(false);
      };
      lector.onerror = () => {
        onError('No se pudo leer una imagen. Selecciónala nuevamente.');
        pendientes -= 1;
        if (pendientes === 0) setLeyendo(false);
      };
      lector.readAsDataURL(archivo);
    }
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); leerArchivos(e.dataTransfer.files); }}
      className="border-2 border-dashed border-borde rounded p-5 text-center space-y-2"
    >
      <p>Arrastra fotografías JPG o PNG aquí</p>
      <label className="inline-block cursor-pointer text-primario underline">
        Seleccionar fotografías
        <input
          type="file"
          accept="image/jpeg,image/png"
          multiple
          disabled={leyendo}
          className="block max-w-full mt-2 text-sm"
          onChange={(e) => { leerArchivos(e.target.files); e.target.value = ''; }}
        />
      </label>
      <p className="text-xs text-gris">Máximo 600 KB por imagen. Encuadre cuadrado recomendado.</p>
      {leyendo && <p role="status">Leyendo fotografías…</p>}
    </div>
  );
}
