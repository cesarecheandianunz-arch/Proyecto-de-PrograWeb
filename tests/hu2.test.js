import test from 'node:test';
import assert from 'node:assert/strict';
import { contarUnidades, estadosPermitidos, validarUnidad, validarCondiciones, validarEquipo, impedimentoEliminar, codigoInventarioValido } from '../src/pages/hu2/inventarioUtils.js';

const equipo = { id: 1, nombre: 'Osciloscopio', marca: 'Tektronix', modelo: 'TBS', categoria: 'Medición', descripcion: '', fotografias: [] };
const unidades = [
  { equipoId: 1, codigo: 'INV-OSC-0001', estado: 'Disponible', prestamo: '—' },
  { equipoId: 1, codigo: 'INV-OSC-0002', estado: 'Prestada', prestamo: 'PRE-001' },
  { equipoId: 1, codigo: 'INV-OSC-0003', estado: 'Mantenimiento', prestamo: '—' },
  { equipoId: 1, codigo: 'INV-OSC-0004', estado: 'Dada de baja', prestamo: '—' },
  { equipoId: 2, codigo: 'INV-CAM-0001', estado: 'Disponible', prestamo: '—' },
];

test('cuenta solo las unidades del equipo y reemplaza contadores antiguos', () => {
  const conteo = contarUnidades({ ...equipo, total: 99, libres: 99 }, unidades);
  assert.equal(conteo.total, 4);
  assert.equal(conteo.libres, 1);
  assert.equal(conteo.prestadas, 1);
  assert.equal(conteo.mantenimiento, 1);
  assert.equal(conteo.baja, 1);
  assert.equal(contarUnidades({ id: 3 }, unidades).total, 0);
});

test('cambiar una unidad a mantenimiento actualiza la disponibilidad', () => {
  const actualizadas = unidades.map((unidad) => {
    if (unidad.codigo === 'INV-OSC-0001') {
      return { ...unidad, estado: 'Mantenimiento' };
    } else {
      return unidad;
    }
  });
  assert.equal(contarUnidades(equipo, actualizadas).libres, 0);
  assert.equal(contarUnidades(equipo, actualizadas).mantenimiento, 2);
  assert.equal(unidades[0].estado, 'Disponible');
});

test('detecta códigos duplicados aunque cambien mayúsculas, espacios o equipo', () => {
  assert.equal(validarUnidad(' inv-osc-0001 ', 'Almacén', unidades).codigo, 'Este código ya está registrado en el inventario.');
  assert.equal(validarUnidad('inv-cam-0001', 'Almacén', unidades).codigo, 'Este código ya está registrado en el inventario.');
  assert.deepEqual(validarUnidad('INV-OSC-0047', 'Almacén', unidades), {});
});

test('rechaza los campos de unidad vacíos', () => {
  assert.deepEqual(Object.keys(validarUnidad(' ', ' ', unidades)), ['codigo', 'ubicacion']);
});

test('las transiciones manuales no saltan la entrega ni la devolución', () => {
  assert.deepEqual(estadosPermitidos(unidades[0]), ['Mantenimiento', 'Dada de baja']);
  assert.deepEqual(estadosPermitidos(unidades[1]), []);
  assert.deepEqual(estadosPermitidos(unidades[2]), ['Disponible', 'Dada de baja']);
  assert.deepEqual(estadosPermitidos(unidades[3]), []);
  assert.deepEqual(estadosPermitidos({ estado: 'Disponible', prestamo: 'PRE-001' }), []);
  assert.deepEqual(estadosPermitidos({ estado: 'Prestada', prestamo: '—' }), []);
});

test('duración: solo acepta días enteros positivos y finitos', () => {
  for (const duracion of ['', ' ', 0, -1, 1.5, 'abc', Infinity]) assert.ok(validarCondiciones(duracion, 15).duracion);
  assert.deepEqual(validarCondiciones('7', 15), {});
});

test('penalidad: acepta cero y decimales, rechaza negativos y valores no numéricos', () => {
  for (const penalidad of ['', ' ', -1, 'abc', Infinity]) assert.ok(validarCondiciones(7, penalidad).penalidad);
  assert.deepEqual(validarCondiciones(7, '0'), {});
  assert.deepEqual(validarCondiciones(7, '15.50'), {});
});

test('marca y modelo son únicos, pero se puede editar el equipo original', () => {
  assert.ok(validarEquipo({ ...equipo, marca: ' tektronix ', modelo: ' tbs ' }, [equipo]).modelo);
  assert.deepEqual(validarEquipo(equipo, [equipo], 1), {});
});

