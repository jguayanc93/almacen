
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {identificar_zona_filtrado} = require('../../querys/buscar/unico_documento_zona_lista')
let {listar_impresos_filtrado} = require('../../querys/buscar/unico_documento_zona_impresos')
let {listar_picking_filtrado} = require('../../querys/buscar/unico_documento_zona_picking')

async function zona_filtrado_documento(socket,zona,ndoc){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        // const segunda_llamada=await obtenerpromesa_ventanilla_consulta(primera_llamada,socket,alm);
        const segunda_llamada= await consulta1(primera_llamada,socket,zona,ndoc);
        const tercera_llamada= await obtenerpromesa_conexion();
        const cuarta_llamada= await consulta2(tercera_llamada,socket,zona,ndoc);
        const quinta_llamada= await obtenerpromesa_conexion();
        const sexta_llamada= await consulta3(quinta_llamada,socket,zona,ndoc);
        console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,socket,zona,ndoc){ return new Promise((resolve,reject)=>identificar_zona_filtrado(resolve,reject,conexion,socket,zona,ndoc)) }

function consulta2(conexion,socket,zona,ndoc){ return new Promise((resolve,reject)=>listar_impresos_filtrado(resolve,reject,conexion,socket,zona,ndoc)) }

function consulta3(conexion,socket,zona,ndoc){ return new Promise((resolve,reject)=>listar_picking_filtrado(resolve,reject,conexion,socket,zona,ndoc)) }

module.exports={zona_filtrado_documento}