import test from 'node:test';
import assert from 'node:assert/strict';
import { contarUnidades, estadosPermitidos, validarUnidad, validarCondiciones, validarEquipo, impedimentoEliminar } from '../src/pages/hu2/inventarioUtils.js';

const equipo = { id: 1, nombre: 'Osciloscopio', marca: 'Tektronix', modelo: 'TBS', categoria: 'Medición', descripcion: '', fotografias: [] };
const unidades = [
  { equipoId: 1, codigo: 'INV-001', estado: 'Disponible', prestamo: '—' },
  { equipoId: 1, codigo: 'INV-002', estado: 'Prestada', prestamo: 'PRE-001' },
  { equipoId: 1, codigo: 'INV-003', estado: 'Mantenimiento', prestamo: '—' },
  { equipoId: 1, codigo: 'INV-004', estado: 'Dada de baja', prestamo: '—' },
  { equipoId: 2, codigo: 'OTRO-001', estado: 'Disponible', prestamo: '—' },
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
    if (unidad.codigo === 'INV-001') {
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
  assert.ok(validarUnidad(' inv-001 ', 'Almacén', unidades).codigo);
  assert.ok(validarUnidad('otro-001', 'Almacén', unidades).codigo);
  assert.deepEqual(validarUnidad('NUEVO', 'Almacén', unidades), {});
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

test('eliminar: protege préstamos, solicitudes e historial asociado', () => {
  assert.ok(impedimentoEliminar(equipo, unidades, [], []));
  const sinPrestadas = unidades.filter((unidad) => unidad.estado !== 'Prestada');
  assert.ok(impedimentoEliminar(equipo, sinPrestadas, [{ equipo: equipo.nombre }], []));
  assert.ok(impedimentoEliminar(equipo, sinPrestadas, [], [{ unidad: 'INV-001' }]));
  assert.equal(impedimentoEliminar(equipo, sinPrestadas, [], []), '');
  assert.equal(impedimentoEliminar(equipo, [], [{ equipo: 'Otro' }], [{ unidad: 'OTRO-001' }]), '');
});
