/////////EXTRACCION DE ZONAS SEGUN ALMACEN EVENTOS DISCRIMINATORIOS
document.getElementById("ventanilla").addEventListener("click",()=>pasando_a_ventanilla())

function pasando_a_ventanilla(){
    let user=window.prompt("ventanilla usuario","aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        document.getElementById("distribucion").innerHTML="";
        emitir_eventos('ventanilla',0)
        // socket.emit('ventanilla',user,0);
    }
}
////////ALMACEN PRINCIPAL
document.getElementById("almprincipal").addEventListener("click",()=>{
    document.getElementById("almprincipal-opc").classList.toggle('hidden');
})

document.getElementById("alm1").addEventListener("click",()=>{
    // socket.emit('almacen principal',1);
    emitir_eventos('almacen principal',1)
    document.getElementById("almprincipal-opc").classList.toggle('hidden');
})

///////EMISORES DE ZONAS
document.getElementById("Z1").addEventListener("click",()=>{
    // socket.emit('cambio zona','Z1');
    emitir_eventos('cambio zona','Z1');
    document.getElementById("almprincipal-opc").classList.toggle('hidden');
})
document.getElementById("Z2").addEventListener("click",()=>{
    // socket.emit('cambio zona','Z2');
    emitir_eventos('cambio zona','Z2');
    document.getElementById("almprincipal-opc").classList.toggle('hidden');
})
document.getElementById("Z3").addEventListener("click",()=>{
    // socket.emit('cambio zona','Z3');
    emitir_eventos('cambio zona','Z3');
    document.getElementById("almprincipal-opc").classList.toggle('hidden');
})
document.getElementById("desconocido").addEventListener("click",()=>{
    // socket.emit('cambio zona','desconocido');
    emitir_eventos('cambio zona','desconocido')
    document.getElementById("almprincipal-opc").classList.toggle('hidden');
})

////////////ALMACEN MYM
document.getElementById("almmym").addEventListener("click",()=>{
    document.getElementById("almmym-opc").classList.toggle('hidden');
})

document.getElementById("alm8").addEventListener("click",()=>{
    // socket.emit('almacen mym',8);
    emitir_eventos('almacen mym',8);
    document.getElementById("almmym-opc").classList.toggle('hidden');
})

//////DESPACHO
document.getElementById("despacho").addEventListener("click",()=>{
    document.getElementById("despacho-opc").classList.toggle('hidden');
})

document.getElementById("despachop").addEventListener("click",()=>{
    emitir_eventos('despacho',1);
    document.getElementById("despacho-opc").classList.toggle('hidden');
})
document.getElementById("despachom").addEventListener("click",()=>{
    emitir_eventos('despacho',8);
    document.getElementById("despacho-opc").classList.toggle('hidden');
})

/////ACCIONES PARA MOSTRAR EL CONTENEDOR FLOTANTE DE INFORMACION DETALLADA
document.getElementById("flotante-cerrar").addEventListener('click',()=>{
    document.getElementById("flotante-superior").classList.add("hidden");
})