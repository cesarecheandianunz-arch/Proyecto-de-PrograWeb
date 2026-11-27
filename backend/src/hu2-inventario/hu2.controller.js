
import { prisma } from "../lib/prisma.js";



function calcularDisponibilidad(equipo){
    const disponibles = equipo.unidades.filter(
        (unidad)=> unidad.estado ==='DISPONIBLE'
    );
    const prestadas = equipo.unidades.filter(
        (unidad )=> unidad.estado === 'PRESTADA'
    );
    const mantenimiento= equipo.unidades.filter(
        (unidad) => unidad.estado === 'MANTENIMIENTO'
    );
    const bajas = equipo.unidades.filter(
        (unidad) => unidad.estado === 'BAJA'
        );
    return{
            ...equipo,
            total: equipo.unidades.length,
            libres:disponibles.length,
            prestadas: prestadas.length,
            mantenimiento: mantenimiento.length,
            baja: bajas.length
        };
}
// GET: obtener todos los equipos de la base de datos
export async function obtenerEquipos(req, res) {
   
// Obtener los filtros enviados por el cliente
const { buscar, categoria } = req.query;

// Validar que los parámetros sean textos
if (
    (buscar !== undefined && typeof buscar !== 'string') ||
    (categoria !== undefined && typeof categoria !== 'string')
) {
    return res.status(400).json({
        error: 'Filtros inválidos'
    });
}

// Crear un objeto vacío para almacenar las condiciones
const where = {};

// Si el usuario escribió algo en el buscador
if (buscar) {

    where.OR = [
        { nombre: { contains: buscar, mode: 'insensitive' } },
        { marca: { contains: buscar, mode: 'insensitive' } },
        { modelo: { contains: buscar, mode: 'insensitive' } }
    ];
}

// Si el usuario seleccionó una categoría
if (categoria) {

    where.categoria = {
        nombre: {
            equals: categoria,
            mode: 'insensitive'
        }
    };
}

    // Consultar todos los registros del modelo Equipo
    const equipos = await prisma.equipo.findMany({
        where:where,
        include: {
            // Include permite obtener las relaciones del modelo
            categoria: {
                select: {nombre:true}
            },
            // Recuperar únicamente el estado de cada unidad
            unidades: {
                select: {estado:true}
            }
        }
    });


    // Map: recorrer los equipos y generar un nuevo arreglo
    const resultado = equipos.map((equipo) => {
        return calcularDisponibilidad(equipo);
    });

    // Devolver el resultado en formato JSON
    // HTTP 200: petición realizada correctamente
    return res.status(200).json(resultado);
}

export async function obtenerEquipoPorId(req,res){
    const id = Number(req.params.id);
    if(!Number.isInteger(id)|| id<=0 || id >2147483647){
        return res.status(400).json({error: 'ID invalido'});
    }
    //buscar el equipo mediante una clave primaria 
    const equipo = await prisma.equipo.findUnique(
        {
            where: {id: id},
            include :{
                categoria :{
                    select : {nombre: true}
                },
                unidades: {
                    select: {estado: true}
                }
            }

        });
        //si el equipo no existe, tiene que devolver un error 404
        if(!equipo){
            return res.status(404).json({error: ' Equipo no encontrado '});
        }
        const resultado = calcularDisponibilidad(equipo);
        //devolver equipo encontrado en formato JSON
        return res.status(200).json(resultado);
}
//GET: obtener todas las categorias de la base de datos posgress
export async function obtenerCategorias(req,res){
    //consultar las categorias y ordenarlas alfabeticamente
    const categorias = await prisma.categoria.findMany(
        {orderBy:{nombre:'asc'}}
    );
    //devolver en formato JSON
    return res.status(200).json(categorias);
}
//POST : REGISTRAR UN NUEVO EQUIPO IMPORTANTISIMO 
export async function crearEquipo(req,res){
    //primero comprobar que se llego a recibir un objeto JSON
    if(!req.body || typeof req.body!== 'object' || Array.isArray(req.body)){
        return res.status(400).json({error: 'datos invalidados '});
    }
    //obtener los datos enviados por el cliente 
    const{
        nombre,marca,modelo,descripcion = '', categoriaId,
        fotografias=[],
        accesorios = [],
        requiereAutorizacion= false,
        permiteRenovacion=false,
        duracionDias,
        penalidadDiaria
    }=req.body;

    if(
        typeof nombre!== 'string' || !nombre.trim()||
        typeof marca !== 'string' || !marca.trim()||
        typeof modelo !== 'string' || !modelo.trim()
    ){
        return res.status(400).json({error: 'Nombre, marca y modelo son obligatorios de llenar'})
    }
    //validar categoria y duracion
    if (
        !Number.isInteger(categoriaId) ||
        categoriaId <= 0 ||
        categoriaId > 2147483647 ||
        !Number.isInteger(duracionDias) ||
        duracionDias <= 0 ||
        duracionDias > 2147483647
    ) {
        return res.status(400).json({
            error: 'Categoría o duración inválida'
        });
    }

    // Validar penalidad diaria
    if (
        !Number.isFinite(penalidadDiaria) ||
        penalidadDiaria < 0 ||
        penalidadDiaria > 999999.99 ||
        Number(penalidadDiaria.toFixed(2)) !== penalidadDiaria
    ) {
        return res.status(400).json({
            error: 'Penalidad inválida'
        });
    }
        // Validar descripción, arreglos y booleanos
    if (
        typeof descripcion !== 'string' ||
        !Array.isArray(fotografias) ||
        !fotografias.every((foto) => typeof foto === 'string') ||
        !Array.isArray(accesorios) ||
        !accesorios.every((accesorio) => typeof accesorio === 'string') ||
        typeof requiereAutorizacion !== 'boolean' ||
        typeof permiteRenovacion !== 'boolean'
    ) {
        return res.status(400).json({
            error: 'Tipos de datos incorrectos'
        });
    }

        // Comprobar que la categoría exista
    const categoria = await prisma.categoria.findUnique({
        where: { id: categoriaId }
    });

    if (!categoria) {
        return res.status(400).json({
            error: 'La categoría no existe'
        });
    }

    





}
