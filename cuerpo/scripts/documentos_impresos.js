
socket.on('impresos',(impresos,zona)=>{
    document.getElementById("tabla2titulo").textContent="Documentos Impresos";
    document.getElementById("tabla2descripcion").textContent="Documentos impresos y listos para su trabajo";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";

    for(let documento in impresos){
        const item1=document.createElement('td');
        item1.textContent=impresos[documento][0];
        item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const item2=document.createElement('td');
        item2.textContent=impresos[documento][2];

        const boton=document.createElement("button");
        boton.setAttribute("id","imp"+impresos[documento][0]);
        boton.textContent="picking";
        boton.addEventListener("click",()=>estado_cambiado_piking(impresos[documento][0],impresos[documento][3],zona));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        armason.appendChild(boton)
        document.getElementById("tablero-maestro-control-medio").appendChild(armason);
    }
})

function estado_cambiado_piking(ndoc,cantidad,zone){
    let user=window.prompt(`quien va a comensar el picking de ${ndoc}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        socket.emit('estado pick',ndoc,cantidad,zone,user)
    }
}