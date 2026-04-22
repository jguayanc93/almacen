
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {local_provincia_registrosmm1} = require('../../querys/mym/local_mym_registros')
let {local_provincia_registrosmm2} = require('../../querys/mym/local_mym_estados')
let {local_provincia_registrosmm3} = require('../../querys/mym/local_mym_confirmados')

async function almmym(socket,alm,salida){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        // const segunda_llamada=await obtenerpromesa_ventanilla_consulta(primera_llamada,socket,alm);
        const segunda_llamada= await consulta1(primera_llamada,socket,alm,salida);
        const tercera_llamada= await obtenerpromesa_conexion();
        const cuarta_llamada= await consulta2(tercera_llamada,socket,alm,salida);
        const quinta_llamada= await obtenerpromesa_conexion();
        const sexta_llamada= await consulta3(quinta_llamada,socket,alm,salida);
        console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,socket,alm,salida){ return new Promise((resolve,reject)=>local_provincia_registrosmm1(resolve,reject,conexion,socket,alm,salida)) }

function consulta2(conexion,socket,alm,salida){ return new Promise((resolve,reject)=>local_provincia_registrosmm2(resolve,reject,conexion,socket,alm,salida)) }

function consulta3(conexion,socket,alm,salida){ return new Promise((resolve,reject)=>local_provincia_registrosmm3(resolve,reject,conexion,socket,alm,salida)) }

module.exports={almmym}