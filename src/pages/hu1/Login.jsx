import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function ingresar() {
    if (correo === '' || password === '') {
      setError('Completa tu correo y contraseña.');
      return;
    }
    // Por ahora no hay backend: si es correo de personal va al panel, si no al catálogo
    if (correo.endsWith('@ulima.edu.pe') && !correo.endsWith('@aloe.ulima.edu.pe')) {
      navigate('/encargado/inventario');
    } else {
      navigate('/catalogo');
    }
  }

  return (
    <Pagina tipo="publico">
      <div className="max-w-md mx-auto bg-white border border-borde rounded p-8 mt-8">
        <h1 className="text-2xl font-semibold">Inicia sesión</h1>
        <p className="text-gris mb-6">Usa tu correo institucional para solicitar y seguir tus préstamos.</p>

        {error && <p className="bg-red-50 border border-red-300 text-peligro text-sm p-3 rounded mb-4">{error}</p>}

        <label className="block text-xs font-semibold uppercase mb-1">Correo institucional</label>
        <input
          className="w-full border border-borde rounded px-3 py-2 mb-4"
          placeholder="tucorreo@aloe.ulima.edu.pe"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <label className="block text-xs font-semibold uppercase mb-1">Contraseña</label>
        <input
          type="password"
          className="w-full border border-borde rounded px-3 py-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between text-sm mb-4">
          <label><input type="checkbox" /> Recordarme</label>
          <Link to="/recuperar" className="text-primario">¿Olvidaste tu contraseña?</Link>
        </div>

        <button onClick={ingresar} className="w-full bg-primario text-white py-2 rounded">Ingresar</button>
        <p className="text-center text-sm text-gris mt-4">
          ¿No tienes cuenta? <Link to="/registro" className="text-primario">Crear cuenta</Link>
        </p>
      </div>
    </Pagina>
  );
}
