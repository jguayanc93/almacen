
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {ventanilla_registros} = require('../../querys/ventanilla/ventanilla_registros')
let {ventanilla_registros2} = require('../../querys/ventanilla/ventanilla_estados')
let {ventanilla_registros3} = require('../../querys/ventanilla/ventanilla_confirmados')

async function almventanilla(socket,alm){
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

function consulta1(conexion,socket,alm){ return new Promise((resolve,reject)=>ventanilla_registros(resolve,reject,conexion,socket,alm)) }

function consulta2(conexion,socket,alm){ return new Promise((resolve,reject)=>ventanilla_registros2(resolve,reject,conexion,socket,alm)) }

function consulta3(conexion,socket,alm){ return new Promise((resolve,reject)=>ventanilla_registros3(resolve,reject,conexion,socket,alm)) }

module.exports={almventanilla}