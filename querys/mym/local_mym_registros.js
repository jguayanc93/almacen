const {Request,TYPES} = require('../../conexion/cadena')

function local_provincia_registrosmm1(resolve,reject,conexion,socket,alm){
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            if(rows.length==0){
                socket.emit('ventanilla mestro nuevos',{});
                resolve('local mym registros nuevos enviados');
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
                resolve('local mym registros nuevos enviados');
            }
        }
    })
    consulta.addParameter('despacho', TYPES.Int,alm);
    consulta.addParameter('mostrar', TYPES.VarChar,'nuevos');
    conexion.callProcedure(consulta);
}

module.exports={local_provincia_registrosmm1}