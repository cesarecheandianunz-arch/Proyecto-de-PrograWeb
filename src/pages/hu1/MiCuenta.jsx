import { useState } from 'react';
import Pagina from '../../components/Pagina';
import { carreras } from '../../datos';

export default function MiCuenta() {
  const [nombres, setNombres] = useState('Renzo Andrés');
  const [apellidos, setApellidos] = useState('Mendoza Cárdenas');
  const [carrera, setCarrera] = useState('Ingeniería Electrónica');
  const [celular, setCelular] = useState('987654321');
  const [mensaje, setMensaje] = useState('');

  return (
    <Pagina tipo="estudiante">
      <h1 className="text-3xl font-semibold mb-6">Mi cuenta</h1>
      {mensaje && <p className="bg-green-50 border border-green-300 text-exito p-3 rounded mb-4">{mensaje}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-borde rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Datos personales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Nombres</label>
              <input value={nombres} onChange={(e) => setNombres(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Apellidos</label>
              <input value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Carrera</label>
              <select value={carrera} onChange={(e) => setCarrera(e.target.value)} className="w-full border border-borde rounded px-3 py-2">
                {carreras.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Celular</label>
              <input value={celular} onChange={(e) => setCelular(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Correo institucional</label>
              <input value="rmendoza@aloe.ulima.edu.pe" disabled className="w-full border border-borde rounded px-3 py-2 bg-gray-100 text-gris" />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={() => setMensaje('Datos actualizados.')} className="bg-primario text-white px-4 py-2 rounded">Guardar cambios</button>
          </div>
        </div>

        <div className="bg-white border border-borde rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>
          <input type="password" placeholder="Contraseña actual" className="w-full border border-borde rounded px-3 py-2 mb-3" />
          <input type="password" placeholder="Nueva" className="w-full border border-borde rounded px-3 py-2 mb-3" />
          <input type="password" placeholder="Confirmar" className="w-full border border-borde rounded px-3 py-2 mb-3" />
          <button onClick={() => setMensaje('Contraseña actualizada.')} className="w-full bg-primario text-white py-2 rounded">Actualizar contraseña</button>
        </div>
      </div>
    </Pagina>
  );
}
