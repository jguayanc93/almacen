

//////emitiendo el cambio de estado a piking del documento
// function estado_cambiado_piking(ndoc){ socket.emit('estado pick',ndoc); }

//////escuchando la respuesta del emisor de estado pick
socket.on('estado check',(ndoc)=>{ cambiar_estado_todos(ndoc); })

function cambiar_estado_todos(ndoc){
    //////ERROR
    document.getElementById("tabla-lista-picking").innerHTML="";
    
    for(let factura in ndoc){
        const item=document.createElement("td");
        item.textContent=ndoc[factura][0];
        const item2=document.createElement("td");
        item2.textContent=ndoc[factura][9];

        const boton=document.createElement("button");
        boton.setAttribute("id",'check-'+ndoc[factura][0]);
        boton.textContent="cheking";
        boton.addEventListener("click",()=>estado_cambiado_checking(ndoc[factura][0]));
        
        const armason=document.createElement("tr");
        armason.appendChild(item)
        armason.appendChild(item2)
        armason.appendChild(boton)
        document.getElementById("tabla-lista-picking").appendChild(armason);
    }
}

function estado_cambiado_checking(ndoc){
    let user=window.prompt(`chekear la factura ${ndoc}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        if(Number.isInteger(Number(user))){ socket.emit('estado final',ndoc,user); }
        else{ alert("valor no aceptable vuelve a intentarlo") }
    }
    // socket.emit('estado final',ndoc);
}

// socket.on('documentos pickings',(ndoc)=>{ cambiar_estado_todos(ndoc); })
socket.on('documentos pickings',(ndoc)=>{ cambiar_estado_todos(ndoc); })



