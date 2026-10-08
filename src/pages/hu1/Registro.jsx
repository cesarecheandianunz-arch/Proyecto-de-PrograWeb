import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';
import { carreras } from '../../datos';

export default function Registro() {
  const [form, setForm] = useState({ nombres: '', apellidos: '', carrera: '', ciclo: '', correo: '', password: '', confirmar: '' });
  const [mensaje, setMensaje] = useState('');

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function crearCuenta() {
    if (!form.correo.endsWith('@aloe.ulima.edu.pe')) {
      setMensaje('El correo debe terminar en @aloe.ulima.edu.pe');
      return;
    }
    if (form.password !== form.confirmar) {
      setMensaje('Las contraseñas no coinciden.');
      return;
    }
    setMensaje('ok');
  }

  return (
    <Pagina tipo="publico">
      <div className="max-w-3xl mx-auto bg-white border border-borde rounded p-8">
        <h1 className="text-2xl font-semibold">Crea tu cuenta de estudiante</h1>
        <p className="text-gris mb-6">Solo se admiten correos @aloe.ulima.edu.pe.</p>

        {mensaje === 'ok' ? (
          <p className="bg-green-50 border border-green-300 text-exito p-3 rounded mb-4">
            Cuenta creada. Enviamos un enlace de verificación a {form.correo}.
          </p>
        ) : (
          mensaje && <p className="bg-red-50 border border-red-300 text-peligro p-3 rounded mb-4">{mensaje}</p>
        )}

        <h2 className="text-xs font-semibold uppercase text-primario border-b border-borde pb-2 mb-4">Datos personales</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Nombres</label>
            <input name="nombres" value={form.nombres} onChange={cambiar} className="w-full border border-borde rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Apellidos</label>
            <input name="apellidos" value={form.apellidos} onChange={cambiar} className="w-full border border-borde rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Carrera</label>
            <select name="carrera" value={form.carrera} onChange={cambiar} className="w-full border border-borde rounded px-3 py-2">
              <option value="">Selecciona</option>
              {carreras.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Ciclo</label>
            <select name="ciclo" value={form.ciclo} onChange={cambiar} className="w-full border border-borde rounded px-3 py-2">
              <option value="">Selecciona</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <option key={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <h2 className="text-xs font-semibold uppercase text-primario border-b border-borde pb-2 mb-4">Acceso</h2>
        <label className="block text-xs font-semibold uppercase mb-1">Correo institucional</label>
        <input name="correo" value={form.correo} onChange={cambiar} placeholder="nombre@aloe.ulima.edu.pe" className="w-full border border-borde rounded px-3 py-2 mb-4" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={cambiar} className="w-full border border-borde rounded px-3 py-2" />
            <p className="text-xs text-gris mt-1">Mínimo 8 caracteres, una mayúscula y un número.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Confirmar contraseña</label>
            <input type="password" name="confirmar" value={form.confirmar} onChange={cambiar} className="w-full border border-borde rounded px-3 py-2" />
          </div>
        </div>
        <label className="text-sm"><input type="checkbox" /> Acepto el reglamento de préstamo de equipos.</label>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-borde">
          <Link to="/registro-encargado" className="text-sm text-primario">¿Eres encargado? Regístrate aquí</Link>
          <div className="flex gap-2">
            <Link to="/" className="border border-primario text-primario px-4 py-2 rounded">Cancelar</Link>
            <button onClick={crearCuenta} className="bg-primario text-white px-4 py-2 rounded">Crear cuenta</button>
          </div>
        </div>
      </div>
    </Pagina>
  );
}
