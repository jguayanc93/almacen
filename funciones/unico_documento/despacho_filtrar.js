
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {despacho_registro_filtrado} = require('../../querys/buscar/unico_documento_despacho_venideros')
let {despacho_recolectado_filtrado} = require('../../querys/buscar/unico_documento_despacho_check')
let {despacho_embalado_filtrado} = require('../../querys/buscar/unico_documento_despacho_embalar')

async function despacho_filtrado(socket,alm,salida,ndoc){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        // const segunda_llamada=await obtenerpromesa_ventanilla_consulta(primera_llamada,socket,alm);
        const segunda_llamada= await consulta1(primera_llamada,socket,alm,salida,ndoc);
        const tercera_llamada= await obtenerpromesa_conexion();
        const cuarta_llamada= await consulta2(tercera_llamada,socket,alm,salida,ndoc);
        const quinta_llamada= await obtenerpromesa_conexion();
        const sexta_llamada= await consulta3(quinta_llamada,socket,alm,salida,ndoc);
        console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,socket,alm,salida,ndoc){ return new Promise((resolve,reject)=>despacho_registro_filtrado(resolve,reject,conexion,socket,alm,salida,ndoc)) }

function consulta2(conexion,socket,alm,salida,ndoc){ return new Promise((resolve,reject)=>despacho_recolectado_filtrado(resolve,reject,conexion,socket,alm,salida,ndoc)) }

function consulta3(conexion,socket,alm,salida,ndoc){ return new Promise((resolve,reject)=>despacho_embalado_filtrado(resolve,reject,conexion,socket,alm,salida,ndoc)) }

module.exports={despacho_filtrado}