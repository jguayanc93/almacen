const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_principal(socket,alm){
    return new Promise((resolve,reject)=>{
        nuevos_documentos_principal(resolve,reject,socket,alm)
    });
}

function nuevos_documentos_principal(resolve,reject,socket,alm){
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{
            resolve("exitoso la promesa principal de conexion")
            // local_provincia_registros1(resolve,reject,socket,alm);
        }
    });
}

function obtenerpromesa_principal_consulta(socket,alm){
    return new Promise((resolve,reject)=>{
        local_provincia_registros1(resolve,reject,socket,alm);
    })
}

function local_provincia_registros1(resolve,reject,socket,alm){
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            // conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla mestro nuevos',{});
                local_provincia_registros2(resolve,reject,socket,alm);
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
                socket.emit('ventanilla mestro nuevos',respuesta2);
                local_provincia_registros2(resolve,reject,socket,alm)
            }
        }
    })
    // conexion.execSql(consulta);
    consulta.addParameter('despacho',TYPES.Int,alm);
    consulta.addParameter('mostrar',TYPES.VarChar,'nuevos');
    conexion.callProcedure(consulta);
}

function local_provincia_registros2(resolve,reject,socket,alm){
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            // conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla mestro estados',{});
                local_provincia_registros3(resolve,reject,socket,alm)
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
                socket.emit('ventanilla mestro estados',respuesta2);
                local_provincia_registros3(resolve,reject,socket,alm)
            }
        }
    })
    // conexion.execSql(consulta);
    consulta.addParameter('despacho', TYPES.Int,alm);
    consulta.addParameter('mostrar', TYPES.VarChar,'estados');
    conexion.callProcedure(consulta);
}

function local_provincia_registros3(resolve,reject,socket,alm){
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de consulta general para tabla maestro")
            console.log(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla mestro terminados',{});
                resolve("exitoso la promesa principal de consulta")
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
                socket.emit('ventanilla mestro terminados',respuesta2);
                resolve("exitoso la promesa principal de consulta");
                // local_provincia_registros2(socket)
            }
        }
    })
    // conexion.execSql(consulta);
    consulta.addParameter('despacho', TYPES.Int,alm);
    consulta.addParameter('mostrar', TYPES.VarChar,'terminados');
    conexion.callProcedure(consulta);
}

// module.exports={local_provincia_registros1}
module.exports={obtenerpromesa_principal,obtenerpromesa_principal_consulta}
// consulta para ver los impresos
// let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,b.z1_imp,b.z2_imp,b.z3_imp,b.desconocido_imp from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) where a.despacho<>1 and a.piking=0";
// consulta para ver los picking sin completar
// let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,a.tip_zona,b.z1_pick,b.z2_pick,b.z3_pick,b.desconocido_pick,b.z1_conf,b.z2_conf,b.z3_conf,b.desconocido_conf,b.z1_usr,b.z2_usr,b.z3_usr,b.desconocido_usr from tbl01_api_programar a join tbl01_api_almacen_documento_piking b on (a.documento=b.documento) where a.despacho<>1 and a.piking=0";
// consulta para ver los picking completos
// let sp_sql="select documento,cliente,CONCAT(hora,':',minutos)as 'hora' from tbl01_api_programar where piking=1 and cheking=0 and despacho<>1";