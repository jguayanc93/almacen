const {config,Connection,Request,TYPES} = require('./conexion/cadena')

function data(socket,ndoc){
    let sp_sql="select documento,despacho,cliente,destino,nomdep,nompro,nomtra,nom_ejecutivo,tip_zona,cant_zone from tbl01_api_programar where documento=@doc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            if(rows.length==0){
                socket.emit('enviar informacion',{});
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
                socket.emit('enviar informacion',respuesta2);
            }
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}

module.exports={data}