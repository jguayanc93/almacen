const {obtenerpromesa_zona,obtenerpromesa_zona_consulta} = require('./zona_documentos')


function revolver_disparador(bala){
    return new Promise((resolve,reject)=>{
        if(bala!=null){
            // clearInterval(disparo)
            clearInterval(bala)
            // disparo=null;
            bala=null;
            resolve("SI TENIA DISPARO");
        }
        else{
            resolve("NO TENIA DISPARO");
        }
    });
}
/////PRIMERA FUNCION DE COMPROBACION DE INTERVALO
function contador_balas(disparo){
    return new Promise((resolve)=>{
        console.log("esto es lo que tiene el intervalo al cambiar de zona en zona")
        console.log(disparo)
        resolve("resuelto con exito el conocer el valor del intervalo actual");
    })
}

///////SEGUNDA FUNCION DE LIMPIAR LOS ROOMS PARA ENTRAR EN LA RESPECTIVA ZONA
function zonas_limpiador(socket){
    return new Promise((resolve,reject)=>{
        socket.rooms.forEach((zone)=>{
            let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA desconocido','ZONA PRINCIPAL','ZONA MYM'];
            if(cuartos.includes(zone)) socket.rooms.delete(zone);
        })
        resolve("TERMINE DE LIMPIAR LAS ZONAS SOBRANTES");
    })
}

//////TERCERA FUNCION DE INGRESAR RESPECTIVAMENTE AL ROOM SELECIONADO UNA VES Q LOS DEMAS ESTEN LIMPIOS
function nueva_zone(socket,zone){
    return new Promise((resolve,reject)=>{
        socket.join(`ZONA ${zone}`);
        // resolve(`ingrese ala nueva zona ${zone}`);
        resolve(socket.rooms);
    })
}

////CUARTA FUNCION DE CONEXION Y CONSULTA RESPECTIVA CON SUS TIEMPOS
async function zonas(socket,zona){
    try{
        const primera_llamada=await obtenerpromesa_zona(socket,zona);
        // console.log(primera_llamada);
        const segunda_llamada=await obtenerpromesa_zona_consulta(socket,zona);
        // console.log(segunda_llamada);
    }
    catch(error){ console.log(error);}
}

async function ejecutar_intervalo_zona(disparo,socket,zona){
    const cargador=await contador_balas(disparo);
    console.log(cargador);
    const observador=await zonas_limpiador(socket);
    console.log(observador);
    const grupo=await nueva_zone(socket,zona);
    console.log(grupo);
    // const pistola=await revolver_disparador(disparo);
    // console.log(pistola);tener cuidado de usar esta funcion cuando posible redundancia
    disparo=setInterval(zonas,2000,socket,zona);
    // setTimeout(()=>{clearInterval(disparo);console.log("termine de sincronisar la zona")},30000);
}

module.exports={ejecutar_intervalo_zona}