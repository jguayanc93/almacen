const express = require('express')
const {createServer} = require('node:http');
const {config,Connection,Request,TYPES} = require('./conexion/cadena')
const path = require('node:path');
const fs = require('fs')
const {Server} = require('socket.io')
const {mostrar_mensaje} = require('./documentos_atender')
const {documento_estado_piking} = require('./documento_estado_piking')
const {documento_estado_checking} = require('./documento_estado_checking')
const {obtenerpromesa_zona} = require('./zona_documentos')
const {documento_estado_impreso} = require('./documento_estado_impreso')
const {documento_estado_confirmado} = require('./documento_estado_confirmado')
const {nuevos_documentos} = require('./documentos_receptor')
const {nuevos_documentos_dinamicos} = require('./documentos_receptor2')
const {nuevos_documentos_dinamicosmm} = require('./documentos_receptor3')
const {data} = require('./documento_informacion')
const {ventanilla_registros} = require('./ventanilla_documentos_nuevos')
//const {local_provincia_registros1} = require('./local_provincia_documentos_nuevos')
const {obtenerpromesa_principal} = require('./local_provincia_documentos_nuevos')
const {obtenerpromesa_mym} = require('./local_provincia_documentos_nuevos2')
const {despacho_registros} = require('./despacho_documentos_nuevos')

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
    socket.on('disconnect',()=>{
        socket.leave("ZONA Z1");
        socket.leave("ZONA Z2");
        socket.leave("ZONA Z3");
        socket.leave("ZONA desconocido");
        socket.leave("ZONA VENTANILLA");
        // socket.leave("ZONA LOCAL");
        socket.leave("ZONA PRINCIPAL");
        socket.leave("ZONA MYM");
        if(disparo){
            clearInterval(disparo);
            disparo=null;
        }
    })
    ////MASTER DE VENTANILLA
    socket.on('ventanilla',(user)=>{
        // socket.leave("ZONA LOCAL");
        // socket.leave("ZONA Z1");
        // socket.leave("ZONA Z2");
        // socket.leave("ZONA Z3");
        // socket.leave("ZONA desconocido");
        // socket.leave("ZONA PRINCIPAL");
        // socket.leave("ZONA MYM");
        socket.join("ZONA VENTANILLA");
        if(disparo !=null){
            clearInterval(disparo);
            disparo=null;
        }
        try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{ ventanilla_registros(socket,user) }
            });
            disparo=setInterval(nuevos_documentos,2000,socket);
        }
        catch(err){console.log(err)}
    })
    /////MASTER DE LOCAL-PROVINCIA
    socket.on('almacen principal',(alm)=>{
        console.log(`alguien pidio el ${alm}`)
        // socket.join("ZONA LOCAL");
        socket.join("ZONA PRINCIPAL");
        if(disparo != null){
            console.log("tiene un intervalo")
            clearInterval(disparo);
            disparo=null;
        }
        // function limpiar_disparador(){}

        async function almprincipal(socket,alm){
            try{
                const primera_llamada=await obtenerpromesa_principal(socket,alm);
                // const primera_llamada=setInterval(obtenerpromesa_principal(socket,alm),2000);
            }
            catch(error){ console.log(error);}
        }

        function ejecutar_intervalo1(socket,alm){
            // const intervalo=setInterval(almprincipal,2000,socket,alm);
            disparo=setInterval(almprincipal,2000,socket,alm);
            setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar el principal")},30000);
        }
        ejecutar_intervalo1(socket,alm);
        // try{
        //     obtenerpromesa_principal(socket,alm)
        //     .then(resultado=>{
        //         console.log(resultado)
        //     })
        //     .catch(err=>{
        //         console.log(err);
        //     })
        //     // conexion = new Connection(config);
        //     // conexion.connect();
        //     // conexion.on('connect',(err)=>{
        //     //     if(err){console.log("ERROR: ",err);}
        //     //     else{ local_provincia_registros1(socket,alm) }
        //     // });
        //     // disparo=setInterval(nuevos_documentos_dinamicos,2000,socket,alm);
        // }
        // catch(err){console.log(err)}
    })

    socket.on('almacen mym',(alm,primero)=>{
        console.log(`alguien pidio el ${alm}`)
        // socket.join("ZONA LOCAL");
        socket.join("ZONA MYM");
        if(disparo!=null){
            console.log("tiene un intervalo")
            clearInterval(disparo);
            disparo=null;
        }

        async function almmym(socket,alm){
            try{
                const primera_llamada=await obtenerpromesa_mym(socket,alm);
                // const primera_llamada=setInterval(obtenerpromesa_principal(socket,alm),2000);
            }
            catch(error){ console.log(error);}
        }

        function ejecutar_intervalo8(socket,alm){
            // const intervalo=setInterval(almprincipal,2000,socket,alm);
            disparo=setInterval(almmym,2000,socket,alm);
            setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar el mym")},30000);
        }
        ejecutar_intervalo8(socket,alm);
        
        // try{
        //     conexion = new Connection(config);
        //     conexion.connect();
        //     conexion.on('connect',(err)=>{
        //         if(err){console.log("ERROR: ",err);}
        //         else{ local_provincia_registrosmm1(socket,alm,primero) }
        //     });
        //     disparo=setInterval(nuevos_documentos_dinamicosmm,2000,socket,alm,primero);
        // }
        // catch(err){console.log(err)}
    })

    // socket.on('despacho',()=>{
    //     socket.join("ZONA DESPACHO");
    //     try{
    //         conexion = new Connection(config);
    //         conexion.connect();
    //         conexion.on('connect',(err)=>{
    //             if(err){console.log("ERROR: ",err);}
    //             else{ despacho_registros(socket) }
    //         });
    //     }
    //     catch(err){console.log(err)}
    // })
    //////////////NO TE OLVIDES VALIDAR LA ZONAS Y EL CAMBIO ENTRE OPCIONES PORQE PODRIA ROMPER LA CONEXION

    socket.on('cambio zona',(zona)=>{
        console.log(`entrando ala zona ${zona}`)

        socket.join(`ZONA ${zona}`);
        console.log(socket.rooms);

        if(disparo!=null){
            console.log("la zona tenia un intervalo activo");
            clearInterval(disparo);
            disparo=null;
        }

        async function zonas(socket,zona){
            try{
                const primera_llamada=await obtenerpromesa_zona(socket,zona);
                // const primera_llamada=setInterval(obtenerpromesa_principal(socket,alm),2000);
            }
            catch(error){ console.log(error);}
        }

        function ejecutar_intervalo_zona(socket,zona){
            // const intervalo=setInterval(almprincipal,2000,socket,alm);
            disparo=setInterval(zonas,2000,socket,zona);
            setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar el zona")},30000);
        }
        ejecutar_intervalo_zona(socket,zona);


            // try{
            //     conexion = new Connection(config);
            //     conexion.connect();
            //     conexion.on('connect',(err)=>{
            //         if(err){console.log("ERROR: ",err);}
            //         else{ identificar_zona(socket,zona) }
            //     });
            //     // disparo=setInterval(mostrar_mensaje,2000,socket,zona);
            // }
            // catch(err){console.log(err)}
        
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
        console.log(`esto me esta llegando del cliente`)
        console.log(ndoc);
        console.log(zona);
        console.log(user);
        // try{
            conexion = new Connection(config);
            conexion.connect();
            conexion.on('connect',(err)=>{
                if(err){console.log("ERROR: ",err);}
                else{ documento_estado_impreso(io,socket,ndoc,zona,user) }
            });
        // }
        // catch(err){console.log(err)}
    })
    ////////test de peticion de descarga multiple
    // socket.on('descargar archivo',(doc)=>{
    //     const camino=path.join(__dirname,'/','prueba.pdf');
    //     if(fs.existsSync(camino)){
    //         fs.readFile(camino,(err,data)=>{
    //             if(err){
    //                 console.log("ocurrio un error con la lectura del archivo")
    //                 console.log(err)
    //             }
    //             else{
    //                 socket.emit('enviando archivo',data,doc);
    //             }
    //         })
    //     }
    //     else{ console.log("no existe el archivo");  }
    // })
    ////////test de peticion de descarga multiple

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