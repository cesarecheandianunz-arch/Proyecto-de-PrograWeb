export function correoInstitucional(correo) {
  const valor = correo.trim().toLowerCase();
  return valor.split('@').length === 2 && valor.split('@')[0].length > 0 && !valor.includes(' ') && (valor.endsWith('@aloe.ulima.edu.pe') || valor.endsWith('@ulima.edu.pe'));
}

export function passwordValida(password) {
  let mayuscula = false;
  let numero = false;
  for (const letra of password) {
    if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(letra)) mayuscula = true;
    if ('0123456789'.includes(letra)) numero = true;
  }
  return password.length >= 8 && mayuscula && numero;
}

export function validarPerfil(datos) {
  const errores = {};
  if (!datos.nombres.trim()) errores.nombres = 'Ingresa los nombres.';
  if (!datos.apellidos.trim()) errores.apellidos = 'Ingresa los apellidos.';
  if (!datos.carrera) errores.carrera = 'Selecciona una carrera.';
  if (!Number.isInteger(Number(datos.ciclo)) || Number(datos.ciclo) < 1 || Number(datos.ciclo) > 12) errores.ciclo = 'Selecciona un ciclo válido.';
  if (datos.celular) {
    let valido = datos.celular.length === 9;
    for (const digito of datos.celular) {
      if (!'0123456789'.includes(digito)) valido = false;
    }
    if (!valido) errores.celular = 'Ingresa nueve dígitos.';
  }
  return errores;
}

export function validarRegistro(datos, tipo) {
  let errores = {};
  if (tipo === 'estudiante') errores = validarPerfil(datos);
  else {
    if (!datos.nombres.trim()) errores.nombres = 'Ingresa los nombres.';
    if (!datos.apellidos.trim()) errores.apellidos = 'Ingresa los apellidos.';
    if (!datos.almacen) errores.almacen = 'Selecciona un almacén.';
  }
  const correo = datos.correo.trim().toLowerCase();
  if (!correoInstitucional(correo)) errores.correo = 'Ingresa un correo institucional válido.';
  else if (tipo === 'estudiante' && !correo.endsWith('@aloe.ulima.edu.pe')) errores.correo = 'Usa tu correo @aloe.ulima.edu.pe.';
  else if (tipo === 'encargado' && !correo.endsWith('@ulima.edu.pe')) errores.correo = 'Usa tu correo @ulima.edu.pe.';
  if (!passwordValida(datos.password)) errores.password = 'Mínimo ocho caracteres, una mayúscula y un número.';
  if (datos.password !== datos.confirmar) errores.confirmar = 'Las contraseñas no coinciden.';
  if (tipo === 'estudiante' && !datos.acepta) errores.acepta = 'Acepta el reglamento para continuar.';
  return errores;
}
