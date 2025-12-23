
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {identificar_zona} = require('../../querys/zonas/zona_lista_documentos')
let {listar_impresos} = require('../../querys/zonas/zona_lista_impresos')
let {listar_picking} = require('../../querys/zonas/zona_lista_picking')

async function zonaseleccion(socket,alm){
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

function consulta1(conexion,socket,alm){ return new Promise((resolve,reject)=>identificar_zona(resolve,reject,conexion,socket,alm)) }

function consulta2(conexion,socket,alm){ return new Promise((resolve,reject)=>listar_impresos(resolve,reject,conexion,socket,alm)) }

function consulta3(conexion,socket,alm){ return new Promise((resolve,reject)=>listar_picking(resolve,reject,conexion,socket,alm)) }

module.exports={zonaseleccion}