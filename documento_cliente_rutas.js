const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_items(){
    return new Promise((resolve,reject)=>{ fac_items(resolve,reject); })
}

function fac_items(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err) reject(err);
        else{
            resolve(conexion);
        }
    });
}

function obtenerpromesa_items_consulta(conexion,socket,ndoc){
    return new Promise((resolve,reject)=>{
        documento_detallado(resolve,reject,conexion,socket,ndoc);
    })
}

function documento_detallado(resolve,reject,conexion,socket,ndoc){
    // let sp_sql="select marc,descr,cant from dtl01fac where ndocu=@doc AND LEFT(codi,4)<>'0303' order by item";
    let sp_sql="select descr,cant from dtl01fac where ndocu=@doc AND LEFT(codi,4)<>'0303' order by item";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('enviar informacion',{});
                resolve("consultado los items");
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
                socket.emit('enviar informacion',respuesta2);
                resolve("consultado los items");
            }
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}

module.exports={obtenerpromesa_items,obtenerpromesa_items_consulta}