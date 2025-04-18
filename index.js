const express = require('express')
const {createServer} = require('node:http');
const {config,Connection,Request,TYPES} = require('./conexion/cadena')
const path = require('node:path');
const fs = require('fs')
const {Server} = require('socket.io')
const {mostrar_mensaje} = require('./documentos_atender')
const {obtenerpromesa_contador,obtenerpromesa_contador_consulta} = require('./documentos_nuevos');
const {documento_estado_piking,obtenerpromesa_pick,obtenerpromesa_pick_consulta,obtenerpromesa_pick_consulta_nivel2,obtenerpromesa_pick_consulta_nivel3} = require('./documento_estado_piking')
const {documento_estado_checking,obtenerpromesa_check,obtenerpromesa_check_consulta,obtenerpromesa_check_consulta2,obtenerpromesa_check_consulta3,obtenerpromesa_check_consulta4,obtenerpromesa_check_consulta5} = require('./documento_estado_checking')
const {obtenerpromesa_zona,obtenerpromesa_zona_consulta,obtenerpromesa_zona_consulta2,obtenerpromesa_zona_consulta3} = require('./zona_documentos')
const {obtenerpromesa_impresion,obtenerpromesa_impresion_consulta,documento_estado_impreso,leer_file,br_generador,br_generador2,obtenerpromesa_factura_datos,obtenerpromesa_factura_datos_consulta,obtenerpromesa_factura_datos_consulta2,generarpdfnuevo,generatepdf2,mandar_archivo,emitir_documento} = require('./documento_estado_impreso')/////MODIFICAR ESTA FUNCION DE IMPRESION
const {documento_estado_confirmado,obtenerpromesa_confirmar,obtenerpromesa_confirmar_consulta,obtenerpromesa_confirmar_consulta_nivel2} = require('./documento_estado_confirmado')
const {nuevos_documentos} = require('./documentos_receptor')
const {nuevos_documentos_dinamicos} = require('./documentos_receptor2')
const {nuevos_documentos_dinamicosmm} = require('./documentos_receptor3')
const {data} = require('./documento_informacion')
const {ventanilla_registros,obtenerpromesa_ventanilla,obtenerpromesa_ventanilla_consulta} = require('./ventanilla_documentos_nuevos')
//const {local_provincia_registros1} = require('./local_provincia_documentos_nuevos')
const {obtenerpromesa_principal,obtenerpromesa_principal_consulta} = require('./local_provincia_documentos_nuevos')
const {obtenerpromesa_mym,obtenerpromesa_mym_consulta} = require('./local_provincia_documentos_nuevos2')
const {despacho_registros,obtenerpromesa_despacho,obtenerpromesa_despacho_consulta,obtenerpromesa_despacho_consulta2,obtenerpromesa_despacho_consulta3} = require('./despacho_documentos_nuevos')
// const {ejecutar_intervalo_zona} = require('./manejador')

const app=express();
const server=createServer(app);
// const io = new Server(server)
const io = new Server(server,{
    connectionStateRecovery:{}
});
const port=8080;

app.use('/',express.static(path.join(__dirname,"cuerpo")))

