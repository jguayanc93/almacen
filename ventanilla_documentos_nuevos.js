const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function ventanilla_registros(socket,user){
    let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,b.z1_imp,b.z2_imp,b.z3_imp,b.desconocido_imp,c.z1_pick,c.z2_pick,c.z3_pick,c.desconocido_pick,c.z1_conf,c.z2_conf,c.z3_conf,c.desconocido_conf,c.z1_usr,c.z2_usr,c.z3_usr,c.desconocido_usr,a.piking,a.despacho from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho=1 and cheking=0";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de ventanilla de registro sin pickings")
            console.log(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla impresos',{});
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
                socket.emit('ventanilla impresos',respuesta2);
            }
        }
    })
    conexion.execSql(consulta);
}

// function ventanilla_registros2(socket,user){
//     let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,a.tip_zona,b.z1_pick,b.z2_pick,b.z3_pick,b.desconocido_pick,b.z1_conf,b.z2_conf,b.z3_conf,b.desconocido_conf,b.z1_usr,b.z2_usr,b.z3_usr,b.desconocido_usr from tbl01_api_programar a join tbl01_api_almacen_documento_piking b on (a.documento=b.documento) where a.despacho=1 and a.piking=0";
//     let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
//         if(err){
//             console.log("error de ventanilla de registro sin pickings")
//             console.log(err);
//         }
//         else{
//             if(rows.length==0){
//                 socket.emit('ventanilla picking',{});
//                 ventanilla_registros3(socket,user);
//             }
//             else{
//                 let respuesta=[];
//                 let respuesta2={};
//                 let contador=0;
//                 rows.forEach(fila=>{
//                     let tmp={};
//                     fila.map(data=>{
//                         if(contador>=fila.length) contador=0;
//                         typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
//                         contador++;
//                     })
//                     respuesta.push(tmp);
//                 });
//                 Object.assign(respuesta2,respuesta);
//                 socket.emit('ventanilla picking',respuesta2);
//                 ventanilla_registros3(socket,user);
//             }
//         }
//     })
//     conexion.execSql(consulta);
// }

// function ventanilla_registros3(socket,user){
//     let sp_sql="select documento,cliente,CONCAT(hora,':',minutos)as 'hora' from tbl01_api_programar where piking=1 and cheking=0 and despacho=1";
//     let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
//         if(err){
//             console.log("error de ventanilla")
//             console.log(err);
//         }
//         else{
//             conexion.close();
//             if(rows.length==0){
//                 socket.emit('ventanilla checking',{});
//             }
//             else{
//                 let respuesta=[];
//                 let respuesta2={};
//                 let contador=0;
//                 rows.forEach(fila=>{
//                     let tmp={};
//                     fila.map(data=>{
//                         if(contador>=fila.length) contador=0;
//                         typeof data.value=='string' ? tmp[contador]=data.value.trim() : tmp[contador]=data.value;
//                         contador++;
//                     })
//                     respuesta.push(tmp);
//                 });
//                 Object.assign(respuesta2,respuesta);
//                 //////NO TE OLVIDES Q NO ESTAS EN NINGUNA ZONA(ROOM)
//                 socket.emit('ventanilla checking',respuesta2);
//             }
//         }
//     })
//     conexion.execSql(consulta);
// }

module.exports={ventanilla_registros}