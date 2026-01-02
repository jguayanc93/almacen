
const {conn} = require('../../conexion/cnn')
////espacio para las consultas necesarias
let {} = require('../../querys/ventanilla/ventanilla_registros')
let {busqueda_usuario} = require('../../querys/personal/user_pass')
let {documento_estado_impreso} = require('../../querys/impreso/imprimir')
let {} = require('../../querys/impreso')
const { leer_file, br_generador } = require('../../documento_estado_impreso')

async function estado_impreso(ndoc,zona,user){
    try{
        ////saber el usuario que imprimio
        const primera_llamada=await obtenerpromesa_conexion();
        const segunda_llamada= await consulta1(primera_llamada,socket,alm);
        ////conocer 
        const tercera_llamada= await obtenerpromesa_conexion();
        const cuarta_llamada= await consulta2(tercera_llamada,socket,alm);
        const quinta_llamada= await leer_file();
        const sexta_llamada= await br_generador();
        const setima_llamada= await obtenerpromesa_conexion();
        const octava_llamada= await consulta3();
        const novena_llamada= await obtenerpromesa_conexion();
        const decima_llamada= await consulta4();
        // const sexta_llamada= await consulta3(quinta_llamada,socket,alm);
        console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
    //////////////////////////
    try{
        /////////PARTE PARA SACAR EL USUARIO ACEPTADO
        const llamada=await obtenerpromesa_usuario();
        const persona=await obtenerpromesa_usuario_consulta(llamada,user);
        ///////////////////////////
        const primera_llamada=await obtenerpromesa_impresion();
        const segunda_llamada=await obtenerpromesa_impresion_consulta(primera_llamada,io,socket,ndoc,zona,persona);
        const tercera_llamada=await leer_file();//////LECTURA SOLO PARA REVISAR EL CONTENIDO VACIO
        const cuarta_llamada=await br_generador(ndoc);///GENERAR EL CODIGO BARRAS
        const quinta_llamada=await obtenerpromesa_factura_datos();////LLAMADA DE CONEXION PARA LOS DATOS DE LA FACTURA
        const sexta_llamada=await obtenerpromesa_factura_datos_consulta(quinta_llamada,ndoc,tercera_llamada,cuarta_llamada);
        const setima_llamada=await obtenerpromesa_factura_datos()////LLAMADA DE CONEXION PARA LOS DATOS DE LA FACTURA SEGUNDA PARTE
        const terminar_consulta2=await obtenerpromesa_factura_datos_consulta2(setima_llamada,ndoc,sexta_llamada);
        ////LLAMADA DE GENERACION DE PDF POR 1 INSTANTE
        const colgar_llamada=await ultimobuffer(terminar_consulta2)
        await emitir_documento(socket,colgar_llamada,ndoc);
    }
    catch(error){ console.log(error);}
}

function obtenerpromesa_conexion(){ return new Promise((resolve,reject)=>conn(resolve,reject)) }

function consulta1(conexion,socket,alm){ return new Promise((resolve,reject)=>busqueda_usuario(resolve,reject,conexion,socket,alm)) }

function consulta2(conexion,socket,alm){ return new Promise((resolve,reject)=>documento_estado_impreso(resolve,reject,conexion,socket,alm)) }

function consulta3(conexion,socket,alm){ return new Promise((resolve,reject)=>(resolve,reject,conexion,socket,alm)) }

function consulta4(conexion,socket,alm){ return new Promise((resolve,reject)=>(resolve,reject,conexion,socket,alm)) }

module.exports={estado_impreso}