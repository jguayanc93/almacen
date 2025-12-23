const {Request,TYPES} = require('../../conexion/cadena')

function listar_picking(resolve,reject,conexion,socket,zona){
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('lista picking',{},zona);
                resolve("exitoso la promesa de zona de consulta3");
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
                socket.emit('lista picking',respuesta2,zona);
                resolve("exitoso la promesa de zona de consulta3");
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'pick');
    conexion.callProcedure(consulta);
}

module.exports={listar_picking}