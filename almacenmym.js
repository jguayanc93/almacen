const {config,Connection,Request,TYPES} = require('./conexion/cadena')

async function revisar_mym(socket,alm){
    // const espera1=await nuevos_documentos_dinamicosmm(alm);
    const espera1=await observador_mym(socket,alm);
}

function observador_mym(socket,alm){
    return new Promise((resolve)=>{
        setInterval(nuevos_documentos_dinamicosmm,1000);
    })
}

function nuevos_documentos_dinamicosmm(socket,alm){
    try{
        conexion = new Connection(config);
        conexion.connect();
        conexion.on('connect',(err)=>err ? console.log(err) : nuevos_registrosmm(socket,alm));
    }
    catch(err){console.log(err)}
}

function nuevos_registrosmm(socket,alm){
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log(alm)
            console.log("error de consulta general para tabla maestro 1")
            console.log(err);
        }
        else{
            // conexion.close();
            if(rows.length==0){
                // console.log(`observando documentos nuevos para master LOCAL-PROVINCIA`)
                // socket.emit('lista documentos',{},zona);
                // socket.emit('ventanilla impresos',{});
                socket.emit('ventanilla mestro nuevos',{});
                local_provincia_registrosmm2(socket,alm);
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
                // console.log(`observando documentos nuevos para master LOCAL-PROVINCIA`)
                ////DEBE CONOCER SU ZONA ANTES DE EMITIR SINO CAUSA DATA INEXACTA
                // socket.emit('lista documentos',respuesta2,zona);
                // socket.emit('ventanilla impresos',respuesta2);
                socket.emit('ventanilla mestro nuevos',respuesta2);
                local_provincia_registrosmm2(socket,alm);
            }
        }
    })
    consulta.addParameter('despacho',TYPES.Int,alm);
    consulta.addParameter('mostrar',TYPES.VarChar,'nuevos');
    conexion.callProcedure(consulta);
}

function local_provincia_registrosmm2(socket,alm){
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de consulta general para tabla maestro 2")
            console.log(err);
        }
        else{
            // conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla mestro estados',{});
                local_provincia_registrosmm3(socket,alm)
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
                socket.emit('ventanilla mestro estados',respuesta2);
                local_provincia_registrosmm3(socket,alm)
            }
        }
    })
    consulta.addParameter('despacho', TYPES.Int,alm);
    consulta.addParameter('mostrar', TYPES.VarChar,'estados');
    conexion.callProcedure(consulta);
}

function local_provincia_registrosmm3(socket,alm){
    let sp_sql="jc_documentos_maestro";
    let consulta = new Request(sp_sql,(err,rowCount,rows)=>{
        if(err){
            console.log("error de consulta general para tabla maestro 3")
            console.log(err);
        }
        else{
            conexion.close();
            if(rows.length==0){
                socket.emit('ventanilla mestro terminados',{});
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
                socket.emit('ventanilla mestro terminados',respuesta2);
                // local_provincia_registros2(socket)
            }
        }
    })
    consulta.addParameter('despacho', TYPES.Int,alm);
    consulta.addParameter('mostrar', TYPES.VarChar,'terminados');
    conexion.callProcedure(consulta);
}

module.exports={nuevos_documentos_dinamicosmm}
// module.exports={revisar_mym}