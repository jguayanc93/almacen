
function desempaquetador(paquete){
    return new Promise((resolve,reject)=>{
        if(paquete.startsWith("(F)")){
            // const tipo = paquete.slice(0,3);
            const ndoc = paquete.slice(3);
            resolve(["factura",ndoc]);
        }
        if(paquete.startsWith("(C)")){
            // const tipo = paquete.slice(0,3);
            const cliente = paquete.slice(3);
            resolve(["cliente",cliente]);
        }
    })
}

module.exports={desempaquetador}