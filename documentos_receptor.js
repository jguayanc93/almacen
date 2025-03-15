const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function nuevos_documentos(socket){
    try{
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>err ? console.log(err) : nuevos_registros(socket));
    }
    catch(err){console.log(err)}
}

function nuevos_registros(socket){
    // let sp_sql="select programada.documento,programada.despacho,programada.cliente,programada.destino,programada.nomdep,programada.nompro,programada.nomtra,programada.nom_ejecutivo,programada.tip_zona,programada.cant_zone from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.z1_imp=0) where programada.zone1=1"
    // let sp_sql="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.z1_imp=0) where programada.zone1=1";
    // let texto="select programada.documento,programada.despacho,programada.cliente,programada.destino,programada.nomdep,programada.nompro,programada.nomtra,programada.nom_ejecutivo,programada.tip_zona,programada.cant_zone from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.comodin2_imp=0) where programada.comodin1=1"
    let sp_sql="select convert(varchar,a.fecha,103)as 'fecha',a.documento,a.cliente,CONCAT(a.hora,':',a.minutos)as 'hora',a.tip_zona,b.z1_imp,b.z2_imp,b.z3_imp,b.desconocido_imp,c.z1_pick,c.z2_pick,c.z3_pick,c.desconocido_pick,c.z1_conf,c.z2_conf,c.z3_conf,c.desconocido_conf,c.z1_usr,c.z2_usr,c.z3_usr,c.desconocido_usr,a.piking,a.despacho from tbl01_api_programar a join tbl01_api_almacen_documento_impreso b on (a.documento=b.documento) join tbl01_api_almacen_documento_piking c on (a.documento=c.documento) where a.despacho=1 and cheking=0";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            conexion.close();
            if(rows.length==0){
                // socket.emit('lista documentos',{},"Z1");
                console.log(`observando documentos nuevos para master VENTANILLA`)
                socket.emit('ventanilla impresos',{});
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
                // console.log(`observando documentos de ${zona} nuevos`)
                console.log(`observando documentos nuevos para master VENTANILLA`)
                socket.emit('ventanilla impresos',respuesta2);
            }
        }
    })
    conexion.execSql(consulta);
}

module.exports={nuevos_documentos}