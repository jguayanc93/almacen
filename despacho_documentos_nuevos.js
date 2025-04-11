const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_despacho(){
    return new Promise((resolve,reject)=>{
        nuevos_documentos_despacho(resolve,reject);
    })
}

function nuevos_documentos_despacho(resolve,reject){
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{
            // despacho_registros(socket);
            resolve("exitoso la promesa desapacho de conexion");
        }
    });
}

function obtenerpromesa_despacho_consulta(socket,alm){
    return new Promise((resolve,reject)=>{
        despacho_registros(resolve,reject,socket,alm)
    })
}

function despacho_registros(resolve,reject,socket,user){
    let sp_sql="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND z1_imp=0 AND z2_imp=0 AND z3_imp=0 AND desconocido_imp=0) where programada.piking=0 AND despacho<>1";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('despacho venideros',{});
                resolve("exitoso la promesa de zona de consulta 1 despacho");
                // despacho_recolectados(socket,user);
            }
            else{
                let respuesta=[];
                let respuesta2={};
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });
                Object.assign(respuesta2,respuesta);
                socket.emit('despacho venideros',respuesta2);
                resolve("exitoso la promesa de zona de consulta 1 despacho");
                // despacho_embalados(socket,user);
                // despacho_recolectados(socket,user);
            }
        }
    })
    conexion.execSql(consulta);
}

function obtenerpromesa_despacho_consulta2(socket,alm){
    return new Promise((resolve,reject)=>{
        despacho_recolectados(resolve,reject,socket,alm)
    })
}

function despacho_recolectados(resolve,reject,socket,user){
    // let sp_sql="select documento,despacho,cliente from tbl01_api_programar where cheking=1";
    let sp_sql="select despacho.documento,almacen.cliente from tbl01_api_programar almacen join tbl01_api_despacho_embalados despacho on (despacho.documento=almacen.documento) where almacen.cheking=1 AND despacho.embalado=0";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de ventanilla de registro sin pickings")
            reject(err)
        }
        else{
            conexion.close();
            if(rows.length==0){
                // socket.emit('despacho embalados',{});
                socket.emit('despacho recolectados',{});
                // ventanilla_registros3(socket,user);
                resolve("exitoso la promesa de zona de consulta 2 despacho");
                // despacho_embalados(socket,user);
            }
            else{
                let respuesta=[];
                let respuesta2={};
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });
                Object.assign(respuesta2,respuesta);
                // socket.emit('despacho embalados',respuesta2);
                socket.emit('despacho recolectados',respuesta2);
                resolve("exitoso la promesa de zona de consulta 2 despacho");
                // despacho_embalados(socket,user);
            }
        }
    })
    conexion.execSql(consulta);
}

function obtenerpromesa_despacho_consulta3(socket,alm){
    return new Promise((resolve,reject)=>{
        despacho_embalados(resolve,reject,socket,alm)
    })
}

function despacho_embalados(resolve,reject,socket,user){
    let sp_sql="select * from tbl01_api_despacho_embalados where embalado=1";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('despacho embalados',{});
                resolve("exitoso la promesa de zona de consulta 3 despacho");
                // ventanilla_registros3(socket,user);
            }
            else{
                let respuesta=[];
                let respuesta2={};
                let contador=0;
                rows.forEach(fila=>{
                    let tmp={};
                    fila.map(data=>{
                        if(contador>=fila.length) contador=0;
                        typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
                        contador++;
                    })
                    respuesta.push(tmp);
                });
                Object.assign(respuesta2,respuesta);
                socket.emit('despacho embalados',respuesta2);
                resolve("exitoso la promesa de zona de consulta 3 despacho");
                // ventanilla_registros3(socket,user);
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={
    despacho_registros,
    obtenerpromesa_despacho,
    obtenerpromesa_despacho_consulta,
    obtenerpromesa_despacho_consulta2,
    obtenerpromesa_despacho_consulta3
}