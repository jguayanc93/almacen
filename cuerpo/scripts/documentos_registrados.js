
socket.on('lista documentos',(msg,zone)=>{
    document.getElementById("tabla-lista").innerHTML="";

    for(let documento in msg){
        /////CAMPO DOCUMENTO
        const item1=document.createElement('td');
        item1.textContent=msg[documento][0];
        item1.addEventListener("click",()=>factura_informacion(msg[documento][0]))
        /////CAMPO DESPACHO
        const item2=document.createElement('td');
        // msg[documento][1]=='3' ? item2.textContent='LIMA' : item2.textContent='PROVINCIA'+'('+msg[documento][4]+')';
        if(msg[documento][1]=='1'){item2.textContent='VENTANILLA'}
        else if(msg[documento][1]=='3'){item2.textContent='LIMA'}
        else if(msg[documento][1]=='4'){item2.textContent='PROVINCIA'}
        /////CAMPO CLIENTE
        const item3=document.createElement('td');
        item3.textContent=msg[documento][2];
        /////CAMPO DESTINO
        const item4=document.createElement('td');
        item4.textContent=msg[documento][3];

        const boton=document.createElement("button");
        /////id repetido para diferentes documentos
        boton.setAttribute("id",msg[documento][0]);
        boton.textContent="imprimir";
        boton.addEventListener("click",()=>estado_cambiado_impreso(msg[documento][0],zone));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(boton)
        armason.appendChild(item2)
        armason.appendChild(item3)
        armason.appendChild(item4)
        document.getElementById("tabla-lista").appendChild(armason);
    }
})

function estado_cambiado_impreso(documento,zona){
    let user=window.prompt(`quien va imprimir la factura ${documento}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        socket.emit('estado impreso',documento,zona,user)
    }
}