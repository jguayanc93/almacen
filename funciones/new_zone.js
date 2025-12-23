
function nueva_zone(socket,zone){
    return new Promise((resolve,reject)=>{
        socket.join(`ZONA ${zone}`);
        resolve(`ingrese ala nueva zona ${zone}`);
    })
}

module.exports={nueva_zone}