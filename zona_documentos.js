const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_zona(socket,alm){
    return new Promise((resolve,reject)=>{
        nuevos_documentos_zona(resolve,reject,socket,alm)
    });
}

function nuevos_documentos_zona(resolve,reject,socket,alm){
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{
            resolve("exitoso la promesa de zona de conexion")
            // identificar_zona(resolve,reject,socket,alm);
        }
    });
}

function obtenerpromesa_zona_consulta(socket,alm){
    return new Promise((resolve,reject)=>{
        identificar_zona(resolve,reject,socket,alm);
    })
}

function identificar_zona(resolve,reject,socket,zona){
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            if(rows.length==0){
                socket.emit('lista documentos',{},zona)
                listar_impresos(resolve,reject,socket,zona);
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
                listar_impresos(resolve,reject,socket,zona);
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'nuevos');
    conexion.callProcedure(consulta);
}

function listar_impresos(resolve,reject,socket,zona){
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            if(rows.length==0){
                socket.emit('impresos',{},zona)
                listar_picking(resolve,reject,socket,zona);
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
                listar_picking(resolve,reject,socket,zona);
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'impresos');
    // conexion.execSql(consulta);
    conexion.callProcedure(consulta);
}

function listar_picking(resolve,reject,socket,zona){
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
                resolve("exitoso la promesa de zona de consulta");
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
                resolve("exitoso la promesa de zona de consulta");
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'pick');
    conexion.callProcedure(consulta);
}

// module.exports={identificar_zona}
module.exports={obtenerpromesa_zona,obtenerpromesa_zona_consulta}