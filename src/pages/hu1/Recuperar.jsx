import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';

// Recuperar contraseña en 3 pasos
export default function Recuperar() {
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [nueva, setNueva] = useState('');

  return (
    <Pagina tipo="publico">
      <div className="max-w-md mx-auto bg-white border border-borde rounded p-8 mt-8">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <span key={n} className={'w-7 h-7 rounded-full grid place-items-center text-sm ' + (n === paso ? 'bg-primario text-white' : 'border border-borde text-gris')}>
              {n}
            </span>
          ))}
        </div>

        {paso === 1 && (
          <>
            <h1 className="text-2xl font-semibold">Recupera tu acceso</h1>
            <p className="text-gris mb-4">Te enviaremos un enlace para crear una contraseña nueva.</p>
            <label className="block text-xs font-semibold uppercase mb-1">Correo institucional</label>
            <input value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full border border-borde rounded px-3 py-2 mb-4" placeholder="nombre@aloe.ulima.edu.pe" />
            <button onClick={() => setPaso(2)} className="w-full bg-primario text-white py-2 rounded">Enviar enlace</button>
            <Link to="/login" className="block text-center text-primario text-sm mt-4">Volver al inicio de sesión</Link>
          </>
        )}

        {paso === 2 && (
          <div className="text-center">
            <p className="text-3xl">✉</p>
            <h1 className="text-2xl font-semibold">Revisa tu correo</h1>
            <p className="text-gris mb-4">Enviamos el enlace a {correo}.</p>
            <button onClick={() => setPaso(3)} className="w-full bg-primario text-white py-2 rounded">Abrir enlace</button>
          </div>
        )}

        {paso === 3 && (
          <>
            <h1 className="text-2xl font-semibold mb-4">Nueva contraseña</h1>
            <label className="block text-xs font-semibold uppercase mb-1">Nueva contraseña</label>
            <input type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} className="w-full border border-borde rounded px-3 py-2 mb-2" />
            <p className="text-sm text-gris mb-4">{nueva.length >= 8 ? 'Segura' : 'Muy corta'}</p>
            <Link to="/login" className="block text-center w-full bg-primario text-white py-2 rounded">Guardar contraseña</Link>
          </>
        )}
      </div>
    </Pagina>
  );
}
