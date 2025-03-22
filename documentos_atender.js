const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function mostrar_mensaje(socket,zona){
    try{
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>err ? console.log(err) : mostrar_mensaje2(socket,zona));
    }
    catch(err){console.log(err)}
}

function mostrar_mensaje2(socket,zona){
    // let sp_sql;
    // // let sp_sql="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.z1_imp=0) where programada.zone1=1";
    // let texto="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.comodin2_imp=0) where programada.comodin1=1"
    // if(zona=='Z1'){ sp_sql=texto.replace("comodin1","zone1");sp_sql=sp_sql.replace("comodin2","z1") }
    // else if(zona=='Z2'){sp_sql=texto.replace("comodin1","zone2");sp_sql=sp_sql.replace("comodin2","z2")}
    // else if(zona=='Z3'){sp_sql=texto.replace("comodin1","zone3");sp_sql=sp_sql.replace("comodin2","z3")}
    // else if(zona=='desconocido'){sp_sql=texto.replace("comodin1","desconocido");sp_sql=sp_sql.replace("comodin2","desconocido")}
    let sp_sql="jc_documentos_zonas";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error extraño de temporizador?")
            console.log("revisar las variables pasadas")
            console.log(zona);
            console.log(err);
        }
        else{
            // conexion.close();
            if(rows.length==0){
                // console.log(`nada que devolver de zona ${zona}`)
                socket.emit('lista documentos',{},zona);
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
                // console.log(`temporizador de zona ${zona}`)
                socket.emit('lista documentos',respuesta2,zona);
                listar_impresos(socket,zona)
            }
        }
    })
    consulta.addParameter('zona', TYPES.VarChar,zona);
    consulta.addParameter('nivel', TYPES.VarChar,'nuevos');
    // conexion.execSql(consulta);
    conexion.callProcedure(consulta);
}

function listar_impresos(socket,zona){
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
    conexion.callProcedure(consulta);
}

function listar_picking(socket,zona){
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
    conexion.callProcedure(consulta);
}




module.exports={mostrar_mensaje}