const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_contador(){
    return new Promise((resolve,reject)=>{
        nuevos_documentos(resolve,reject);
    });
}

function nuevos_documentos(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{
            resolve(conexion);
        }
    });
}

function obtenerpromesa_contador_consulta(conexion,socket,registros){
    return new Promise((resolve,reject)=>{
        nuevos_documentos_consulta(resolve,reject,conexion,socket,registros)
    })
}

function nuevos_documentos_consulta(resolve,reject,conexion,socket,registros){
    // let sp_sql="select COUNT(idprogramacion),GETDATE() from tbl01_api_programar";
    let sp_sql="select COUNT(idprogramacion) from tbl01_api_programar";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('registros nuevos',{"0":0});
                resolve("termine de ver cuantos registros nuevos hay");
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
                socket.emit('registros nuevos',respuesta2[0]);
                resolve("termine de ver cuantos registros nuevos hay");
            }
        }
    })
    // consulta.addParameter('despacho', TYPES.Int,0);
    conexion.execSql(consulta);
}

module.exports={obtenerpromesa_contador,obtenerpromesa_contador_consulta}