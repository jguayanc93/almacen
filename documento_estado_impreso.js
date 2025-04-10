const {config,Connection,Request,TYPES} = require('./conexion/cadena')
//////const path = require('path')
const fs = require('fs')
const puppeteer = require('puppeteer')
const JsBarcode = require('jsbarcode')
const {createCanvas} = require('canvas')
const path = require('path')
// Crear un canvas para generar el código de barras
const canvas=createCanvas();

function obtenerpromesa_impresion(){
    return new Promise((resolve,reject)=>{
        nuevas_impresiones(resolve,reject);
    })
}

function nuevas_impresiones(resolve,reject){
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            console.log("ERROR: ",err);
            reject(err);
        }
        else{
            resolve("exitoso la promesa de conexion para impresion");
            // documento_estado_impreso(io,socket,ndoc,zona,user);
        }
    });
}

function obtenerpromesa_impresion_consulta(io,socket,ndoc,zona,user){
    return new Promise((resolve,reject)=>{
        documento_estado_impreso(resolve,reject,io,socket,ndoc,zona,user);
    })
}

/////INSERTAR EL DOCUMENTO EN LA LISTA DE IMPRESOS
function documento_estado_impreso(resolve,reject,io,socket,ndoc,zona,user){
    let sp_sql="jc_documentos_estados";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(err);
            reject(err);
        }
        else{
            document_lista_actualisado(resolve,reject,io,socket,ndoc,zona,user);
        }
    })
    ////para el nuevo procedimiento    
    consulta.addParameter('documento',TYPES.VarChar,ndoc);
    consulta.addParameter('zona',TYPES.VarChar,zona);
    consulta.addParameter('nivel',TYPES.Int,1);
    consulta.addParameter('user',TYPES.VarChar,user);
    conexion.callProcedure(consulta);
}
////LISTAR LOS DOCUMENTOS RESTANTES REGISTRADOS Y SIN IMPRIMIR
function document_lista_actualisado(resolve,reject,io,socket,ndoc,zona,user){
    let sp_sql;
    // let sp_sql="select programada.documento,programada.despacho,programada.cliente,programada.destino,programada.nomdep,programada.nompro,programada.nomtra,programada.nom_ejecutivo,programada.tip_zona,programada.cant_zone from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.comodin2_imp=0) where programada.comodin1=1"
    // let texto="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora' from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.comodin2_imp=0) where programada.comodin1=1";
    let texto="select programada.documento,programada.despacho,programada.cliente,CONCAT(programada.hora,':',programada.minutos)as 'hora',programada.almacen from tbl01_api_programar programada join tbl01_api_almacen_documento_impreso imprimido on (programada.documento=imprimido.documento AND imprimido.comodin2_imp=0) where programada.comodin1=1"
    if(zona=='Z1'){ sp_sql=texto.replace("comodin1","zone1");sp_sql=sp_sql.replace("comodin2","z1") }
    else if(zona=='Z2'){sp_sql=texto.replace("comodin1","zone2");sp_sql=sp_sql.replace("comodin2","z2")}
    else if(zona=='Z3'){sp_sql=texto.replace("comodin1","zone3");sp_sql=sp_sql.replace("comodin2","z3")}
    else if(zona=='desconocido'){sp_sql=texto.replace("comodin1","desconocido");sp_sql=sp_sql.replace("comodin2","desconocido")}

    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error 1")
            console.log(err);
            reject(err);
        }
        else{
            if(rows.length==0){
                io.to(`ZONA ${zona}`).emit('lista documentos',{},zona);
                documento_lista_impreso(resolve,reject,io,socket,ndoc,zona,user);
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
                io.to(`ZONA ${zona}`).emit('lista documentos',respuesta2,zona);                
                // documento_lista_impreso(io,socket,ndoc,zona,user,respuesta2)
                documento_lista_impreso(resolve,reject,io,socket,ndoc,zona,user)
            }
        }
    })
    conexion.execSql(consulta);
}
//// LISTAR LOS DOCUMENTOS IMPRESOS ACTUALISADOS Y SIN PICKING
function documento_lista_impreso(resolve,reject,io,socket,ndoc,zona,user){
    let texto="select documento,comodin_imp,comodin_usr,cantidad from tbl01_api_almacen_documento_impreso where comodin_imp=1";
    let sp_sql;
    if(zona=='desconocido'){sp_sql=texto.replaceAll("comodin","desconocido")}
    else if(zona=='Z1'){sp_sql=texto.replaceAll("comodin","z1")}
    else if(zona=='Z2'){sp_sql=texto.replaceAll("comodin","z2")}
    else if(zona=='Z3'){sp_sql=texto.replaceAll("comodin","z3")}
    
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error 2");
            console.log(err);
            reject(err);
        }
        else{
            ////revivir luego la cerrada de conexion
            conexion.close();
            if(rows.length==0){
                io.to(`ZONA ${zona}`).emit('impresos',{},zona);
                resolve("exitoso la impresion")
                //////EN PRUEBA EL ENVIO A LA ZONA MAESTRA
                // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                // io.to("ZONA LOCAL").emit('retornar',"actualisa maestro");
                //////////
                // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                // io.to("ZONA PRINCIPAL").emit('f5 a1',"actualisa maestro 1");
                // io.to("ZONA MYM").emit('f5 a8',"actualisa maestro 8");
                //////////////////
                // io.emit("ZONA MYM").emit('f5 a8',"actualisa maestro");
                // socket.emit('f5 maestros',"actualisa maestro");
                // leer_file(ndoc,socket)
                /////////////
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
                io.to(`ZONA ${zona}`).emit('impresos',respuesta2,zona);
                resolve("exitoso la impresion")
                ////////////TERMINA LA SALIDA DEL PDF

                //////EN PRUEBA EL ENVIO A LA ZONA MAESTRA
                // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                // io.to("ZONA LOCAL").emit('retornar',"actualisa maestro");
                ///////////////
                // io.to("ZONA VENTANILLA").emit('f5 v',"actualisa maestro");
                // io.to("ZONA PRINCIPAL").emit('f5 a1',"actualisa maestro 1");
                // io.to("ZONA MYM").emit('f5 a8',"actualisa maestro 8");
                /////////////
                // socket.emit('f5 maestros',"actualisa maestro");
                //////REVIVIR LUEGO PARA COMPLETAR LA IMPRESION EN SU PROCESO DE CLICK
                // leer_file(ndoc,socket)
                /////////////
            }
        }
    })
    conexion.execSql(consulta);
}

