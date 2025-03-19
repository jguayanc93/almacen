const {config,Connection,Request,TYPES} = require('./conexion/cadena')

/////TERMINO PICKING Y PASO A ESTADO CHECKING
function documento_estado_checking(io,socket,ndoc,zonas,despacho,user){
    let contador=0
    let array_temporal=zonas.split(',');
    documento_bucle_actualisacion(io,socket,ndoc,array_temporal,despacho,user,contador);
}
function documento_bucle_actualisacion(io,socket,ndoc,array_temporal,despacho,user,contador){
    if(array_temporal.length<=contador){
        console.log("pase el bucle de piking")
        document_lista_actualisado(io,socket,ndoc,array_temporal,despacho,user);
    }
    else{
        // let sp_sql;
        // let texto="update tbl01_api_almacen_documento_piking set comodin_pick=2 where documento=@doc";
        // if(array_temporal[contador]=='desconocido'){sp_sql=texto.replace("comodin","desconocido")}
        // else if(array_temporal[contador]=='Z1'){sp_sql=texto.replace("comodin","z1")}
        // else if(array_temporal[contador]=='Z2'){sp_sql=texto.replace("comodin","z2")}
        // else if(array_temporal[contador]=='Z3'){sp_sql=texto.replace("comodin","z3")}
        let sp_sql="jc_documentos_estados";
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){console.log(err);}
            else{
                documento_bucle_actualisacion(io,socket,ndoc,array_temporal,despacho,user,contador+1)
            }
        })
        // consulta.addParameter('doc',TYPES.VarChar,ndoc);
        // conexion.execSql(consulta);
        consulta.addParameter('documento',TYPES.VarChar,ndoc);
        consulta.addParameter('zona',TYPES.VarChar,array_temporal[contador]);
        consulta.addParameter('nivel',TYPES.Int,4);
        consulta.addParameter('user',TYPES.VarChar,'nadie');
        conexion.callProcedure(consulta);
    }
}
////NO TE OLVIDES REPLANTEAR LA INSERCION EN LA NUEVA TABLA PORQE SOLO PUEDEN HACER CHEKING VENTANILLA Y LP
////ACTUALISACION DE LA TABLA CHECKING PARA EL DOCUMENTO Q YA ESTA EN CHECKING
function document_lista_actualisado(io,socket,ndoc,array_temporal,despacho,user){
    let sp_sql;
    if(despacho=="1"){
        // sp_sql="update tbl01_api_almacen_documento_checking2 set ventanilla=1,usr=@user where documento=@doc";
        sp_sql="update tbl01_api_almacen_documento_checking set ventanilla=1,usr=@user where documento=@doc";
    }
    else{
        // sp_sql="update tbl01_api_almacen_documento_checking2 set loca_provincia=1,usr=@user where documento=@doc";
        sp_sql="update tbl01_api_almacen_documento_checking set loca_provincia=1,usr=@user where documento=@doc";
    }    
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            // document_lista_picking(io,ndoc,cantidad,zona,user);
            document_lista_actualisado_programada(io,socket,ndoc,array_temporal,despacho,user);
        }
    })
    consulta.addParameter('user',TYPES.VarChar,user);
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}
/////////ACTUALISAR EL ESTADO DE CHEKING CONFIRMADO EN LA TABLA PRINCIPAL PARA SABER Q ACABO TODO SU PROCESO
function document_lista_actualisado_programada(io,socket,ndoc,array_temporal,despacho,user){
    let sp_sql="update tbl01_api_programar set cheking=1 where documento=@doc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            document_lista_picking(io,socket,despacho,ndoc);
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}
//////////PARA FINALIZAR SOLO DEBES ACTUALISAR LA LISTA DE PICKING DE TODAS LAS ZONAS PARA EXCLUIR LAS Q YA TIENEN CHECKING
////////////COMPARAR TU CONSULTA CONTRA LA LISTA FINAL
/////select a.documento,a.z1_pick,a.cantidad_pick,a.z1_conf,a.cantidad_conf,a.z1_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where a.z1_pick=1 group by a.documento,a.z1_pick,a.cantidad_pick,a.z1_conf,a.cantidad_conf,a.z1_usr
function document_lista_picking(io,socket,despacho,ndoc){
    // let texto="select documento,comodin_pick,cantidad_pick,comodin_conf,cantidad_conf,comodin_usr from tbl01_api_almacen_documento_piking where comodin_pick=1";
    // let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where a.comodin_pick=1 group by a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr"

    // if(despacho=="1"){socket.leave("ZONA VENTANILLA")}
    // else{socket.leave("ZONA LOCAL")}
    let zonas_replicar=["Z1","Z2","Z3","desconocido"];
    let contador=0;
    // resto_zonas(io,socket,contador,zona,zonas_replicar);
    resto_zonas(io,socket,despacho,ndoc,contador,zonas_replicar);
}

function resto_zonas(io,socket,despacho,ndoc,contador2,zonas_aledañas){
    if(zonas_aledañas.length<=contador2){
        // conexion.close();
        if(despacho=="1"){
            io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
        }
        else{
            io.to("ZONA LOCAL").emit('retornar',"actualisa maestro");
        }
        console.log("deberia estar ok todo")
        ////llamando ala funcion para ser trabajado por despacho
        new_despacho_registro(io,socket,ndoc)
        // socket.join(`ZONA ${zona}`)
    }
    else{
        console.log(contador2)
        console.log(zonas_aledañas[contador2]);
        // socket.join(`ZONA ${zonas_aledañas[contador2]}`)
        // let texto="select documento,comodin_pick,cantidad_pick,comodin_conf,cantidad_conf,comodin_usr from tbl01_api_almacen_documento_piking where comodin_pick=1";
        // let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where a.comodin_pick=1 group by a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr"
        let texto="select a.documento,a.comodin_pick,a.cantidad_pick,a.comodin_conf,a.cantidad_conf,a.comodin_usr from tbl01_api_almacen_documento_piking a join tbl01_api_programar b on (a.documento=b.documento AND b.cheking=0) where comodin_pick=1";
        
        let sp_sql=texto.replaceAll("comodin",zonas_aledañas[contador2]);
        let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
            if(err){
                console.log("error de bucle para cheking a otras zonas");
                console.log(err);
            }
            else{
                if(rows.length==0){
                    // falta enviar la refrescada al master para q se kite de la lista tanto de las zonas como la del master
                    console.log("aqui estaba el problema anterior")
                    io.to(`ZONA ${zonas_aledañas[contador2]}`).emit('lista picking',{},zonas_aledañas[contador2]);
                    resto_zonas(io,socket,despacho,ndoc,contador2+1,zonas_aledañas)
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
                    io.to(`ZONA ${zonas_aledañas[contador2]}`).emit('lista picking',respuesta2,zonas_aledañas[contador2]);
                    // socket.leave(`ZONA ${zonas_aledañas[contador2]}`)
                    resto_zonas(io,socket,despacho,ndoc,contador2+1,zonas_aledañas)
                }
            }
        })
        conexion.execSql(consulta);
    }
}

//////funcion para pasar aora a la tabla despacho y preparar su envio
function new_despacho_registro(io,socket,ndoc){
    // let sp_sql="update tbl01_api_programar set cheking=1 where documento=@doc";
    let sp_sql="update tbl01_api_despacho_embalados set embalado=0 where documento=@doc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            conexion.close();
            io.to(`ZONA DESPACHO`).emit('lista recolectados');
            // document_lista_picking(io,socket,despacho);
            //mandar ala tabla de registros embalados
            
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}

module.exports={documento_estado_checking}