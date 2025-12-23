const {Request,TYPES} = require('../../conexion/cadena')

function listar_impresos(resolve,reject,conexion,socket,zona){
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('impresos',{},zona)
                // listar_picking(resolve,reject,socket,zona);
                resolve("exitoso la promesa de zona de consulta2");
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
                socket.emit('impresos',respuesta2,zona);
                // listar_picking(resolve,reject,socket,zona);
                resolve("exitoso la promesa de zona de consulta2");
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'impresos');
    conexion.callProcedure(consulta);
}

module.exports={listar_impresos}