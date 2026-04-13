const {Request,TYPES} = require('../../conexion/cadena')

function nuevos_registros(resolve,reject,conexion,io,socket,ndoc,zona,user){
    let sp_sql="select a.ndocu,a.nomcli,d.dircli,a.ruccli,b.Nomvta,a.ndge,a.mone,a.orde,c.nomcdv,convert(varchar,a.fven,103)as 'fven',convert(varchar, a.fecha ,103)as 'fecha',a.tota,a.toti,a.totn,a.dirpar,'150113' as 'ubigeopp',a.dirent,'' as 'ubigeopll',a.Consig,convert(varchar, a.fecha ,103)as 'fecha_traslado',a.ruccli,a.nomcli,a.codtra,e.nomtra,0 as 'peso',CONCAT('(',a.codven_usu,')',TRIM(f.nomven),'/',CONVERT(varchar,a.FecReg,8),'/ALMACEN:',a.CodAlm,'/T.CAMBIO:',a.tcam,'/TIPODESPACHO:',TRIM(g.despacho),'/',TRIM(a.Consig),'/',a.observ) as 'observacion',a.TipEnt from mst01fac a join tbl01vta b on (b.codvta=a.codvta) join tbl01cdv c on (c.codcdv=a.Codcdv) join mst01cli d on (d.codcli=a.codcli) join tbl01tra e on (e.codtra=a.codtra) join tbl01ven f on (f.codven=a.codven_usu) join tbl_tipo_despacho g on (g.IDdespacho=a.TipEnt) where a.ndocu=@doc";
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
                let nuevo1=texto.replace("{{NUMEROFACTURA}}",respuesta[0][0])
                nuevo1=nuevo1.replace("{{clientenombre}}",respuesta[0][1])
                nuevo1=nuevo1.replace("{{clientedireccion}}",respuesta[0][2])
                nuevo1=nuevo1.replace("{{clienteruc}}",respuesta[0][3])
                nuevo1=nuevo1.replace("{{clientetipventa}}",respuesta[0][4])
                nuevo1=nuevo1.replace("{{clientenguia}}",respuesta[0][5])
                nuevo1=nuevo1.replace("{{clientecontacto}}",' ')
                if(respuesta[0][6]=="D"){
                    nuevo1=nuevo1.replace("{{clientemoneda}}","DOLARES")
                    nuevo1=nuevo1.replaceAll("{{MONESIMBOL}}","US$")
                }
                else if(respuesta[0][6]=="S"){
                    nuevo1=nuevo1.replace("{{clientemoneda}}","SOLES")
                    nuevo1=nuevo1.replaceAll("{{MONESIMBOL}}","S/")
                }
                // nuevo1=nuevo1.replace("{{clientemoneda}}",respuesta[0][6])
                nuevo1=nuevo1.replace("{{clienteorden}}",respuesta[0][7])
                nuevo1=nuevo1.replace("{{clientecondicionpago}}",respuesta[0][8])
                nuevo1=nuevo1.replace("{{clientefechaemision}}",respuesta[0][10])
                nuevo1=nuevo1.replace("{{clientefechavencimiento}}",respuesta[0][9])
                nuevo1=nuevo1.replace("{{clientetotalgravado}}",respuesta[0][11])
                nuevo1=nuevo1.replace("{{clienteigv}}",respuesta[0][12])
                nuevo1=nuevo1.replace("{{clientetotal}}",respuesta[0][13])
                nuevo1=nuevo1.replace("{{clienteptopartida}}",respuesta[0][14])
                nuevo1=nuevo1.replace("{{clienteubigeopp}}",respuesta[0][15])
                nuevo1=nuevo1.replace("{{clienteptollegada}}",respuesta[0][16])
                nuevo1=nuevo1.replace("{{clienteubigeopll}}",respuesta[0][17])
                nuevo1=nuevo1.replace("{{clientemottrasl}}",' ')
                nuevo1=nuevo1.replace("{{clienteconsignatario}}",respuesta[0][18])
                nuevo1=nuevo1.replace("{{clientefechatraslado}}",respuesta[0][19])
                nuevo1=nuevo1.replace("{{clienterucdestinatario}}",respuesta[0][20])
                nuevo1=nuevo1.replace("{{clientedestinatario}}",respuesta[0][21])
                nuevo1=nuevo1.replace("{{clienteructransportista}}",respuesta[0][22])
                nuevo1=nuevo1.replace("{{clientesocialtransportista}}",respuesta[0][23])
                nuevo1=nuevo1.replace("{{clienteobservacion}}",respuesta[0][25])
                if(respuesta[0][26]=="1"){nuevo1=nuevo1.replace("{{tipdespacho}}","(V)")}
                else if(respuesta[0][26]=="3"){nuevo1=nuevo1.replace("{{tipdespacho}}","(L)")}
                else if(respuesta[0][26]=="4"){nuevo1=nuevo1.replace("{{tipdespacho}}","(P)")}
                //////NUEVA MANERA DE REEMPLAZAR EL TEXTO
                nuevo1=nuevo1.replace("{imagenbiencolocada}",buff);
                resolve(nuevo1);
            }
        }
    })
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    conexion.callProcedure(consulta);
}

module.exports={nuevos_registros}