////LECTURA DE ARCHIVO PLANO EN TEXTO
function leer_file(){
    return new Promise((resolve,reject)=>{
        const html=path.join(__dirname,'plantilla_factura.html');
        // const archivo_contenido=fs.readFileSync(html,'utf8');
        fs.readFile(html,'utf-8',(err,data)=>{
            if(err){
                reject(err);
            }
            resolve(data);
        });
    })
    // br_generador(ndoc,socket,archivo_contenido);
}

function br_generador(ndoc,socket,archivo_contenido){
    return new Promise((resolve,reject)=>{
        ////LLAMADA DE LA FUNCION PARA INSERTAR EL CODIGO DE BARRAS EN EL CANVAS CREADO
        JsBarcode(canvas,ndoc,{format:'CODE128',width:1,height:40,displayValue:false})

        const salida = fs.createWriteStream('factura-barras.png');
        salida.on('finish',()=>{
            console.log('archivo de imagen codigo barras generado');
            ////CREAR UNA BUSQUEDA SOLA PARA ESTO APARTE
            // iniciar_conexion(ndoc,socket,archivo_contenido)
        });

        /////CONSTRUCCION DEL CANVAS
        const stream = canvas.createPNGStream();
        stream.pipe(salida);////VALOR GUARDADO POR SIACASO DE LA FORMA ANTIGUA
        stream.on('end',resolve("termine de crear el canvas"))
        stream.on('error',reject("algo paso con el canvas"))
    })
}

function obtenerpromesa_factura_datos(){
    return new Promise((resolve,reject)=>{
        iniciar_conexion(resolve,reject);
    })
}

function iniciar_conexion(resolve,reject){
    conexion = new Connection(config);
    conexion.connect();
    conexion.on('connect',(err)=>{
        if(err){
            reject(err);
        }
        else{
            resolve("exitoso la promesa de conexion para la data de la factura")
        }
        // nuevos_registros(ndoc,socket,texto)
    });
}

function obtenerpromesa_factura_datos_consulta(ndoc,texto){
    return new Promise((resolve,reject)=>{
        nuevos_registros(resolve,reject,ndoc,texto)
    })
}

