const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_cliente(){
    return new Promise((resolve,reject)=>{
        cliente_conexion(resolve,reject);
    });
}

function cliente_conexion(resolve,reject){
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

function obtenerpromesa_cliente_consulta(conexion,cliente){
    return new Promise((resolve,reject)=>{
        busqueda_cliente(resolve,reject,conexion,cliente)
    })
}

function busqueda_cliente(resolve,reject,conexion,cliente){
    let sugerencia=`%${cliente}%`;
    // let sp_sql="select top 5 codcli,nomcli from tbl01_api_almacen_rutas where nomcli like '%hi%' group by codcli,nomcli";
    let sp_sql="select top 5 codcli,nomcli from tbl01_api_almacen_rutas where nomcli like @pista group by codcli,nomcli";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                // socket.emit('ventanilla mestro nuevos',{});
                // resolve("usuario no aceptado")
                resolve({})
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
                // socket.emit('ventanilla mestro nuevos',respuesta2);
                // resolve("usuario aceptado")
                resolve(respuesta2)
            }
        }
    })
    // consulta.addParameter('despacho', TYPES.Int,0);
    consulta.addParameter('pista', TYPES.VarChar,sugerencia);
    conexion.execSql(consulta);
}


function obtenerpromesa_ruta_consulta(conexion,codigo){
    return new Promise((resolve,reject)=>{
        ruta_cliente_seleccionado(resolve,reject,conexion,codigo)
    })
}

function ruta_cliente_seleccionado(resolve,reject,conexion,codigo){
    let sp_sql="select * from tbl01_api_almacen_rutas where codcli=@cli";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de consulta general para tabla maestro")
            console.log(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                resolve({})
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
                resolve(respuesta2);
            }
        }
    })
    consulta.addParameter('cli',TYPES.VarChar,codigo);
    conexion.execSql(consulta);
}

module.exports={obtenerpromesa_cliente,obtenerpromesa_cliente_consulta,obtenerpromesa_ruta_consulta}