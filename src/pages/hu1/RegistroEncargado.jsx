import { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagina from '../../components/Pagina';

export default function RegistroEncargado() {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [almacen, setAlmacen] = useState('Almacén H-102');
  const [anexo, setAnexo] = useState('');
  const [enviado, setEnviado] = useState(false);

  return (
    <Pagina tipo="publico">
      <div className="max-w-3xl mx-auto bg-white border border-borde rounded p-8">
        <h1 className="text-2xl font-semibold">Registro de encargado de almacén</h1>
        <p className="text-gris mb-6">El alta queda pendiente hasta que el jefe de laboratorio la apruebe. Solo correos @ulima.edu.pe.</p>

        {enviado && (
          <p className="bg-green-50 border border-green-300 text-exito p-3 rounded mb-4">
            Registro enviado para {nombres} {apellidos}. Queda en estado «Pendiente de aprobación».
          </p>
        )}

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
            <label className="block text-xs font-semibold uppercase mb-1">Correo institucional</label>
            <input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="nombre@ulima.edu.pe" className="w-full border border-borde rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-borde rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Almacén asignado</label>
            <select value={almacen} onChange={(e) => setAlmacen(e.target.value)} className="w-full border border-borde rounded px-3 py-2">
              <option>Almacén H-102</option>
              <option>Almacén N-005</option>
              <option>Laboratorio de Electrónica H-210</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase mb-1">Anexo telefónico</label>
            <input value={anexo} onChange={(e) => setAnexo(e.target.value)} className="w-full border border-borde rounded px-3 py-2 font-mono" />
          </div>
        </div>

        <p className="bg-amber-50 border border-amber-300 text-sm p-3 rounded mt-6">
          La cuenta se crea en estado «Pendiente de aprobación». Hasta entonces no podrá aprobar solicitudes.
        </p>

        <div className="flex justify-end gap-2 mt-6">
          <Link to="/" className="border border-primario text-primario px-4 py-2 rounded">Cancelar</Link>
          <button onClick={() => setEnviado(true)} className="bg-primario text-white px-4 py-2 rounded">Registrar encargado</button>
        </div>
      </div>
    </Pagina>
  );
}