function nuevos_registros(resolve,reject,ndoc,texto){
    // let sp_sql="select a.ndocu,a.nomcli,a.dirent,a.ruccli,b.Nomvta,a.ndge,a.mone,a.orde,c.nomcdv,convert(varchar,a.fven,103)as 'fven',convert(varchar, a.fecha ,103)as 'fecha' from mst01fac a join tbl01vta b on (b.codvta=a.codvta) join tbl01cdv c on (c.codcdv=a.Codcdv) where a.ndocu='F009-0533502'";
    let sp_sql="select a.ndocu,a.nomcli,d.dircli,a.ruccli,b.Nomvta,a.ndge,a.mone,a.orde,c.nomcdv,convert(varchar,a.fven,103)as 'fven',convert(varchar, a.fecha ,103)as 'fecha',a.tota,a.toti,a.totn,a.dirpar,'150113' as 'ubigeopp',a.dirent,'' as 'ubigeopll',a.Consig,convert(varchar, a.fecha ,103)as 'fecha_traslado',a.ruccli,a.nomcli,a.codtra,e.nomtra,0 as 'peso',CONCAT('(',a.codven_usu,')',TRIM(f.nomven),'/',CONVERT(varchar,a.FecReg,8),'/ALMACEN:',a.CodAlm,'/T.CAMBIO:',a.tcam,'/TIPODESPACHO:',TRIM(g.despacho),'/',TRIM(a.Consig),'/',a.observ) as 'observacion',a.TipEnt from mst01fac a join tbl01vta b on (b.codvta=a.codvta) join tbl01cdv c on (c.codcdv=a.Codcdv) join mst01cli d on (d.codcli=a.codcli) join tbl01tra e on (e.codtra=a.codtra) join tbl01ven f on (f.codven=a.codven_usu) join tbl_tipo_despacho g on (g.IDdespacho=a.TipEnt) where a.ndocu=@doc";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err)
        }
        else{
            conexion.close();
            if(rows.length==0){
                console.log("VACIO ENCONTRADO FALLO");
                reject("no existe data de este documento");
            }
            else{
                let respuesta=[];
                // let respuesta2={};
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
                resolve(nuevo1);
                /////CAMBIANDO ESTO A 2 PETICIONES DE CONSULTAS
                // nuevos_registros2(resolve,reject,ndoc,nuevo1);
            }
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}

function obtenerpromesa_factura_datos_consulta2(ndoc,texto){
    return new Promise((resolve,reject)=>{
        nuevos_registros2(resolve,reject,ndoc,texto)
    })
}

function nuevos_registros2(resolve,reject,ndoc,texto){
    let sp_sql="select a.codf,a.cant,a.umed,a.descr,b.Usr_001,a.preu as 'v_unitario',a.preu as 'p_unitario',a.tota from dtl01fac a join prd0101 b on (a.codi=b.codi) where a.ndocu=@doc order by a.item";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            conexion.close();
            reject(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                console.log('VACIO ENCONTRADO FALLO')
                reject("no existe data en el detallado de la factura");
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
                // generatepdf2(nuevo2,ndoc,socket,'prueba.pdf')
                // .then(()=>console.log("PDF generado satisfactoriamente"))
                // .catch(err => console.error('error generando el PDF',err))
            }
        }
    })
    consulta.addParameter('doc',TYPES.VarChar,ndoc);
    conexion.execSql(consulta);
}

async function generatepdf2(htmlcontent,outputpath){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const filepath=path.resolve(__dirname,'plantilla_factura.html');
    await page.goto('file://'+filepath,{waitUntil:'load'});
    await page.setContent(htmlcontent);
    await page.pdf({
        path:outputpath,
        format:'A4',
        printBackground:true
    });
    await browser.close();
    console.log("PDF CREADO CON EXITO");
    // return "PDF CREADO CON EXITO";
}

function mandar_archivo(){
    return new Promise((resolve,reject)=>{
        const camino=path.join(__dirname,'/','prueba.pdf');

        if(fs.existsSync(camino)){
            fs.readFile(camino,(err,data)=>{
                if(err){
                    console.log("ocurrio un error con la lectura del archivo")
                    // console.log(err)
                    reject(err)
                }
                else{
                    // socket.emit('enviando archivo',data,ndoc)
                    resolve(data)
                    // resolve("exitoso")
                }
            })
        }
        else{
            reject("ruta de archivo no existe")
        }
    })
}

function emitir_documento(socket,pdf_raw,ndoc){
    return new Promise((resolve,reject)=>{
        socket.emit('enviando archivo',pdf_raw,ndoc)
        resolve("emiti el documento");
    })
}

module.exports={
    obtenerpromesa_impresion,
    obtenerpromesa_impresion_consulta,
    documento_estado_impreso,
    leer_file,
    br_generador,
    obtenerpromesa_factura_datos,
    obtenerpromesa_factura_datos_consulta,
    obtenerpromesa_factura_datos_consulta2,
    generatepdf2,
    mandar_archivo,
    emitir_documento
}