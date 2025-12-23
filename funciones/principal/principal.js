
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {local_provincia_registros1} = require('../../querys/principal/local_principal_registros')
let {local_provincia_registros2} = require('../../querys/principal/local_principal_estados')
let {local_provincia_registros3} = require('../../querys/principal/local_principal_confirmados')

async function almprincipal(socket,alm){
    try{
        const primera_llamada=await obtenerpromesa_conexion();
        // const segunda_llamada=await obtenerpromesa_ventanilla_consulta(primera_llamada,socket,alm);
        const segunda_llamada= await consulta1(primera_llamada,socket,alm);
        const tercera_llamada= await obtenerpromesa_conexion();
        const cuarta_llamada= await consulta2(tercera_llamada,socket,alm);
        const quinta_llamada= await obtenerpromesa_conexion();
        const sexta_llamada= await consulta3(quinta_llamada,socket,alm);
        console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,socket,alm){ return new Promise((resolve,reject)=>local_provincia_registros1(resolve,reject,conexion,socket,alm)) }

function consulta2(conexion,socket,alm){ return new Promise((resolve,reject)=>local_provincia_registros2(resolve,reject,conexion,socket,alm)) }

function consulta3(conexion,socket,alm){ return new Promise((resolve,reject)=>local_provincia_registros3(resolve,reject,conexion,socket,alm)) }

module.exports={almprincipal}