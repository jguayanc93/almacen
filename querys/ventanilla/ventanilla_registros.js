const {Request,TYPES} = require('../../conexion/cadena')

function ventanilla_registros(resolve,reject,conexion,socket,user){
    // let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,b.z1_imp,b.z2_imp,b.z3_imp,b.desconocido_imp,c.z1_pick,c.z2_pick,c.z3_pick,c.desconocido_pick,c.z1_conf,c.z2_conf,c.z3_conf,c.desconocido_conf,c.z1_usr,c.z2_usr,c.z3_usr,c.desconocido_usr,a.piking,a.despacho from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho=1 and cheking=0";
    // let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',CONCAT(a.hora,':',a.minutos)as'hora',a.documento,a.cliente,a.tip_zona from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho=1 and cheking=0";
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            if(rows.length==0){
                socket.emit('ventanilla mestro nuevos',{});
                resolve('ventanilla registros nuevos enviados');
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
                resolve('ventanilla registros nuevos enviados');
            }
        }
    })
    consulta.addParameter('despacho', TYPES.Int,0);
    consulta.addParameter('mostrar', TYPES.VarChar,'nuevos');
    conexion.callProcedure(consulta);
}

module.exports={ventanilla_registros}