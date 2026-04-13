const {Request,TYPES} = require('../../conexion/cadena')

function nuevos_registros2(resolve,reject,conexion,io,socket,ndoc,zona,user){
    let sp_sql="select a.codf,a.cant,a.umed,a.descr,b.Usr_001,a.preu as 'v_unitario',a.preu as 'p_unitario',a.tota from dtl01fac a join prd0101 b on (a.codi=b.codi) where a.ndocu=@doc order by a.item";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                io.to(`ZONA ${zona}`).emit('lista documentos',{},zona);
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
                // console.log(respuesta2);
                let tablita_temp="";
                for(let item in respuesta2){
                    let html_tmp=`<tr>
                    <td>${respuesta2[item][0]}</td>
                    <td>${respuesta2[item][1]}</td>
                    <td>${respuesta2[item][2]}</td>
                    <td>${respuesta2[item][3]}</td>
                    <td>${respuesta2[item][4]}</td>
                    <td>${respuesta2[item][5]}</td>
                    <td>${respuesta2[item][6]}</td>
                    <td>${respuesta2[item][7]}</td></tr>`;
                    tablita_temp=tablita_temp+html_tmp;
                }
                let nuevo2=texto.replace("{{tablabody}}",tablita_temp)
                resolve(nuevo2);
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    conexion.callProcedure(consulta);
}

module.exports={nuevos_registros2}