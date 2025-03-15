const path = require('path')
const fs = require('fs')
const puppeteer = require('puppeteer')
const JsBarcode = require('jsbarcode')
const {createCanvas} = require('canvas')
// Crear un canvas para generar el código de barras
const canvas=createCanvas();

async function generatepdf(htmlcontent,outputpath){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(leer_file());
    await page.pdf({
        path:outputpath,
        format:'A4',
        printBackground:true
    });
    // await page.goto("http://127.0.0.1:5500/plantilla_factura.html")
    // await page.pdf({
    //     path:"prueba.pdf",
    //     format:'A4',
    //     printBackground:true
    // });
    await browser.close();
}
// const html=__dirname+'/test.html';///imprime la ruta no el archivo
function leer_file(){
    const html=path.join(__dirname,'plantilla_factura.html');
    // const archivo_contenido=await fs.readFileSync(html,'utf-8');
    const archivo_contenido=fs.readFileSync(html,'utf8');
    return archivo_contenido;
}
// generatepdf("html",'prueba.pdf').then(()=>console.log("PDF generado satisfactoriamente"))
// .catch(err => console.error('error generando el PDF',err))

const {config,Connection,Request,TYPES} = require('./conexion/cadena')

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
}

/////generacion del codigo de barras
function br_generador(){
    JsBarcode(canvas,'F009-0533502',{
        format:'CODE128',
        width:1,
        height:40,
        displayValue:false,
    })

    const salida = fs.createWriteStream('factura-barras.png');
    const stream = canvas.createPNGStream();
    stream.pipe(salida);
    salida.on('finish',()=>{console.log('Codigo de barras generado')});
}

function iniciar_conexion(texto){
    try{
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>err ? console.log(err) : nuevos_registros(texto));
    }catch(err){console.log(err)}
}
function nuevos_registros(texto){
    // let sp_sql="select a.ndocu,a.nomcli,a.dirent,a.ruccli,b.Nomvta,a.ndge,a.mone,a.orde,c.nomcdv,convert(varchar,a.fven,103)as 'fven',convert(varchar, a.fecha ,103)as 'fecha' from mst01fac a join tbl01vta b on (b.codvta=a.codvta) join tbl01cdv c on (c.codcdv=a.Codcdv) where a.ndocu='F009-0533502'";
    let sp_sql="select a.ndocu,a.nomcli,d.dircli,a.ruccli,b.Nomvta,a.ndge,a.mone,a.orde,c.nomcdv,convert(varchar,a.fven,103)as 'fven',convert(varchar, a.fecha ,103)as 'fecha',a.tota,a.toti,a.totn,a.dirpar,'150113' as 'ubigeopp',a.dirent,'' as 'ubigeopll',a.Consig,convert(varchar, a.fecha ,103)as 'fecha_traslado',a.ruccli,a.nomcli,a.codtra,e.nomtra,0 as 'peso',CONCAT('(',a.codven_usu,')',TRIM(f.nomven),'/',CONVERT(varchar,a.FecReg,8),'/ALMACEN:',a.CodAlm,'/T.CAMBIO:',a.tcam,'/TIPODESPACHO:',TRIM(g.despacho),'/',TRIM(a.Consig),'/',a.observ) as 'observacion',a.TipEnt from mst01fac a join tbl01vta b on (b.codvta=a.codvta) join tbl01cdv c on (c.codcdv=a.Codcdv) join mst01cli d on (d.codcli=a.codcli) join tbl01tra e on (e.codtra=a.codtra) join tbl01ven f on (f.codven=a.codven_usu) join tbl_tipo_despacho g on (g.IDdespacho=a.TipEnt) where a.ndocu='F009-0533502'";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            // conexion.close();
            if(rows.length==0){ console.log(`VACIO ENCONTRADO FALLO`) }
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
                nuevos_registros2(nuevo1);
            }
        }
    })
    conexion.execSql(consulta);
}
function nuevos_registros2(texto){
    let sp_sql="select a.codf,a.cant,a.umed,a.descr,b.Usr_001,a.preu as 'v_unitario',a.preu as 'p_unitario',a.tota from bdnava01.dbo.dtl01fac a join bdnava01.dbo.prd0101 b on (a.codi=b.codi) where a.ndocu='F009-0540934' order by a.item";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){console.log(err);}
        else{
            conexion.close();
            if(rows.length==0){ console.log(`VACIO ENCONTRADO FALLO`) }
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
                // console.log(nuevo2)
                generatepdf2(nuevo2,'prueba.pdf').then(()=>console.log("PDF generado satisfactoriamente")).catch(err => console.error('error generando el PDF',err))
            }
        }
    })
    conexion.execSql(consulta);
}
// console.log(leer_file())
let maqueta=leer_file();
br_generador()
iniciar_conexion(maqueta)

