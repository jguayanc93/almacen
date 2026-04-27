const {Request,TYPES} = require('../../conexion/cadena')

function ventanilla_registros3_unico(resolve,reject,conexion,socket,alm,ndoc,salida){
    let sp_sql="jc_documento_filtrado_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err)
        }
        else{
            conexion.close();
            if(rows.length==0){
                // socket.emit('ventanilla mestro terminados',{});
                if(alm===0){
                    socket.emit('ventanilla mestro nuevos',{});
                }
                else if(alm===1){
                    socket.emit('ventanilla mestro estados',{});
                }
                else if(alm===8){
                    socket.emit('ventanilla mestro terminados',{});
                }
                // resolve("exitoso la promesa ventanilla de consulta");
                resolve('ventanilla registros confirmados enviados');
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
                // socket.emit('ventanilla mestro terminados',respuesta2);
                if(alm===0){
                    socket.emit('ventanilla mestro nuevos',respuesta2);
                }
                else if(alm===1){
                    socket.emit('ventanilla mestro estados',respuesta2);
                }
                else if(alm===8){
                    socket.emit('ventanilla mestro terminados',respuesta2);
                }
                resolve('ventanilla registros confirmados enviados');
            }
        }
    })
    consulta.addParameter('despacho', TYPES.Int,alm);
    consulta.addParameter('mostrar', TYPES.VarChar,'terminados');
    consulta.addParameter('salida', TYPES.VarChar,salida);
    consulta.addParameter('documento', TYPES.VarChar,ndoc);
    conexion.callProcedure(consulta);
}

module.exports={ventanilla_registros3_unico}