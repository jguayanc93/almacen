const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_embalado(){
    return new Promise((resolve,reject)=>{documento_despacho_embalado_conexion(resolve,reject)})
}

function documento_despacho_embalado_conexion(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err) reject(err);
        else{
            resolve(conexion);
        }
    });
}

function obtenerpromesa_embalado_consulta(conexion,io,ndoc,user,alm){
    return new Promise((resolve,reject)=>{
        documento_despacho_embalado(resolve,reject,conexion,io,ndoc,user,alm)
    })
}

function documento_despacho_embalado(resolve,reject,conexion,io,ndoc,user,alm){
    let sp_sql="jc_documentos_estado_embalado_despacho";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                io.to(`ZONA DESPACHO`).emit('despacho embalados',{},alm);
                resolve("EMBALADO DESPACHO CONFORME Y PASADO A 1");
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
                io.to(`ZONA DESPACHO`).emit('despacho embalados',respuesta2,alm);
                resolve("EMBALADO DESPACHO CONFORME Y PASADO A 1");
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('user',TYPES.VarChar,user);
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('nivel',TYPES.Int,1);
    conexion.callProcedure(consulta);
}

module.exports={
    obtenerpromesa_embalado,
    obtenerpromesa_embalado_consulta
}