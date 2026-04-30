const {Request,TYPES} = require('../../conexion/cadena')

function despacho_recolectado_filtrado(resolve,reject,conexion,socket,alm,ndoc){
    // let sp_sql="select despacho.documento,almacen.cliente from tbl01_api_programar almacen join tbl01_api_despacho_embalados despacho on (despacho.documento=almacen.documento) where almacen.cheking=1 AND despacho.embalado=0";
    // let sp_sql="select a.documento,CASE b.despacho when 3 then 'LIMA' when 4 then 'PROVINCIA' end,b.cliente,b.nomtra,b.nomdep,b.nompro,b.destino,c.observ from tbl01_api_despacho_checking a inner join tbl01_api_programar b on (b.documento=a.documento AND b.cheking=1) inner join mst01fac c on (c.ndocu=a.documento) where a.checkeado=0 AND b.despacho<>1 AND b.almacen='01'";
    let sp_sql="jc_documento_filtrado_despacho";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            console.log("error de ventanilla de registro sin pickings")
            reject(err)
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('despacho recolectados',{},alm,salida);
                resolve("exitoso la promesa de zona de consulta 2 despacho");
                // despacho_embalados(socket,user);
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
                socket.emit('despacho recolectados',respuesta2,alm,salida);
                resolve("exitoso la promesa de zona de consulta 2 despacho");
                // despacho_embalados(socket,user);
            }
        }
    })
    consulta.addParameter('alm',TYPES.Int,alm);
    consulta.addParameter('mostrar',TYPES.VarChar,'check');
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    conexion.callProcedure(consulta);
}

module.exports={despacho_recolectado_filtrado}