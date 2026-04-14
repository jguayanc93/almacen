
socket.on('impresos',(impresos,zona)=>{
    document.getElementById("tabla-2-titulo").textContent="Documentos Impresos";
    document.getElementById("tabla-2-descripcion").textContent="Documentos impresos y listos para su trabajo";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    
    // Crear tabla con estructura de tbody
    let tbody = document.createElement('tbody');
    tbody.className = "divide-y divide-gray-200";

    for(let documento in impresos){
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 transition";

        const item1 = document.createElement('td');
        item1.textContent = impresos[documento][0];
        item1.className = "px-4 py-3 font-mono text-indigo-600 cursor-pointer";
        item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const item2 = document.createElement('td');
        item2.textContent = impresos[documento][2];
        item2.className = "px-4 py-3";

        const cellBtn = document.createElement('td');
        cellBtn.className = "px-4 py-3";
        const boton = document.createElement("button");
        boton.setAttribute("id","imp"+impresos[documento][0]);
        boton.className = "bg-amber-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-amber-600 transition";
        boton.textContent = "Picking";
        boton.addEventListener("click",()=>estado_cambiado_piking(impresos[documento][0],impresos[documento][3],zona));
        cellBtn.appendChild(boton);

        row.appendChild(item1);
        row.appendChild(item2);
        row.appendChild(cellBtn);
        tbody.appendChild(row);
    }

    document.getElementById("tablero-maestro-control-medio").appendChild(tbody);
})

function estado_cambiado_piking(ndoc,cantidad,zone){
    let user=window.prompt(`quien va a comensar el picking de ${ndoc}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        socket.emit('estado pick',ndoc,cantidad,zone,user)
    }
}