test('valida campos del equipo y el límite de descripción', () => {
  const errores = validarEquipo({ ...equipo, nombre: ' ', categoria: '', marca: '', modelo: '', descripcion: 'a'.repeat(401) }, []);
  for (const campo of ['nombre', 'categoria', 'marca', 'modelo', 'descripcion']) assert.ok(errores[campo]);
});

test('fotografías: enlaces opcionales con protocolo http o https', () => {
  assert.deepEqual(validarEquipo({ ...equipo, fotografias: ['https://ejemplo.com/foto.png'] }, []), {});
  for (const url of ['texto', 'javascript:alert(1)', 'file:///foto.png']) {
    assert.ok(validarEquipo({ ...equipo, fotografias: [url] }, []).fotografias);
  }
});

test('fotografías locales: admite public/img y rechaza otras rutas y archivos', () => {
  for (const url of ['/img/camara.jpg', '/img/almacen.jpeg', '/img/equipo.png', '/img/equipo.webp']) {
    assert.deepEqual(validarEquipo({ ...equipo, fotografias: [url] }, []), {});
  }
  for (const url of ['/img/../secreto.jpg', '/img/documento.html', '/otra/foto.jpg', '//otro.com/foto.jpg']) {
    assert.ok(validarEquipo({ ...equipo, fotografias: [url] }, []).fotografias);
  }
});

test('eliminar: protege préstamos, solicitudes e historial asociado', () => {
  assert.ok(impedimentoEliminar(equipo, unidades, [], []));
  const sinPrestadas = unidades.filter((unidad) => unidad.estado !== 'Prestada');
  assert.ok(impedimentoEliminar(equipo, sinPrestadas, [{ equipo: equipo.nombre }], []));
  assert.ok(impedimentoEliminar(equipo, sinPrestadas, [], [{ unidad: 'INV-OSC-0001' }]));
  assert.equal(impedimentoEliminar(equipo, sinPrestadas, [], []), '');
  assert.equal(impedimentoEliminar(equipo, [], [{ equipo: 'Otro' }], [{ unidad: 'INV-CAM-0001' }]), '');
});


test('código: acepta el formato del mockup y normaliza mayúsculas y espacios externos', () => {
  for (const codigo of ['INV-OSC-0047', ' inv-cam-0009 ', 'INV-AAA-0000']) {
    assert.equal(codigoInventarioValido(codigo), true);
    assert.deepEqual(validarUnidad(codigo, 'Almacén H-102', []), {});
  }
});

test('código: rechaza prefijos, longitudes, letras y números incorrectos', () => {
  const invalidos = [
    '', 'ABC', 'INV-0047', 'EQ-OSC-0047', 'INV-OS-0047', 'INV-OSCA-0047',
    'INV-OS1-0047', 'INV-ÑSC-0047', 'INV-OSC-047', 'INV-OSC-00047',
    'INV-OSC-00A7', 'INV-OSC-0047-1', 'INV-OSC-12.4', 'INV-OSC-１２３４',
  ];
  for (const codigo of invalidos) {
    assert.equal(codigoInventarioValido(codigo), false, codigo);
    assert.ok(validarUnidad(codigo, 'Almacén H-102', []).codigo, codigo);
  }
});

test('eliminar: reconoce una solicitud antigua después de renombrar el equipo', () => {
  const inicial = { id: 3, nombre: 'Kit Arduino' };
  const renombrado = { ...inicial, nombre: 'Kit Arduino Mega' };
  const solicitudesAntiguas = [{ equipo: 'Kit Arduino' }];

  assert.ok(impedimentoEliminar(renombrado, [], solicitudesAntiguas, [], [inicial]));
});

test('eliminar: reconoce referencias por ID y distingue equipos con nombres iguales', () => {
  const renombrado = { id: 3, nombre: 'Kit actualizado' };

  assert.ok(impedimentoEliminar(renombrado, [], [{ equipoId: 3, equipo: 'Nombre anterior' }], []));
  assert.ok(impedimentoEliminar(renombrado, [], [{ equipoId: '3' }], []));
  assert.equal(impedimentoEliminar(renombrado, [], [{ equipoId: 9, equipo: renombrado.nombre }], []), '');
  assert.ok(impedimentoEliminar(renombrado, [], [], [{ equipoId: 3 }]));
});
