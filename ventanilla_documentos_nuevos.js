const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function ventanilla_registros(socket,user){
    // let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,b.z1_imp,b.z2_imp,b.z3_imp,b.desconocido_imp,c.z1_pick,c.z2_pick,c.z3_pick,c.desconocido_pick,c.z1_conf,c.z2_conf,c.z3_conf,c.desconocido_conf,c.z1_usr,c.z2_usr,c.z3_usr,c.desconocido_usr,a.piking,a.despacho from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho=1 and cheking=0";
    let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',CONCAT(a.hora,':',a.minutos)as'hora',a.documento,a.cliente,a.tip_zona from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho=1 and cheking=0";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            console.log("error de ventanilla tabla maestro")
            console.log(err);
        }
        else{
            // conexion.close();
            if(rows.length==0){
                // socket.emit('ventanilla impresos',{});
                socket.emit('ventanilla mestro nuevos',{});
                ventanilla_registros2(socket)
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
                // socket.emit('ventanilla impresos',respuesta2);
                socket.emit('ventanilla mestro nuevos',respuesta2);
                ventanilla_registros2(socket)
            }
        }
    })
    conexion.execSql(consulta);
}

function ventanilla_registros2(socket){
    // let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,(case b.z1_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z1imp',(case b.z2_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z2imp',(case b.z3_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z3imp',(case b.desconocido_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'descimp',(case c.z1_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z1pick',(case c.z2_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z2pick',(case c.z3_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z3pick',(case c.desconocido_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'descpick',(case c.z1_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z1conf',(case c.z2_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z2conf',(case c.z3_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z3conf',(case c.desconocido_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'descconf',ISNULL((case c.z1_usr when '' then 'usuario no asignado' end),c.z1_usr)as'z1usr',ISNULL((case c.z2_usr when '' then 'usuario no asignado' end),c.z2_usr)as'z2usr',ISNULL((case c.z3_usr when '' then 'usuario no asignado' end),c.z3_usr)as'z3usr',ISNULL((case c.desconocido_usr when '' then 'usuario no asignado' end),c.desconocido_usr)as'descusr', a.piking,a.despacho from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho<>1 and a.cheking=0";
    let sp_sql="select a.documento,a.estado from tbl01_api_documento_estado a inner join tbl01_api_programar b on(b.documento=a.documento) where b.despacho=1 AND b.piking=0";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
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
    conexion.execSql(consulta);
}

function ventanilla_registros3(socket){
    // let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,(case b.z1_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z1imp',(case b.z2_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z2imp',(case b.z3_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'z3imp',(case b.desconocido_imp when '0' then 'NO IMPRESO' when '1' then 'IMPRESO' when '2' then 'SIGUIENTE' end)as'descimp',(case c.z1_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z1pick',(case c.z2_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z2pick',(case c.z3_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'z3pick',(case c.desconocido_pick when '0' then 'PICK NO COMENSADO' when '1' then 'PICK COMENSADO' when '2' then 'TERMINADO' end)as'descpick',(case c.z1_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z1conf',(case c.z2_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z2conf',(case c.z3_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'z3conf',(case c.desconocido_conf when '0' then 'ZONA NO TERMINADO' when '1' then 'ZONA TERMINADO' when '2' then 'ENTREGADO' end)as'descconf',ISNULL((case c.z1_usr when '' then 'usuario no asignado' end),c.z1_usr)as'z1usr',ISNULL((case c.z2_usr when '' then 'usuario no asignado' end),c.z2_usr)as'z2usr',ISNULL((case c.z3_usr when '' then 'usuario no asignado' end),c.z3_usr)as'z3usr',ISNULL((case c.desconocido_usr when '' then 'usuario no asignado' end),c.desconocido_usr)as'descusr', a.piking,a.despacho from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho<>1 and a.cheking=0";
    // let sp_sql="select documento,(case piking when 0 then 'FALTA' when 1 then 'CONFIRMAR' end),despacho from tbl01_api_programar where despacho=1 and cheking=0";
    // let sp_sql="select documento,piking,despacho from tbl01_api_programar where despacho=1 and cheking=0";
    ////cuidado con esta consulta
    let sp_sql="select documento,piking,despacho,tip_zona from tbl01_api_programar where despacho=1 and cheking=0";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de consulta general para tabla maestro")
            console.log(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla mestro terminados',{});
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
                // local_provincia_registros2(socket)
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={ventanilla_registros}