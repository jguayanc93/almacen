const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_pick(){
    return new Promise((resolve,reject)=>{documento_pick(resolve,reject)})
}

function documento_pick(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err) reject(err);
        else{
            resolve(conexion);
        }
    });
}

function obtenerpromesa_pick_consulta(conexion,ndoc,zona,user){
    return new Promise((resolve,reject)=>{
        documento_estado_piking(resolve,reject,conexion,ndoc,zona,user)
    })
}

function documento_estado_piking(resolve,reject,conexion,ndoc,zona,user){
    let sp_sql="jc_documentos_estado_pick";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            // document_lista_impreso(resolve,reject,conexion,io,ndoc,cantidad,zona,user)
            resolve("IMPRESO PASADO A ESTADO 2 Y PICKING EN ESTADO 1");
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,1);
    consulta.addParameter('user',TYPES.VarChar,user);
    conexion.callProcedure(consulta);
}

function obtenerpromesa_pick_consulta_nivel2(conexion,io,ndoc,zona,user){
    return new Promise((resolve,reject)=>{
        document_lista_impreso(resolve,reject,conexion,io,ndoc,zona,user)
    })
}

function document_lista_impreso(resolve,reject,conexion,io,ndoc,zona,user){
    let sp_sql="jc_documentos_estado_pick";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                io.to(`ZONA ${zona}`).emit('impresos',{},zona);
                resolve("MOSTRANDO DOCUMENTOS IMPRESOS Y SIN PIKAR");
                // document_lista_picking(resolve,reject,conexion,io,ndoc,cantidad,zona,user);
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
                io.to(`ZONA ${zona}`).emit('impresos',respuesta2,zona);
                resolve("MOSTRANDO DOCUMENTOS SOLO IMPRESOS Y SIN PIKAR");
                // document_lista_picking(resolve,reject,conexion,io,ndoc,cantidad,zona,user);
            }
        }
    })
    // conexion.execSql(consulta);
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,2);
    consulta.addParameter('user',TYPES.VarChar,user);
    conexion.callProcedure(consulta);
}

function obtenerpromesa_pick_consulta_nivel3(conexion,io,ndoc,zona,user){
    return new Promise((resolve,reject)=>{
        document_lista_picking(resolve,reject,conexion,io,ndoc,zona,user)
    })
}

function document_lista_picking(resolve,reject,conexion,io,ndoc,zona,user){
    let sp_sql="jc_documentos_estado_pick";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                console.log("REVISAR VACIO PARA EL PICKING");
                io.to(`ZONA ${zona}`).emit('lista picking',{},zona);
                //////EN PRUEBA EL ENVIO A LA ZONA MAESTRA
                // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                // io.to("ZONA LOCAL").emit('retornar',"actualisa maestro");
                /////////////
                io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                io.to("ZONA PRINCIPAL").emit('f5 a1',"actualisa maestro");
                io.to("ZONA MYM").emit('f5 a8',"actualisa maestro");
                resolve("MOSTRANDO DOCUMENTOS SOLO PIKADOS")
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
                io.to(`ZONA ${zona}`).emit('lista picking',respuesta2,zona);
                //////EN PRUEBA EL ENVIO A LA ZONA MAESTRA
                // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                // io.to("ZONA LOCAL").emit('retornar',"actualisa maestro");
                /////////////
                io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                io.to("ZONA PRINCIPAL").emit('f5 a1',"actualisa maestro");
                io.to("ZONA MYM").emit('f5 a8',"actualisa maestro");
                resolve("MOSTRANDO DOCUMENTOS SOLO PIKADOS")
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,3);
    consulta.addParameter('user',TYPES.VarChar,user);
    conexion.callProcedure(consulta);
}

module.exports={
    documento_estado_piking,
    obtenerpromesa_pick,
    obtenerpromesa_pick_consulta,
    obtenerpromesa_pick_consulta_nivel2,
    obtenerpromesa_pick_consulta_nivel3
}