const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_usuario(){
    return new Promise((resolve,reject)=>{
        usuario_conexion(resolve,reject);
    });
}

function usuario_conexion(resolve,reject){
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

function obtenerpromesa_usuario_consulta(conexion,user){
    return new Promise((resolve,reject)=>{
        busqueda_usuario(resolve,reject,conexion,user)
    })
}

function busqueda_usuario(resolve,reject,conexion,user){
    let sp_sql="select usuario from tbl01_api_almacen_usuarios where clave=@pass";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                // socket.emit('ventanilla mestro nuevos',{});
                // resolve("usuario no aceptado")
                resolve(false)
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
                // socket.emit('ventanilla mestro nuevos',respuesta2);
                // resolve("usuario aceptado")
                resolve(respuesta2[0][0])
            }
        }
    })
    // consulta.addParameter('despacho', TYPES.Int,0);
    consulta.addParameter('pass', TYPES.VarChar,user);
    conexion.execSql(consulta);
    // conexion.callProcedure(consulta);
}

function ventanilla_registros2(socket){
    // let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,(case b.z1_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z1imp',(case b.z2_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z2imp',(case b.z3_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z3imp',(case b.desconocido_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'descimp',(case c.z1_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z1pick',(case c.z2_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z2pick',(case c.z3_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z3pick',(case c.desconocido_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'descpick',(case c.z1_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z1conf',(case c.z2_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z2conf',(case c.z3_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z3conf',(case c.desconocido_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'descconf',ISNULL((case c.z1_usr when '' then 'usuario no asignado' end),c.z1_usr)as'z1usr',ISNULL((case c.z2_usr when '' then 'usuario no asignado' end),c.z2_usr)as'z2usr',ISNULL((case c.z3_usr when '' then 'usuario no asignado' end),c.z3_usr)as'z3usr',ISNULL((case c.desconocido_usr when '' then 'usuario no asignado' end),c.desconocido_usr)as'descusr', a.piking,a.despacho from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho<>1 and a.cheking=0";
    // let sp_sql="select a.documento,a.estado from tbl01_api_documento_estado a inner join tbl01_api_programar b on(b.documento=a.documento) where b.despacho=1 AND b.piking=0";
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de consulta general para tabla maestro")
            console.log(err);
        }
        else{
            // conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla mestro estados',{});
                ventanilla_registros3(socket)
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
                ventanilla_registros3(socket)
            }
        }
    })
    // conexion.execSql(consulta);
    consulta.addParameter('despacho', TYPES.Int,0);
    consulta.addParameter('mostrar', TYPES.VarChar,'estados');
    conexion.callProcedure(consulta);
}

module.exports={obtenerpromesa_usuario,obtenerpromesa_usuario_consulta}