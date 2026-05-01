
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {ventanilla_registro_unico} = require('../../querys/buscar/unico_documento_registro')
let {ventanilla_registros2_unico} = require('../../querys/buscar/unico_documento_estado')
let {ventanilla_registros3_unico} = require('../../querys/buscar/unico_documento_confirmado')

async function almventanilla_filtrado(socket,alm,tipo,contenido){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        // const segunda_llamada=await obtenerpromesa_ventanilla_consulta(primera_llamada,socket,alm);
        const segunda_llamada= await consulta1(primera_llamada,socket,alm,tipo,contenido);
        const tercera_llamada= await obtenerpromesa_conexion();
        const cuarta_llamada= await consulta2(tercera_llamada,socket,alm,tipo,contenido);
        const quinta_llamada= await obtenerpromesa_conexion();
        const sexta_llamada= await consulta3(quinta_llamada,socket,alm,tipo,contenido);
        console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,socket,alm,tipo,contenido){ return new Promise((resolve,reject)=>ventanilla_registro_unico(resolve,reject,conexion,socket,alm,tipo,contenido)) }

function consulta2(conexion,socket,alm,tipo,contenido){ return new Promise((resolve,reject)=>ventanilla_registros2_unico(resolve,reject,conexion,socket,alm,tipo,contenido)) }

function consulta3(conexion,socket,alm,tipo,contenido){ return new Promise((resolve,reject)=>ventanilla_registros3_unico(resolve,reject,conexion,socket,alm,tipo,contenido)) }

module.exports={almventanilla_filtrado}