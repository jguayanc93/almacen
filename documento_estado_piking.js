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

function obtenerpromesa_pick_consulta(conexion,io,ndoc,cantidad,zona,user){
    return new Promise((resolve,reject)=>{
        documento_estado_piking(resolve,reject,conexion,io,ndoc,cantidad,zona,user)
    })
}

function documento_estado_piking(resolve,reject,conexion,io,ndoc,cantidad,zona,user){
    // let sp_sql;
    // let texto="update tbl01_api_almacen_documento_impreso set comodin_imp=2 where documento=@doc";
    // if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    // else if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    // else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    // else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}
    let sp_sql="jc_documentos_estados";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            // documento_estado_piking2(io,ndoc,cantidad,zona,user)
            document_lista_impreso(resolve,reject,conexion,io,ndoc,cantidad,zona,user)
        }
    })
    // consulta.addParameter('doc',TYPES.VarChar,ndoc);
    // conexion.execSql(consulta);
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,2);
    consulta.addParameter('user',TYPES.VarChar,user);
    conexion.callProcedure(consulta);
}

function documento_estado_piking2(io,ndoc,cantidad,zona,user){
    let sp_sql;
    let texto="update tbl01_api_almacen_documento_piking set comodin_pick=1,comodin_usr=@user where documento=@doc";
    if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    else if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{ document_lista_impreso(io,ndoc,cantidad,zona,user); }
    })
    consulta.addParameter('user',TYPES.VarChar,user);
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}

function document_lista_impreso(resolve,reject,conexion,io,ndoc,cantidad,zona,user){
    let sp_sql;
    let texto="select documento,comodin_imp,comodin_usr,cantidad from tbl01_api_almacen_documento_impreso where comodin_imp=1";
    if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    else if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}

    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            if(rows.length==0){
                io.to(`ZONA ${zona}`).emit('impresos',{},zona);
                document_lista_picking(resolve,reject,conexion,io,ndoc,cantidad,zona,user);
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
                document_lista_picking(resolve,reject,conexion,io,ndoc,cantidad,zona,user);
            }
        }
    })
    conexion.execSql(consulta);
}

function document_lista_picking(resolve,reject,conexion,io,ndoc,cantidad,zona,user){
    let sp_sql;
    // let texto="select documento,comodin_pick,cantidad_pick,comodin_conf,cantidad_conf,comodin_usr from tbl01_api_almacen_documento_piking where comodin_pick=1";
    // revisar la consulta para no mostrar en ventanilla
    let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where a.comodin_pick=1"
    if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    else if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}
    
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
                resolve("exitoso la transmision del pick")
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
                resolve("exitoso la transmision del pick")
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={documento_estado_piking,obtenerpromesa_pick,obtenerpromesa_pick_consulta}