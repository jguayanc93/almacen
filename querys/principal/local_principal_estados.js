const {Request,TYPES} = require('../../conexion/cadena')

function local_provincia_registros2(resolve,reject,conexion,socket,alm){
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
                resolve('local principal registros estados enviados')
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
                resolve('local principal registros estados enviados')
            }
        }
    })
    // conexion.execSql(consulta);
    consulta.addParameter('despacho', TYPES.Int,alm);
    consulta.addParameter('mostrar', TYPES.VarChar,'estados');
    conexion.callProcedure(consulta);
}

module.exports={local_provincia_registros2}