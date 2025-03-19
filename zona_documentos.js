const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function identificar_zona(socket,zona){
    // let sp_sql;
    // // let texto="select programada.documento,programada.despacho,programada.cliente,programada.destino,programada.nomdep,programada.nompro,programada.nomtra,programada.nom_ejecutivo,programada.tip_zona,programada.cant_zone from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.comodin2_imp=0) where programada.comodin1=1"
    // let texto="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.comodin2_imp=0) where programada.comodin1=1"
    // if(zona=='Z1'){ sp_sql=texto.replace("comodin1","zone1");sp_sql=sp_sql.replace("comodin2","z1") }
    // else if(zona=='Z2'){sp_sql=texto.replace("comodin1","zone2");sp_sql=sp_sql.replace("comodin2","z2")}
    // else if(zona=='Z3'){sp_sql=texto.replace("comodin1","zone3");sp_sql=sp_sql.replace("comodin2","z3")}
    // else if(zona=='desconocido'){sp_sql=texto.replace("comodin1","desconocido");sp_sql=sp_sql.replace("comodin2","desconocido")}
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            if(rows.length==0){
                socket.emit('lista documentos',{},zona)
                listar_impresos(socket,zona);
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
                socket.emit('lista documentos',respuesta2,zona);
                // io.to(`ZONA ${zona}`).emit('lista documentos',respuesta2,zona);
                listar_impresos(socket,zona);
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'nuevos');
    // conexion.execSql(consulta);
    conexion.callProcedure(consulta);
}

function listar_impresos(socket,zona){
    // let sp_sql;
    // let texto="select documento,comodin_imp,comodin_usr,cantidad from tbl01_api_almacen_documento_impreso where comodin_imp=1";
    // if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    // else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    // else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}
    // else if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            if(rows.length==0){
                socket.emit('impresos',{},zona)
                listar_picking(socket,zona);
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
                socket.emit('impresos',respuesta2,zona);
                listar_picking(socket,zona);
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'impresos');
    // conexion.execSql(consulta);
    conexion.callProcedure(consulta);
}

function listar_picking(socket,zona){
    // let sp_sql;
    // // let texto="select documento,comodin_pick,cantidad_pick,comodin_conf,cantidad_conf,comodin_usr from tbl01_api_almacen_documento_piking where comodin_pick=1";
    // let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where a.comodin_pick=1";
    // // let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where a.comodin_pick=1 group by a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr"
    // // let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0 AND b.despacho<>1) where a.comodin_pick=1 ";
    // if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    // else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    // else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}
    // else if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            conexion.close();
            if(rows.length==0){ socket.emit('lista picking',{},zona) }
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
                socket.emit('lista picking',respuesta2,zona);
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'pick');
    // conexion.execSql(consulta);
    conexion.callProcedure(consulta);
}

module.exports={identificar_zona}