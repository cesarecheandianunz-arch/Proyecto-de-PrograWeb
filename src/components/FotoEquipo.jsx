import { useState } from 'react';

export default function FotoEquipo({ url, nombre }) {
  const [fallida, setFallida] = useState(null);

  if (url && fallida !== url) {
    return (
      <img
        src={url}
        alt={nombre}
        onError={() => setFallida(url)}
        className="w-full h-full object-cover"
      />
    );
  } else {
    return (
      <span className="text-xs text-gris p-2">Sin fotografía disponible</span>
    );
  }
}
