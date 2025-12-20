
socket.on('lista documentos',(msg,zone)=>{
    document.getElementById("tabla1titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla1descripcion").textContent="Nuevos documentos programados para ser trabajados";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";

    for(let documento in msg){
        /////CAMPO DOCUMENTO
        const item1=document.createElement('td');
        item1.textContent=msg[documento][0];
        item1.className="font-mono";
        item1.addEventListener("click",()=>factura_informacion(msg[documento][0]))
        /////CAMPO DESPACHO
        const item2=document.createElement('td');
        item2.textContent=msg[documento][1];
        /////CAMPO CLIENTE
        const item3=document.createElement('td');
        item3.textContent=msg[documento][2];
        /////CAMPO DESTINO
        // const item4=document.createElement('td');
        // item4.textContent=msg[documento][3];

        const boton=document.createElement("button");
        /////id repetido para diferentes documentos
        boton.setAttribute("id",msg[documento][0]);
        boton.className="bg-blue-500 rounded-md w-24 text-white text-sm font-mono";
        boton.textContent="imprimir";
        boton.addEventListener("click",()=>estado_cambiado_impreso(msg[documento][0],zone));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(boton)
        armason.appendChild(item2)
        armason.appendChild(item3)
        // armason.appendChild(item4)
        document.getElementById("tablero-maestro-control-inicio").appendChild(armason);
    }
    /////////////////////ESTO PARA LA NUEVA VERSION AHORA DEBE CAMBIARSE POR LA NUEVA
    let primeratablatitulo=document.getElementById("primeratablatitulo");
    primeratablatitulo.className="text-center text-xl font-bold";
    primeratablatitulo.textContent="NUEVOS DOCUMENTOS";
    let primeratablamensaje=document.getElementById("primeratablamensaje");
    primeratablamensaje.className="text-center text-lg font-medium";
    primeratablamensaje.textContent=`Documentos para la zona ${zone} a buscar`;
    let primeratabla=document.getElementById("tablero-maestro-control-inicio2");
    primeratabla.innerHTML="";
    for(let documento in msg){
        /////CAMPO DOCUMENTO
        const item1=document.createElement('td');
        item1.textContent=msg[documento][0];
        item1.className="truncate w-[20%]";
        item1.addEventListener("click",()=>factura_informacion(msg[documento][0]))
        /////CAMPO DESPACHO
        const item2=document.createElement('td');
        item2.className="truncate w-[20%]";
        item2.textContent=msg[documento][1];
        /////CAMPO CLIENTE
        const item3=document.createElement('td');
        item3.className="border-b-2 truncate w-[40%]";
        item3.textContent=msg[documento][2];
        /////CAMPO DESTINO
        // const item4=document.createElement('td');
        // item4.textContent=msg[documento][3];

        const boton=document.createElement("button");
        /////id repetido para diferentes documentos
        boton.setAttribute("id",msg[documento][0]);
        boton.className="bg-blue-500 rounded-md w-full text-white font-mono";
        boton.textContent="imprimir";
        // boton.addEventListener("click",()=>estado_cambiado_impreso(msg[documento][0],zone));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(boton)
        armason.appendChild(item2)
        armason.appendChild(item3)
        // armason.appendChild(item4)
        document.getElementById("tablero-maestro-control-inicio2").appendChild(armason);
    }
})

///////ACCIONES DE FLUJO
function estado_cambiado_impreso(documento,zona){
    let user=window.prompt(`quien va imprimir la factura ${documento}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        socket.emit('estado impreso',documento,zona,user)
    }
    // socket.emit('estado impreso',documento,zona,'yo ps')
}