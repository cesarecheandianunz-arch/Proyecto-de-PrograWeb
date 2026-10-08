// Etiqueta de color según el estado (de unidad o de solicitud)
const colores = {
  Disponible: 'text-exito border-green-300 bg-green-50',
  Aprobada: 'text-exito border-green-300 bg-green-50',
  Prestada: 'text-info border-blue-300 bg-blue-50',
  Enviada: 'text-info border-blue-300 bg-blue-50',
  Mantenimiento: 'text-alerta border-amber-300 bg-amber-50',
  Rechazada: 'text-peligro border-red-300 bg-red-50',
  Entregada: 'text-white border-primario bg-primario',
  Devuelta: 'text-gris border-borde bg-gray-100',
};

export default function Etiqueta({ estado }) {
  return <span className={'text-xs border rounded px-2 py-1 ' + colores[estado]}>{estado}</span>;
}