io.on('connection',(socket)=>{
    let disparo=null;
    /////DESCONECCION O INTERRUPCION
    socket.on('disconnect',(razon)=>{
        // socket.leave("ZONA Z1");
        // socket.leave("ZONA Z2");
        // socket.leave("ZONA Z3");
        // socket.leave("ZONA desconocido");
        // socket.leave("ZONA VENTANILLA");
        // socket.leave("ZONA PRINCIPAL");
        // socket.leave("ZONA MYM");
        if(disparo!=null){ clearInterval(disparo);disparo=null;}
    })
    // socket.on('trae zone',async()=>{
    //     try{
    //         console.log(socket.rooms);
    //         let paquete="";
    //         socket.rooms.forEach((zone)=>{
    //             let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA desconocido','ZONA VENTANILLA','ZONA PRINCIPAL','ZONA MYM','ZONA DESPACHO'];
    //             if(cuartos.includes(zone)) paquete=zone;
    //         })
    //         socket.emit('zone traido',paquete);
    //     }
    //     catch(err){console.log(err)}
    // })
    ////CONTADOR DE REGISTROS
    socket.on('registros fecha',async (msg)=>{
        try{
            await registros(socket,msg);
        }
        catch(err){console.log(err)}

        async function registros(socket,registros){
            try{
                const primera_llamada=await obtenerpromesa_contador();
                const segunda_llamada=await obtenerpromesa_contador_consulta(primera_llamada,socket,registros);
            }
            catch(error){ console.log(error);}
        }
    })
    ////MASTER DE VENTANILLA
    socket.on('ventanilla',async (user)=>{
        //////FALTA AGREGAR LA VALIDES DEL USUARIO AL RECIBIR SUS PARAMETROS
        try{
            const observador=await zonas_limpiador();
            const grupo=await nueva_zone("VENTANILLA");
            console.log(grupo);
            // disparo=setInterval(almventanilla,2000,socket,alm);
            await almventanilla(socket,alm);
        }
        catch(err){console.log(err)}

        function zonas_limpiador(){
            return new Promise((resolve,reject)=>{
                socket.rooms.forEach((zone)=>{
                    let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA desconocido','ZONA VENTANILLA','ZONA PRINCIPAL','ZONA MYM','ZONA DESPACHO'];
                    if(cuartos.includes(zone)) socket.rooms.delete(zone);
                })
                resolve("TERMINE DE LIMPIAR LAS ZONAS SOBRANTES");
            })
        }

        function nueva_zone(zone){
            return new Promise((resolve,reject)=>{
                socket.join(`ZONA ${zone}`);
                resolve(`ingrese ala nueva zona ${zone}`);
                // resolve(socket.rooms);
            })
        }

        async function almventanilla(socket,alm){
            try{
                const primera_llamada=await obtenerpromesa_ventanilla();
                const segunda_llamada=await obtenerpromesa_ventanilla_consulta(primera_llamada,socket,alm);
                console.log(segunda_llamada);
            }
            catch(error){ console.log(error);}
        }

        // async function ejecutar_intervalov(socket,alm){
        //     const observador=await zonas_limpiador();
        //     console.log(observador);
        //     const grupo=await nueva_zone("VENTANILLA");
        //     console.log(grupo);
        //     disparo=setInterval(almventanilla,2000,socket,alm);
        //     // setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar el principal")},30000);
        // }

        // if(disparo!=null){
        //     clearInterval(disparo);
        //     disparo=null;
        //     ejecutar_intervalov(socket,user);
        // }
        // else{ ejecutar_intervalov(socket,user);}
    })
    /////MASTER DE LOCAL-PROVINCIA
    socket.on('almacen principal',async (alm)=>{
        // socket.join("ZONA PRINCIPAL");
        try{
            const observador=await zonas_limpiador();
            const grupo=await nueva_zone("PRINCIPAL");
            console.log(grupo);
            // disparo=setInterval(almprincipal,2000,socket,alm);
            await almprincipal(socket,alm);
        }
        catch(err){console.log(err)};

        function zonas_limpiador(){
            return new Promise((resolve,reject)=>{
                socket.rooms.forEach((zone)=>{
                    let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA desconocido','ZONA VENTANILLA','ZONA PRINCIPAL','ZONA MYM','ZONA DESPACHO'];
                    if(cuartos.includes(zone)) socket.rooms.delete(zone);
                })
                resolve("TERMINE DE LIMPIAR LAS ZONAS SOBRANTES");
            })
        }

        function nueva_zone(zone){
            return new Promise((resolve,reject)=>{
                socket.join(`ZONA ${zone}`);
                resolve(`ingrese ala nueva zona ${zone}`);
                // resolve(socket.rooms);
            })
        }

        async function almprincipal(socket,alm){
            try{
                const primera_llamada=await obtenerpromesa_principal();
                /////SEPARACION ENTRE LA CONEXION Y LA CONSULTA
                const segunda_llamada=await obtenerpromesa_principal_consulta(primera_llamada,socket,alm);
                console.log(segunda_llamada);
            }
            catch(error){ console.log(error);}
        }
    })

    socket.on('almacen mym',async (alm)=>{
        
        try{
            const observador=await zonas_limpiador();
            const grupo=await nueva_zone("MYM");
            console.log(grupo);
            // disparo=setInterval(almmym,2000,socket,alm);
            await almmym(socket,alm);
        }
        catch(err){console.log(err)}

        function zonas_limpiador(){
            return new Promise((resolve,reject)=>{
                socket.rooms.forEach((zone)=>{
                    let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA desconocido','ZONA VENTANILLA','ZONA PRINCIPAL','ZONA MYM','ZONA DESPACHO'];
                    if(cuartos.includes(zone)) socket.rooms.delete(zone);
                })
                resolve("TERMINE DE LIMPIAR LAS ZONAS SOBRANTES");
            })
        }

        function nueva_zone(zone){
            return new Promise((resolve,reject)=>{
                socket.join(`ZONA ${zone}`);
                resolve(`ingrese ala nueva zona ${zone}`);
                // resolve(socket.rooms);
            })
        }

        async function almmym(socket,alm){
            try{
                const primera_llamada=await obtenerpromesa_mym();
                const segunda_llamada=await obtenerpromesa_mym_consulta(primera_llamada,socket,alm);
                console.log(segunda_llamada);
                // const primera_llamada=setInterval(obtenerpromesa_principal(socket,alm),2000);
            }
            catch(error){ console.log(error);}
        }
        
    })

    socket.on('despacho',async (alm)=>{
        // socket.join("ZONA DESPACHO");
        try{
            const observador=await zonas_limpiador();
            const grupo=await nueva_zone("DESPACHO");
            await despachop(socket,alm);
        }
        catch(err){console.log(err)}

        function zonas_limpiador(){
            return new Promise((resolve,reject)=>{
                socket.rooms.forEach((zone)=>{
                    let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA desconocido','ZONA VENTANILLA','ZONA PRINCIPAL','ZONA MYM','ZONA DESPACHO'];
                    if(cuartos.includes(zone)) socket.rooms.delete(zone);
                })
                resolve("TERMINE DE LIMPIAR LAS ZONAS SOBRANTES");
            })
        }

        function nueva_zone(zone){
            return new Promise((resolve,reject)=>{
                socket.join(`ZONA ${zone}`);
                resolve(`ingrese ala nueva zona ${zone}`);
            })
        }

        async function despachop(socket,alm){
            try{
                const primera_llamada=await obtenerpromesa_despacho();
                const segunda_llamada=await obtenerpromesa_despacho_consulta(primera_llamada,socket,alm);
                console.log(segunda_llamada);
                const tercera_llamada=await obtenerpromesa_despacho();
                const cuarta_llamada=await obtenerpromesa_despacho_consulta2(tercera_llamada,socket,alm);

                const quinta_llamada=await obtenerpromesa_despacho();
                const sexta_llamada=await obtenerpromesa_despacho_consulta3(quinta_llamada,socket,alm);
            }
            catch(error){ console.log(error);}
        }
    })
    //////////////NO TE OLVIDES VALIDAR LA ZONAS Y EL CAMBIO ENTRE OPCIONES PORQE PODRIA ROMPER LA CONEXION

    socket.on('cambio zona',async (zona)=>{

        try{
            const observador=await zonas_limpiador();
            const grupo=await nueva_zone(zona);
            // disparo=setInterval(zonas,3000,socket,zona);
            await zonas(socket,zona);
        }
        catch(err){
            console.log("fui disparado por un reject");console.log(err);
        }

        function zonas_limpiador(){
            return new Promise((resolve,reject)=>{
                socket.rooms.forEach((zone)=>{
                    let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA VENTANILLA','ZONA desconocido','ZONA PRINCIPAL','ZONA MYM','ZONA DESPACHO'];
                    if(cuartos.includes(zone)) socket.rooms.delete(zone);
                })
                resolve("TERMINE DE LIMPIAR LAS ZONAS SOBRANTES");
            })
        }
        function nueva_zone(zone){
            return new Promise((resolve,reject)=>{
                socket.join(`ZONA ${zone}`);
                resolve(`ingrese ala nueva zona ${zone}`);
                // resolve(socket.rooms);
            })
        }
        async function zonas(socket,zona){
            try{
                const primera_llamada=await obtenerpromesa_zona();
                const segunda_llamada=await obtenerpromesa_zona_consulta(primera_llamada,socket,zona);
                const tercera_llamada=await obtenerpromesa_zona();///////EN TESTEO LAS MULTIPLES CONEXIONES PERO SOLO 1 PETICION POR CADA UNA
                const cuarta_llamada=await obtenerpromesa_zona_consulta2(tercera_llamada,socket,zona);
                const quinta_llamada=await obtenerpromesa_zona();
                const sexta_llamada=await obtenerpromesa_zona_consulta3(quinta_llamada,socket,zona);
            }
            catch(error){ console.log(error);}
        }
    })
    ////RECUPERAR INFORMACION SEGUN EL ESTADO DEL DOCUMENTO Y PODRIA MOSTRAR DIFERENTE INFORMACION SEGUN AVANSE
    socket.on('pedir informacion',(ndoc)=>{
        ///////FALTA CORREGIR ESTO SEGUN LA DISPOSICION DEL ALMACEN
        try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{ data(socket,ndoc) }
            });
        }
        catch(err){console.log(err)}
    })

    socket.on('estado impreso',async (ndoc,zona,user)=>{
        // async function pedir_pdf(ndoc,zona,user){
            try{
                const primera_llamada=await obtenerpromesa_impresion();
                const segunda_llamada=await obtenerpromesa_impresion_consulta(primera_llamada,io,socket,ndoc,zona,user);
                const tercera_llamada=await leer_file();//////LECTURA SOLO PARA REVISAR EL CONTENIDO VACIO
                const cuarta_llamada=await br_generador(ndoc);///GENERAR EL CODIGO BARRAS
                const quinta_llamada=await obtenerpromesa_factura_datos();////LLAMADA DE CONEXION PARA LOS DATOS DE LA FACTURA
                ///LLAMADA DE CONSULTA PARA LOS DATOS DE LA FACTURA
                const sexta_llamada=await obtenerpromesa_factura_datos_consulta(quinta_llamada,ndoc,tercera_llamada,cuarta_llamada);
                const setima_llamada=await obtenerpromesa_factura_datos()////LLAMADA DE CONEXION PARA LOS DATOS DE LA FACTURA SEGUNDA PARTE
                const terminar_consulta2=await obtenerpromesa_factura_datos_consulta2(setima_llamada,ndoc,sexta_llamada);
                ////LLAMADA DE GENERACION DE PDF POR 1 INSTANTE
                const octava_llamada=await generarpdfnuevo(terminar_consulta2);///LLAMADA DE GENERACION DE PDF NUEVO METODO EN PRUEVA
                await emitir_documento(socket,octava_llamada,ndoc);
            }
            catch(error){ console.log(error);}
        //}
    })

    socket.on('estado pick',async (ndoc,cantidad,zona,user)=>{
        try{
            const primera_llamada=await obtenerpromesa_pick();
            const segunda_llamada=await obtenerpromesa_pick_consulta(primera_llamada,ndoc,zona,user);
            const tercera_llamada=await obtenerpromesa_pick();
            const cuarta_llamada=await obtenerpromesa_pick_consulta_nivel2(tercera_llamada,io,ndoc,zona,user);
            const quinta_llamada=await obtenerpromesa_pick();
            const sexta_llamada=await obtenerpromesa_pick_consulta_nivel3(quinta_llamada,io,ndoc,zona,user);
        }
        catch(err){console.log(err)}
    })

    socket.on('estado confirmado',async (ndoc,cantidad,zona)=>{
        try{
            const primera_llamada=await obtenerpromesa_confirmar();
            const segunda_llamada=await obtenerpromesa_confirmar_consulta(primera_llamada,ndoc,zona);
            const tercera_llamada=await obtenerpromesa_confirmar();
            const cuarta_llamada=await obtenerpromesa_confirmar_consulta_nivel2(tercera_llamada,io,socket,ndoc,cantidad,zona);
            console.log(cuarta_llamada);
        }
        catch(err){console.log(err)}
    })

    socket.on('estado checking',async (ndoc,zonas,despacho,user,identificador_maestro)=>{
        console.log(ndoc)
        console.log(zonas)
        console.log(despacho)
        console.log(user)
        try{
            /////CONSULTA PARA PASAR EL PICKING A ESTADO 2 EN TODAS SUS ZONAS POSIBLES
            const primera_llamada=await obtenerpromesa_check();///ABRIR CONEXION
            const segunda_llamada=await obtenerpromesa_check_consulta(primera_llamada,ndoc,zonas,despacho,user);
            console.log(segunda_llamada);
            /////CONSULTA PARA CONFIRMAR EL CHECK EN SU RESPECTIVA TABLA
            const tercera_llamada=await obtenerpromesa_check();///ABRIR CONEXION
            const cuarta_llamada=await obtenerpromesa_check_consulta2(tercera_llamada,ndoc,zonas,despacho,user,identificador_maestro);
            console.log(cuarta_llamada);
            /////CONSULTA PARA CONFIRMAR EL CHECK EN LA TABLA MAESTRO GENERAL
            const quinta_llamada=await obtenerpromesa_check();
            const sexta_llamada=await obtenerpromesa_check_consulta3(quinta_llamada,ndoc);
            console.log(sexta_llamada);
            /////CONSULTA REFRESCAR LOS PICKING Y KITAR LOS NUEVOS CHEKING
            /////DESDE AQUI SE MALOGRA CORREGIR EL ENVIO A LOS MASTERS DE PROCEDENCIA
            const setima_llamada=await obtenerpromesa_check();
            const octava_llamada=await obtenerpromesa_check_consulta4(setima_llamada,io,socket,ndoc,zonas,despacho,user);
            console.log(octava_llamada);
            /////CONSULTA PARA MANDAR A DESPACHO LUEGO DE TERMINAR SU COMPLETO PROCESO
            const novena_llamada=await obtenerpromesa_check();
            const decima_llamada=await obtenerpromesa_check_consulta5(novena_llamada,io,socket,ndoc,zonas,despacho,user);
            console.log(decima_llamada);
        }
        catch(err){console.log(err)}
    })

    socket.on('despacho check',(ndoc,zonas,despacho,user)=>{
        try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{}
            });
        }
        catch(err){console.log(err)}
    })

    socket.on('despacho embalar',(ndoc,zonas,despacho,user)=>{
        try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{}
            });
        }
        catch(err){console.log(err)}
    })

    
})

server.listen(port,()=>{console.log(`server levantado en http://localhost:${port}`)})