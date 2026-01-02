const {Request,TYPES} = require('../../conexion/cadena')

function busqueda_usuario(resolve,reject,conexion,user){
    let sp_sql="select usuario from tbl01_api_almacen_usuarios where clave=@pass";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                resolve(false);
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
                resolve(respuesta2[0][0]);
            }
        }
    })
    consulta.addParameter('pass',TYPES.VarChar,user);
    conexion.execSsql(consulta);
}

module.exports={busqueda_usuario}