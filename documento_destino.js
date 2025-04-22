const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_destino(){
    return new Promise((resolve,reject)=>{ destino_fac(resolve,reject); })
}

function destino_fac(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err) reject(err);
        else{
            resolve(conexion);
        }
    });
}

function obtenerpromesa_destino_consulta(conexion,socket,ndoc){
    return new Promise((resolve,reject)=>{
        documento_destino(resolve,reject,conexion,socket,ndoc);
    })
}

function documento_destino(resolve,reject,conexion,socket,ndoc){
    ///FIJARTE BIEN LA DIRECCION DE ENTREGA EN TODAS SUS POSIBILIDADES
    let sp_sql="";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('comprobar destino',{});
                resolve("consultado el destino");
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
                socket.emit('comprobar destino',respuesta2);
                resolve("consultado el destino");
            }
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}

module.exports={obtenerpromesa_destino,obtenerpromesa_destino_consulta}