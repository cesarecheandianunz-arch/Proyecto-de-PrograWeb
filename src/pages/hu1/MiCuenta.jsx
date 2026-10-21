import { useState } from 'react';
import Pagina from '../../components/Pagina';
import { carreras } from '../../datos';
import { useCuenta } from '../../context/CuentaContext';
import { usePrestamos } from '../../context/PrestamosContext';
import { validarPerfil, passwordValida } from '../../utils/cuenta';

export default function MiCuenta() {
  const { estudiante } = useCuenta();
  const { actualizarEstudiante } = usePrestamos();
  const partes = estudiante.nombre.split(' ');
  const [nombres, setNombres] = useState(estudiante.nombres || partes[0]);
  const [apellidos, setApellidos] = useState(estudiante.apellidos || partes.slice(1).join(' '));
  const [carrera, setCarrera] = useState(estudiante.carrera);
  const [celular, setCelular] = useState(estudiante.celular || '');
  const [mensaje, setMensaje] = useState('');
  const [ciclo, setCiclo] = useState(estudiante.ciclo);
  const [errores, setErrores] = useState({});
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  function guardarPerfil() {
    const encontrados = validarPerfil({ nombres, apellidos, carrera, ciclo, celular });
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) { setMensaje('Revisa los campos marcados.'); return; }
    actualizarEstudiante(estudiante.id, { nombres: nombres.trim(), apellidos: apellidos.trim(), nombre: nombres.trim() + ' ' + apellidos.trim(), carrera, ciclo, celular });
    setMensaje('Datos actualizados y guardados.');
  }
  function cambiarPassword() {
    if (!actual) { setErrores({ actual: 'Ingresa la contraseña actual.' }); return; }
    if (!passwordValida(nueva)) { setErrores({ nueva: 'Mínimo ocho caracteres, una mayúscula y un número.' }); return; }
    if (nueva !== confirmar) { setErrores({ confirmar: 'Las contraseñas no coinciden.' }); return; }
    setErrores({}); setActual(''); setNueva(''); setConfirmar('');
    setMensaje('Formulario de cambio de contraseña validado.');
  }

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
              {errores.nombres && <p role="alert" className="text-peligro text-sm">{errores.nombres}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Apellidos</label>
              <input value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
              {errores.apellidos && <p role="alert" className="text-peligro text-sm">{errores.apellidos}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Carrera</label>
              <select value={carrera} onChange={(e) => setCarrera(e.target.value)} className="w-full border border-borde rounded px-3 py-2">
                {carreras.map((c) => <option key={c}>{c}</option>)}
              </select>
          {errores.carrera && <p role="alert" className="text-peligro text-sm">{errores.carrera}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Celular</label>
              <input value={celular} onChange={(e) => setCelular(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
              {errores.celular && <p role="alert" className="text-peligro text-sm">{errores.celular}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase mb-1">Correo institucional</label>
              <input value={estudiante.correo} disabled className="w-full border border-borde rounded px-3 py-2 bg-gray-100 text-gris" />
            </div>
          </div>
          <label className="block text-sm mt-4">Ciclo <select value={ciclo} onChange={(e) => setCiclo(e.target.value)} className="border border-borde rounded p-2 ml-3">{[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
          {errores.ciclo && <p role="alert" className="text-peligro text-sm">{errores.ciclo}</p>}
          <div className="flex justify-end mt-6">
            <button onClick={guardarPerfil} className="bg-primario text-white px-4 py-2 rounded">Guardar cambios</button>
          </div>
        </div>

        <div className="bg-white border border-borde rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Cambiar contraseña</h2>
          <input
            type="password"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            placeholder="Contraseña actual"
            className="w-full border border-borde rounded px-3 py-2 mb-3"
          />
              {errores.actual && <p role="alert" className="text-peligro text-sm">{errores.actual}</p>}
          <input
            type="password"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            placeholder="Nueva"
            className="w-full border border-borde rounded px-3 py-2 mb-3"
          />
              {errores.nueva && <p role="alert" className="text-peligro text-sm">{errores.nueva}</p>}
          <input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            placeholder="Confirmar"
            className="w-full border border-borde rounded px-3 py-2 mb-3"
          />
              {errores.confirmar && <p role="alert" className="text-peligro text-sm">{errores.confirmar}</p>}
          <button onClick={cambiarPassword} className="w-full bg-primario text-white py-2 rounded">Actualizar contraseña</button>
        </div>
      </div>
    </Pagina>
  );
}
