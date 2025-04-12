const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_despacho(){
    return new Promise((resolve,reject)=>{
        nuevos_documentos_despacho(resolve,reject);
    })
}

function nuevos_documentos_despacho(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{            
            resolve(conexion);
        }
    });
}

function obtenerpromesa_despacho_consulta(conexion,socket,alm){
    return new Promise((resolve,reject)=>{
        despacho_registros(resolve,reject,conexion,socket,alm)
    })
}

function despacho_registros(resolve,reject,conexion,socket,alm){
    // let sp_sql="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND z1_imp=0 AND z2_imp=0 AND z3_imp=0 AND desconocido_imp=0) where programada.piking=0 AND despacho<>1";
    let sp_sql="jc_documentos_despacho_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
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
    // conexion.execSql(consulta);
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('mostrar',TYPES.VarChar,'nuevos');
    conexion.callProcedure(consulta);
}

function obtenerpromesa_despacho_consulta2(conexion,socket,alm){
    return new Promise((resolve,reject)=>{
        despacho_recolectados(resolve,reject,conexion,socket,alm)
    })
}

function despacho_recolectados(resolve,reject,conexion,socket,alm){
    // let sp_sql="select despacho.documento,almacen.cliente from tbl01_api_programar almacen join tbl01_api_despacho_embalados despacho on (despacho.documento=almacen.documento) where almacen.cheking=1 AND despacho.embalado=0";
    // let sp_sql="select a.documento,CASE b.despacho when 3 then 'LIMA' when 4 then 'PROVINCIA' end,b.cliente,b.nomtra,b.nomdep,b.nompro,b.destino,c.observ from tbl01_api_despacho_checking a inner join tbl01_api_programar b on (b.documento=a.documento AND b.cheking=1) inner join mst01fac c on (c.ndocu=a.documento) where a.checkeado=0 AND b.despacho<>1 AND b.almacen='01'";
    let sp_sql="jc_documentos_despacho_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
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
    // conexion.execSql(consulta);
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('mostrar',TYPES.VarChar,'check');
    conexion.callProcedure(consulta);
}

function obtenerpromesa_despacho_consulta3(conexion,socket,alm){
    return new Promise((resolve,reject)=>{
        despacho_embalados(resolve,reject,conexion,socket,alm)
    })
}

function despacho_embalados(resolve,reject,conexion,socket,alm){
    // let sp_sql="select * from tbl01_api_despacho_embalados where embalado=1";
    let sp_sql="jc_documentos_despacho_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
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
    // conexion.execSql(consulta);
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('mostrar',TYPES.VarChar,'embalados');
    conexion.callProcedure(consulta);
}

module.exports={
    despacho_registros,
    obtenerpromesa_despacho,
    obtenerpromesa_despacho_consulta,
    obtenerpromesa_despacho_consulta2,
    obtenerpromesa_despacho_consulta3
}