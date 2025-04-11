const express = require('express')
const {createServer} = require('node:http');
const {config,Connection,Request,TYPES} = require('./conexion/cadena')
const path = require('node:path');
const fs = require('fs')
const {Server} = require('socket.io')
const {mostrar_mensaje} = require('./documentos_atender')
const {documento_estado_piking} = require('./documento_estado_piking')
const {documento_estado_checking} = require('./documento_estado_checking')
const {obtenerpromesa_zona,obtenerpromesa_zona_consulta,obtenerpromesa_zona_consulta2,obtenerpromesa_zona_consulta3} = require('./zona_documentos')
const {obtenerpromesa_impresion,obtenerpromesa_impresion_consulta,documento_estado_impreso,leer_file,br_generador,br_generador2,obtenerpromesa_factura_datos,obtenerpromesa_factura_datos_consulta,obtenerpromesa_factura_datos_consulta2,generarpdfnuevo,generatepdf2,mandar_archivo,emitir_documento} = require('./documento_estado_impreso')/////MODIFICAR ESTA FUNCION DE IMPRESION
const {documento_estado_confirmado} = require('./documento_estado_confirmado')
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
    ////MASTER DE VENTANILLA
    socket.on('ventanilla',(user)=>{

        function contador_balas(){
            return new Promise((resolve)=>{
                console.log(disparo)
                resolve("resuelto con exito el conocer el valor del intervalo actual");
            })
        }

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
                // console.log(primera_llamada);
                /////SEPARACION ENTRE LA CONEXION Y LA CONSULTA
                const segunda_llamada=await obtenerpromesa_ventanilla_consulta(socket,alm);
                console.log(segunda_llamada);
            }
            catch(error){ console.log(error);}
        }

        async function ejecutar_intervalov(socket,alm){
            const cargador=await contador_balas();
            console.log(cargador);
            const observador=await zonas_limpiador();
            console.log(observador);
            const grupo=await nueva_zone("VENTANILLA");
            console.log(grupo);
            disparo=setInterval(almventanilla,2000,socket,alm);
            // setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar el principal")},30000);
        }

        if(disparo!=null){
            clearInterval(disparo);
            disparo=null;
            ejecutar_intervalov(socket,user);
        }
        else{ ejecutar_intervalov(socket,user);}
        ////////PARTE ANTIGUA QUE YA NO SIRVE
        // socket.join("ZONA VENTANILLA");
        // if(disparo !=null){
        //     clearInterval(disparo);
        //     disparo=null;
        // }
        // try{
        //     conexion = new Connection(config);
        //     conexion.connect();
        //     conexion.on('connect',(err)=>{
        //         if(err){console.log("ERROR: ",err);}
        //         else{ ventanilla_registros(socket,user) }
        //     });
        //     disparo=setInterval(nuevos_documentos,2000,socket);
        // }
        // catch(err){console.log(err)}
    })
    /////MASTER DE LOCAL-PROVINCIA
    socket.on('almacen principal',(alm)=>{
        // socket.join("ZONA PRINCIPAL");
        function contador_balas(){
            return new Promise((resolve)=>{
                console.log(disparo)
                resolve("resuelto con exito el conocer el valor del intervalo actual");
            })
        }

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
                // console.log(primera_llamada);
                /////SEPARACION ENTRE LA CONEXION Y LA CONSULTA
                const segunda_llamada=await obtenerpromesa_principal_consulta(socket,alm);
                console.log(segunda_llamada);
            }
            catch(error){ console.log(error);}
        }

        async function ejecutar_intervalo1(socket,alm){
            const cargador=await contador_balas();
            console.log(cargador);
            const observador=await zonas_limpiador();
            console.log(observador);
            const grupo=await nueva_zone("PRINCIPAL");
            console.log(grupo);
            disparo=setInterval(almprincipal,2000,socket,alm);
            // setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar el principal")},30000);
        }

        if(disparo!=null){
            clearInterval(disparo);
            disparo=null;
            ejecutar_intervalo1(socket,alm);
        }
        else{ ejecutar_intervalo1(socket,alm);}
    })

    socket.on('almacen mym',(alm)=>{
        // socket.join("ZONA MYM");
        function contador_balas(){
            return new Promise((resolve)=>{
                console.log("esto es lo que tiene el intervalo al cambiar de zona en zona")
                console.log(disparo)
                resolve("resuelto con exito el conocer el valor del intervalo actual");
            })
        }

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
                // console.log(primera_llamada);
                const segunda_llamada=await obtenerpromesa_mym_consulta(socket,alm);
                console.log(segunda_llamada);
                // const primera_llamada=setInterval(obtenerpromesa_principal(socket,alm),2000);
            }
            catch(error){ console.log(error);}
        }

        async function ejecutar_intervalo8(socket,alm){
            const cargador=await contador_balas();
            console.log(cargador);
            const observador=await zonas_limpiador();
            console.log(observador);
            const grupo=await nueva_zone("MYM");
            console.log(grupo);
            disparo=setInterval(almmym,2000,socket,alm);
            // setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar el mym")},30000);
        }
        if(disparo!=null){
            clearInterval(disparo);
            disparo=null;
            ejecutar_intervalo8(socket,alm);
        }
        else{ ejecutar_intervalo8(socket,alm);}
        
    })

    socket.on('despacho',(alm)=>{
        // socket.join("ZONA DESPACHO");
        // try{
        //     conexion = new Connection(config);
        //     conexion.connect();
        //     conexion.on('connect',(err)=>{
        //         if(err){console.log("ERROR: ",err);}
        //         else{ despacho_registros(socket) }
        //     });
        // }
        // catch(err){console.log(err)}
        function contador_balas(){
            return new Promise((resolve)=>{
                console.log(disparo)
                resolve("resuelto con exito el conocer el valor del intervalo actual");
            })
        }

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
                console.log(primera_llamada);
                const segunda_llamada=await obtenerpromesa_despacho_consulta(socket,alm);
                console.log(segunda_llamada);
                await obtenerpromesa_despacho();
                await obtenerpromesa_despacho_consulta2(socket,alm);
                await obtenerpromesa_despacho();
                await obtenerpromesa_despacho_consulta3(socket,alm);
            }
            catch(error){ console.log(error);}
        }

        async function ejecutar_intervalo_despacho(socket,alm){
            const cargador=await contador_balas();
            console.log(cargador);
            const observador=await zonas_limpiador();
            console.log(observador);
            const grupo=await nueva_zone("DESPACHO");
            console.log(grupo);
            disparo=setInterval(despachop,2000,socket,alm);
        }

        if(disparo!=null){
            clearInterval(disparo);
            disparo=null;
            ejecutar_intervalo_despacho(socket,alm);
        }
        else{ ejecutar_intervalo_despacho(socket,alm);}
    })
    //////////////NO TE OLVIDES VALIDAR LA ZONAS Y EL CAMBIO ENTRE OPCIONES PORQE PODRIA ROMPER LA CONEXION

    socket.on('cambio zona',(zona)=>{

        function contador_balas(){
            return new Promise((resolve)=>{
                console.log(disparo)
                resolve("resuelto con exito el conocer el valor del intervalo actual");
            })
        }

        function zonas_limpiador(){
            return new Promise((resolve,reject)=>{
                socket.rooms.forEach((zone)=>{
                    let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA VENTANILLA','ZONA desconocido','ZONA PRINCIPAL','ZONA MYM'];
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
                // const pistola=await revolver_disparador(disparo);
                const primera_llamada=await obtenerpromesa_zona();
                // console.log(primera_llamada);
                const segunda_llamada=await obtenerpromesa_zona_consulta(socket,zona);
                // console.log(segunda_llamada);
                ///////EN TESTEO LAS MULTIPLES CONEXIONES PERO SOLO 1 PETICION POR CADA UNA
                await obtenerpromesa_zona();
                const tercera_llamada=await obtenerpromesa_zona_consulta2(socket,zona);
                // console.log(tercera_llamada);
                await obtenerpromesa_zona();
                const cuarta_llamada=await obtenerpromesa_zona_consulta3(socket,zona);
                // console.log(cuarta_llamada);
            }
            catch(error){ console.log(error);}
        }

        async function ejecutar_intervalo_zona(socket,zona){
            const cargador=await contador_balas();
            console.log(cargador);
            const observador=await zonas_limpiador();
            console.log(observador);
            const grupo=await nueva_zone(zona);
            console.log(grupo);
            // const pistola=await revolver_disparador(disparo);
            // console.log(pistola);tener cuidado de usar esta funcion cuando posible redundancia
            disparo=setInterval(zonas,2000,socket,zona);
            // setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar la zona")},30000);
        }

        if(disparo!=null){
            clearInterval(disparo);
            disparo=null;
            ejecutar_intervalo_zona(socket,zona);
        }
        else{ ejecutar_intervalo_zona(socket,zona); }
    })

    socket.on('pedir informacion',(ndoc)=>{
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

    socket.on('estado impreso',(ndoc,zona,user)=>{
        async function pedir_pdf(ndoc,zona,user){
            try{
                const primera_llamada=await obtenerpromesa_impresion();
                const segunda_llamada=await obtenerpromesa_impresion_consulta(io,socket,ndoc,zona,user);
                //////LECTURA SOLO PARA REVISAR EL CONTENIDO VACIO
                const tercera_llamada=await leer_file();
                // console.log(tercera_llamada)
                ////CREACION DEL CANVAS Y PASAR UN DOCUMENTO PARA SU CREACION
                const cuarta_llamada=await br_generador(ndoc);
                // console.log(cuarta_llamada)
                ////LLAMADA DE CONEXION PARA LOS DATOS DE LA FACTURA
                const quinta_llamada=await obtenerpromesa_factura_datos();
                ///LLAMADA DE CONSULTA PARA LOS DATOS DE LA FACTURA
                const sexta_llamada=await obtenerpromesa_factura_datos_consulta(ndoc,tercera_llamada,cuarta_llamada);
                ////LLAMADA DE CONEXION PARA LOS DATOS DE LA FACTURA SEGUNDA PARTE
                await obtenerpromesa_factura_datos()
                const terminar_consulta2=await obtenerpromesa_factura_datos_consulta2(ndoc,sexta_llamada);
                ////LLAMADA DE GENERACION DE PDF POR 1 INSTANTE
                // const setima_llamada=await generatepdf2(terminar_consulta2,'prueba.pdf');
                ///LLAMADA DE GENERACION DE PDF NUEVO METODO EN PRUEVA
                const setima_llamada=await generarpdfnuevo(terminar_consulta2);
                // await generatepdf2(sexta_llamada,'prueba.pdf')
                //const octava_llamada=await mandar_archivo();
                // await mandar_archivo(socket,ndoc);
                // const novena_llamada=await emitir_documento(socket,octava_llamada,ndoc);
                // await emitir_documento(socket,octava_llamada,ndoc);
                await emitir_documento(socket,setima_llamada,ndoc);
            }
            catch(error){ console.log(error);}
        }
        pedir_pdf(ndoc,zona,user);
    })

    socket.on('estado pick',(ndoc,cantidad,zona,user)=>{
        try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{ documento_estado_piking(io,ndoc,cantidad,zona,user) }
            });
        }
        catch(err){console.log(err)}
    })

    socket.on('estado confirmado',(ndoc,cantidad,zona)=>{
        try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{ documento_estado_confirmado(io,socket,ndoc,cantidad,zona) }
            });
        }
        catch(err){console.log(err)}
    })

    socket.on('estado checking',(ndoc,zonas,despacho,user)=>{
        try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{ documento_estado_checking(io,socket,ndoc,zonas,despacho,user) }
            });
        }
        catch(err){console.log(err)}
    })

    // socket.on('estado embalar',(ndoc,zonas,despacho,user)=>{
    //     try{
    //         conexion = new Connection(config);
    //         conexion.connect();
    //         conexion.on('connect',(err)=>{
    //             if(err){console.log("ERROR: ",err);}
    //             else{
    //                 documento_estado_checking(io,socket,ndoc,zonas,despacho,user)
    //             }
    //         });
    //     }
    //     catch(err){console.log(err)}
    // })

    
})

server.listen(port,()=>{console.log(`server levantado en http://localhost:${port}`)})