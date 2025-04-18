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
function obtenerpromesa_confirmar_consulta(conexion,ndoc,zona){
    return new Promise((resolve,reject)=>{
        documento_estado_confirmado(resolve,reject,conexion,ndoc,zona)
    })
}

function documento_estado_confirmado(resolve,reject,conexion,ndoc,zona){
    let sp_sql="jc_documentos_estado_confirmado";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            // document_lista_picking(resolve,reject,conexion,io,socket,ndoc,cantidad,zona);
            resolve("termine alfin el picking completo");
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,1);
    consulta.addParameter('user',TYPES.VarChar,'no necesario');
    conexion.callProcedure(consulta);
}
////////CALCULO SU CANTIDAD DE CONFIRMACIONES PARA SABER SI YA LLEGO A COMPLETAR TOTALMENTE EL PICKING
////////ACTUALISO SU CANTIDAD DE CONFIRMACIONES PARA ESTAR AL DIA DE CUANTAS CONFIRMACIONES VAN
////////VUELVO A ENVIAR LA LISTA DE DOCUMENTOS EN PICKING SOLO ESO PICKING PERO DE LA ZONA SOLICITADA
function obtenerpromesa_confirmar_consulta_nivel2(conexion,io,socket,ndoc,cantidad,zona){
    return new Promise((resolve,reject)=>{
        document_lista_picking(resolve,reject,conexion,io,socket,ndoc,cantidad,zona)
    })
}

function document_lista_picking(resolve,reject,conexion,io,socket,ndoc,cantidad,zona){
    let sp_sql="jc_documentos_estado_confirmado";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            if(rows.length==0){
                conexion.close();
                io.to(`ZONA ${zona}`).emit('lista picking',{},zona);
                io.to("ZONA VENTANILLA").to("ZONA PRINCIPAL").to("ZONA MYM").emit('f5');
                resolve("termine revisar los documentos confirmados pero habia 0 documentos");
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
                /////LOGICA EXTRA PARA SEPARAR LOS DOCUMENTOS CON PICKINS TERMINADOS
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
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,2);
    consulta.addParameter('user',TYPES.VarChar,'no necesario');
    conexion.callProcedure(consulta);
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
        // let sp_sql="update tbl01_api_programar set piking=1 where documento=@doc";
        let sp_sql="jc_documentos_estado_confirmado";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                conexion.close();
                reject(err);
            }
            else{
                pickings_terminados(resolve,reject,conexion,io,socket,documentos_terminados,contador+1,zona,documentos_incompletos)
            }
        })
        // consulta.addParameter('doc',TYPES.VarChar,documentos_terminados[contador]);
        consulta.addParameter('documento',TYPES.VarChar,documentos_terminados[contador]);
        consulta.addParameter('zona',TYPES.VarChar,'no necesario');
        consulta.addParameter('nivel',TYPES.Int,3);
        consulta.addParameter('user',TYPES.VarChar,'no necesario');
        conexion.callProcedure(consulta);
    }
}

function resto_zonas(resolve,reject,conexion,io,socket,documentos_incompletos,zona,zonas_aledañas,contador3){
    if(4<=contador3){
        conexion.close();
        io.to("ZONA VENTANILLA").to("ZONA PRINCIPAL").to("ZONA MYM").emit('f5');
        // socket.join(`ZONA ${zona}`)
        resolve("termine alfin el picking completo");
    }
    else{
        // let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where comodin_pick=1";
        // let sp_sql=texto.replaceAll("comodin",zonas_aledañas[contador3]);
        let sp_sql="jc_documentos_estado_confirmado";
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
        consulta.addParameter('documento',TYPES.VarChar,'no necesario');
        consulta.addParameter('zona',TYPES.VarChar,zonas_aledañas[contador3]);
        consulta.addParameter('nivel',TYPES.Int,4);
        consulta.addParameter('user',TYPES.VarChar,'no necesario');
        conexion.callProcedure(consulta);
    }
}


module.exports={
    documento_estado_confirmado,
    obtenerpromesa_confirmar,
    obtenerpromesa_confirmar_consulta,
    obtenerpromesa_confirmar_consulta_nivel2
}