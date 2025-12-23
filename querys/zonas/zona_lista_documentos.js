const {Request,TYPES} = require('../../conexion/cadena')

function identificar_zona(resolve,reject,conexion,socket,zona){
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('lista documentos',{},zona)
                resolve("exitoso la promesa de zona de consulta");
                // listar_impresos(resolve,reject,socket,zona);
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
                socket.emit('lista documentos',respuesta2,zona);
                // io.to(`ZONA ${zona}`).emit('lista documentos',respuesta2,zona);
                resolve("exitoso la promesa de zona de consulta");
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'nuevos');
    conexion.callProcedure(consulta);
}

module.exports={identificar_zona}