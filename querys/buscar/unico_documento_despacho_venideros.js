const {Request,TYPES} = require('../../conexion/cadena')

function despacho_registro_filtrado(resolve,reject,conexion,socket,alm,tipo,contenido,salida){
    // let sp_sql="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND z1_imp=0 AND z2_imp=0 AND z3_imp=0 AND desconocido_imp=0) where programada.piking=0 AND despacho<>1";
    let sp_sql="jc_documento_filtrado_despacho";
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
    consulta.addParameter('tipo',TYPES.VarChar,tipo);
    consulta.addParameter('contenido',TYPES.VarChar,contenido);
    conexion.callProcedure(consulta);
}

module.exports={despacho_registro_filtrado}