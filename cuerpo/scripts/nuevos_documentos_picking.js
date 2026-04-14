
socket.on('lista picking',(pikings,zona)=>{
    document.getElementById("tabla-3-titulo").textContent="Documentos Picking";
    document.getElementById("tabla-3-descripcion").textContent="Documentos para pikar/confirmar y mandar a su checking";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";

    // Crear tabla con estructura de tbody
    let tbody = document.createElement('tbody');
    tbody.className = "divide-y divide-gray-200";

    for(let documento in pikings){
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 transition";

        const item1 = document.createElement('td');
        item1.className = "px-4 py-3 font-mono text-indigo-600 cursor-pointer";
        item1.textContent = pikings[documento][0];
        item1.addEventListener("click",()=>factura_informacion(pikings[documento][0]))

        const item2 = document.createElement('td');
        item2.className = "px-4 py-3";
        item2.textContent = pikings[documento][5];

        const cellBtn = document.createElement('td');
        cellBtn.className = "px-4 py-3";

        const boton = document.createElement("button");
        boton.setAttribute("id","pick"+pikings[documento][0]);

        // Lógica de estado - SI EL DOCUMENTO TIENE SOLO 1 ZONA
        if(pikings[documento][2]==1){
            if(pikings[documento][3]==1){
                boton.className="bg-amber-500 rounded-md px-4 py-2 text-white text-sm font-mono w-full";
                boton.textContent="ESPERANDO CHECKING";
                boton.disabled = true;
            }
            else{
                boton.textContent="CONFIRMAR PICKING";
                boton.className="bg-green-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-green-600 transition";
                boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));
            }
        }
        // SI EL DOCUMENTO TIENE VARIAS ZONAS
        else{
            if(pikings[documento][3]==0){
                boton.textContent="CONFIRMAR PICKING";
                boton.className="bg-green-500 rounded-md px-4 py-2 text-white text-sm font-mono hover:bg-green-600 transition";
                boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));
            }
            else if(pikings[documento][3]==1){
                boton.className="bg-amber-500 rounded-md px-4 py-2 text-white text-sm font-mono w-full";
                boton.disabled = true;
                if(pikings[documento][4]<pikings[documento][2]){
                    boton.textContent="ESPERANDO OTRAS ZONAS";
                }
                else{
                    boton.textContent="ESPERANDO CHECKING";
                }
            }
        }

        cellBtn.appendChild(boton);
        row.appendChild(item1);
        row.appendChild(item2);
        row.appendChild(cellBtn);
        tbody.appendChild(row);
    }

    document.getElementById("tablero-maestro-control-fin").appendChild(tbody);
})


function estado_cambio_confirmado(documento,cantidad,zona){
    socket.emit('estado confirmado',documento,cantidad,zona);
}

// function estado_cambio_checking(documento,cantidad,zona){
function estado_cambio_checking(documento,zonas,despacho,identificador_maestro){
    let user=window.prompt(`quien va a confirmar el checking de ${documento}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        socket.emit('estado checking',documento,zonas,despacho,user,identificador_maestro);
        // continuar con el desencadenador para q tambien arroje a despacho
        // socket.emit('estado checking',documento,zonas,despacho,user);
    }
}