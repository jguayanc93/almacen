const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function obtenerpromesa_confirmar(){
    return new Promise((resolve,reject)=>{documento_confirmado(resolve,reject);})
}

function documento_confirmado(resolve,reject){
    let conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err) reject(err);
        else{
            // documento_estado_confirmado(io,socket,ndoc,cantidad,zona)
            resolve(conexion);
        }
    });
}
////////////SU ESTADO PASA A SER CONFIRMADO DEL PICKING EN SU ZONA
function obtenerpromesa_confirmar_consulta(conexion,io,socket,ndoc,cantidad,zona){
    return new Promise((resolve,reject)=>{
        documento_estado_confirmado(resolve,reject,conexion,io,socket,ndoc,cantidad,zona)
    })
}

function documento_estado_confirmado(resolve,reject,conexion,io,socket,ndoc,cantidad,zona){
    // let sp_sql;
    // let texto="update tbl01_api_almacen_documento_piking set comodin_conf=1 where documento=@doc";
    // if(zona=='desconocido'){sp_sql=texto.replace("comodin","desconocido")}
    // else if(zona=='Z1'){sp_sql=texto.replace("comodin","z1")}
    // else if(zona=='Z2'){sp_sql=texto.replace("comodin","z2")}
    // else if(zona=='Z3'){sp_sql=texto.replace("comodin","z3")}
    let sp_sql="jc_documentos_estados";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            // documento_cantidad_confirmada(io,socket,ndoc,cantidad,zona);
            document_lista_picking(resolve,reject,conexion,io,socket,ndoc,cantidad,zona);
        }
    })
    // consulta.addParameter('doc',TYPES.VarChar,ndoc);
    // conexion.execSql(consulta);
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,3);
    consulta.addParameter('user',TYPES.VarChar,'nadie');
    conexion.callProcedure(consulta);
}
////////CALCULO SU CANTIDAD DE CONFIRMACIONES PARA SABER SI YA LLEGO A COMPLETAR TOTALMENTE EL PICKING
function documento_cantidad_confirmada(io,socket,ndoc,cantidad,zona){
    // let sp_sql="select cantidad_pick,cantidad_conf,z1_conf,z2_conf,z3_conf,desconocido_conf from tbl01_api_almacen_documento_piking where documento=@doc";
    let sp_sql="select cantidad_pick,cantidad_conf,(z1_conf+z2_conf+z3_conf+desconocido_conf) as 'confirmaciones' from tbl01_api_almacen_documento_piking where documento=@doc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){ console.log(err);}
        else{
            if(rows.length==0){  console.log("vacio encontrado") }
            else{
                let respuesta=[];
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
                // cantidad_confirmada(io,socket,ndoc,cantidad,zona,cantidad_momentanea);
                cantidad_confirmada(io,socket,ndoc,cantidad,zona,respuesta[0][2]);
            }
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}
////////ACTUALISO SU CANTIDAD DE CONFIRMACIONES PARA ESTAR AL DIA DE CUANTAS CONFIRMACIONES VAN
function cantidad_confirmada(io,socket,ndoc,cantidad,zona,cantidad_momentanea){
    let sp_sql="update tbl01_api_almacen_documento_piking set cantidad_conf=@confirmado where documento=@doc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
        }
        else{
            document_lista_picking(io,socket,ndoc,cantidad,zona)
        }
    })
    consulta.addParameter('confirmado',TYPES.Int,cantidad_momentanea);
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}
////////VUELVO A ENVIAR LA LISTA DE DOCUMENTOS EN PICKING SOLO ESO PICKING PERO DE LA ZONA SOLICITADA
function document_lista_picking(resolve,reject,conexion,io,socket,ndoc,cantidad,zona){
    let sp_sql;
    let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where comodin_pick=1";
    
    if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    else if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}
    // let sp_sql="jc_documentos_estados";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            if(rows.length==0){
                conexion.close();
                console.log("OTRO VACIO ENCONTRADO");
                io.to(`ZONA ${zona}`).emit('lista picking',{},zona);
                //////EN PRUEBA EL ENVIO A LA ZONA MAESTRA
                // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                // io.to("ZONA LOCAL").emit('retornar',"actualisa maestro");
                /////////////
                io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                io.to("ZONA PRINCIPAL").emit('f5 a1',"actualisa maestro");
                io.to("ZONA MYM").emit('f5 a8',"actualisa maestro");
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
                /////////separar las confirmaciones completas de las q faltan confirmar en la lista de picking
                io.to(`ZONA ${zona}`).emit('lista picking',respuesta2,zona);

                let documentos_terminados=[];
                let documentos_incompletos=[];
                let contador2=0;
                for(let indice in respuesta2){
                    if(respuesta2[indice][2]==respuesta2[indice][4]){
                        documentos_terminados.push(respuesta2[indice][0])
                    }
                    else{ documentos_incompletos.push(respuesta2[indice]) }
                }

                if(documentos_terminados.length>0){
                    console.log("me estoi replicando porqe ya termine en todas las zonas")
                    let enviar={}
                    Object.assign(enviar,documentos_incompletos)
                    pickings_terminados(resolve,reject,conexion,io,socket,documentos_terminados,contador2,zona,enviar);
                }
            }
        }
    })
    conexion.execSql(consulta);
}

