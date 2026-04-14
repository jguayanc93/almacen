
socket.on('lista documentos',(msg,zone)=>{
    document.getElementById("tabla-1-titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla-1-descripcion").textContent="Nuevos documentos programados para ser trabajados";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";

    // Crear tabla con estructura de tbody 
    let tbody = document.createElement('tbody');
    tbody.className = "divide-y divide-gray-200";

    for(let documento in msg){
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 transition";

        /////CAMPO DOCUMENTO
        const item1 = document.createElement('td');
        item1.textContent = msg[documento][0];
        item1.className = "px-4 py-3 font-mono text-indigo-600 cursor-pointer";
        item1.addEventListener("click",()=>factura_informacion(msg[documento][0]))
        
        /////CAMPO DESPACHO
        const item2 = document.createElement('td');
        item2.textContent = msg[documento][1];
        item2.className = "px-4 py-3";
        
        /////CAMPO CLIENTE
        const item3 = document.createElement('td');
        item3.textContent = msg[documento][2];
        item3.className = "px-4 py-3";

        /////BOTÓN ACCIÓN
        const cellBtn = document.createElement('td');
        cellBtn.className = "px-4 py-3";
        const boton = document.createElement("button");
        boton.setAttribute("id", msg[documento][0]);
        boton.className = "bg-blue-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-blue-600 transition";
        boton.textContent = "Imprimir";
        boton.addEventListener("click",()=>estado_cambiado_impreso(msg[documento][0], zone));
        cellBtn.appendChild(boton);

        row.appendChild(item1);
        row.appendChild(item2);
        row.appendChild(item3);
        row.appendChild(cellBtn);
        tbody.appendChild(row);
    }

    document.getElementById("tablero-maestro-control-inicio").appendChild(tbody);
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