const {Request,TYPES} = require('../../conexion/cadena')

function despacho_embalado_filtrado(resolve,reject,conexion,socket,alm,tipo,contenido,salida){
    // let sp_sql="select * from tbl01_api_despacho_embalados where embalado=1";
    let sp_sql="jc_documento_filtrado_despacho";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('despacho embalados',{},alm,salida);
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
                socket.emit('despacho embalados',respuesta2,alm,salida);
                resolve("exitoso la promesa de zona de consulta 3 despacho");
                // ventanilla_registros3(socket,user);
            }
        }
    })
    // conexion.execSql(consulta);
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('mostrar',TYPES.VarChar,'embalados');
    consulta.addParameter('tipo',TYPES.VarChar,tipo);
    consulta.addParameter('contenido',TYPES.VarChar,contenido);
    conexion.callProcedure(consulta);
}

module.exports={despacho_embalado_filtrado}