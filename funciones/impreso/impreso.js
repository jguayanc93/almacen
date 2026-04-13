
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {busqueda_usuario} = require('../../querys/personal/user_pass')
let {documento_estado_impreso} = require('../../querys/impreso/imprimir')
let {nuevos_registros} = require('../../querys/impreso/doc_cabecera')
let {nuevos_registros2} = require('../../querys/impreso/doc_detallado')
const { leer_file, br_generador, ultimobuffer, emitir_documento } = require('../../documento_estado_impreso')

async function estado_impreso(ndoc,zona,user){
    try{
        ////saber el usuario que imprimio
        const primera_llamada=await obtenerpromesa_conexion();
        const segunda_llamada= await consulta1(primera_llamada,user);
        ////conocer 
        const tercera_llamada= await obtenerpromesa_conexion();
        const cuarta_llamada= await consulta2(tercera_llamada,socket,ndoc,zona,alm,segunda_llamada);
        const quinta_llamada= await leer_file();
        const sexta_llamada= await br_generador(ndoc);
        const setima_llamada= await obtenerpromesa_conexion();
        const octava_llamada= await consulta3(setima_llamada,ndoc,quinta_llamada,sexta_llamada);
        const novena_llamada= await obtenerpromesa_conexion();
        const decima_llamada= await consulta4(novena_llamada);
        
        const onceava_llamada= await ultimobuffer(decima_llamada);
        await emitir_documento(socket,onceava_llamada,ndoc);
        console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,socket,alm){ return new Promise((resolve,reject)=>busqueda_usuario(resolve,reject,conexion,socket,alm)) }

function consulta2(conexion,socket,alm){ return new Promise((resolve,reject)=>documento_estado_impreso(resolve,reject,conexion,socket,alm)) }

function consulta3(conexion,socket,alm){ return new Promise((resolve,reject)=>nuevos_registros(resolve,reject,conexion,socket,alm)) }

function consulta4(conexion,socket,alm){ return new Promise((resolve,reject)=>nuevos_registros2(resolve,reject,conexion,socket,alm)) }

module.exports={estado_impreso}