const cuartos = require('../rango_zonas');

function zonas_limpiador(socket){
    return new Promise((resolve,reject)=>{
        socket.rooms.forEach((zone)=>{
            // let cuartos=['ZONA Z1','ZONA Z2','ZONA Z3','ZONA desconocido','ZONA VENTANILLA','ZONA PRINCIPAL','ZONA MYM','ZONA DESPACHO'];
            if(cuartos.includes(zone)) socket.rooms.delete(zone);
        })
        resolve("TERMINE DE LIMPIAR LAS ZONAS SOBRANTES");
    })
}

module.exports={zonas_limpiador}