function pickings_terminados(resolve,reject,conexion,io,socket,documentos_terminados,contador,zona,documentos_incompletos){
    if(documentos_terminados.length<=contador){
        console.log("ya termine el bucle de picking en api_programar")
        let contador3=0;
        let zonas_replicar=["Z1","Z2","Z3","desconocido"];
        // socket.leave(`ZONA ${zona}`)
        resto_zonas(resolve,reject,conexion,io,socket,documentos_incompletos,zona,zonas_replicar,contador3)
    }
    else{
        let sp_sql="update tbl01_api_programar set piking=1 where documento=@doc";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject(err);
            }
            else{
                pickings_terminados(resolve,reject,conexion,io,socket,documentos_terminados,contador+1,zona,documentos_incompletos)
            }
        })
        consulta.addParameter('doc',TYPES.VarChar,documentos_terminados[contador]);
        conexion.execSql(consulta);
    }
}
// io.to(`ZONA ${zona}`).emit('lista picking',enviar,zona);//conexion.close();
function resto_zonas(resolve,reject,conexion,io,socket,documentos_incompletos,zona,zonas_aledañas,contador3){
    if(4<=contador3){
        conexion.close();
        //////EN PRUEBA EL ENVIO A LA ZONA MAESTRA
        // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
        // io.to("ZONA LOCAL").emit('retornar',"actualisa maestro");
        /////////////
        io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
        io.to("ZONA PRINCIPAL").emit('f5 a1',"actualisa maestro");
        io.to("ZONA MYM").emit('f5 a8',"actualisa maestro");
        // socket.join(`ZONA ${zona}`)
        resolve("termine alfin el picking completo");
    }
    else{
        console.log(zonas_aledañas[contador3]);
        // socket.join(`ZONA ${zonas_aledañas[contador3]}`)
        // let texto="select documento,comodin_pick,cantidad_pick,comodin_conf,cantidad_conf,comodin_usr from tbl01_api_almacen_documento_piking where comodin_pick=1";
        let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where comodin_pick=1";
        let sp_sql=texto.replaceAll("comodin",zonas_aledañas[contador3]);
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject(err);
            }
            else{
                if(rows.length==0){
                    console.log("aqui estaba el problema anterior")
                    io.to(`ZONA ${zonas_aledañas[contador3]}`).emit('lista picking',{},zonas_aledañas[contador3]);
                    resto_zonas(resolve,reject,conexion,io,socket,documentos_incompletos,zona,zonas_aledañas,contador3+1)
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
                    io.to(`ZONA ${zonas_aledañas[contador3]}`).emit('lista picking',respuesta2,zonas_aledañas[contador3]);
                    // socket.leave(`ZONA ${zonas_aledañas[contador3]}`)
                    resto_zonas(resolve,reject,conexion,io,socket,documentos_incompletos,zona,zonas_aledañas,contador3+1) 
                }
            }
        })
        conexion.execSql(consulta);
    }
}


module.exports={documento_estado_confirmado,obtenerpromesa_confirmar,obtenerpromesa_confirmar_consulta}