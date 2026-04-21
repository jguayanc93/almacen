const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_check2(){
    return new Promise((resolve,reject)=>{documento_despacho_revision_conexion(resolve,reject)})
}

function documento_despacho_revision_conexion(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err) reject(err);
        else{
            resolve(conexion);
        }
    });
}

function obtenerpromesa_check2_consulta(conexion,io,ndoc,alm,salida,user){
    return new Promise((resolve,reject)=>{
        documento_despacho_revisado(resolve,reject,conexion,io,ndoc,alm,salida,user)
    })
}

function documento_despacho_revisado(resolve,reject,conexion,io,ndoc,alm,salida,user){
    let sp_sql="jc_documentos_estado_check_despacho";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                // io.to(`ZONA DESPACHO`).emit('lista check2',{},alm);
                io.to(`ZONA DESPACHO`).emit('despacho recolectados',{},alm,salida);
                resolve("LISTANDO LOS QUE LES FALTA EL CHECK DE DESPACHO");
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
                io.to(`ZONA DESPACHO`).emit('despacho recolectados',respuesta2,alm,salida);
                // documento_lista_impreso(io,socket,ndoc,zona,user,respuesta2)
                resolve("LISTANDO LOS QUE LES FALTA EL CHECK DE DESPACHO");
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('user',TYPES.VarChar,user);
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('nivel',TYPES.Int,1);
    consulta.addParameter('salida',TYPES.VarChar,salida);
    conexion.callProcedure(consulta);
}

function obtenerpromesa_check2_consulta2(conexion,io,ndoc,alm,salida,user){
    return new Promise((resolve,reject)=>{
        documento_despacho_embalados(resolve,reject,conexion,io,ndoc,alm,salida,user)
    })
}

function documento_despacho_embalados(resolve,reject,conexion,io,ndoc,alm,salida,user){
    let sp_sql="jc_documentos_estado_check_despacho";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                io.to(`ZONA DESPACHO`).emit('despacho embalados',{},alm,salida);
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
                io.to(`ZONA DESPACHO`).emit('despacho embalados',respuesta2,alm,salida);
                // documento_lista_impreso(io,socket,ndoc,zona,user,respuesta2)
                resolve("EMBALADO DESPACHO CONFORME Y PASADO A 1");
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('user',TYPES.VarChar,user);
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('nivel',TYPES.Int,2);
    consulta.addParameter('salida',TYPES.VarChar,salida);
    conexion.callProcedure(consulta);
}

module.exports={
    obtenerpromesa_check2,
    obtenerpromesa_check2_consulta,
    obtenerpromesa_check2_consulta2
}