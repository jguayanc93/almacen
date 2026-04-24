// document.getElementById("descargar").addEventListener("click",()=>{})

/////crearemmos 2 eventos para llamar a un buscador y luego otro para mostrar lo buscado
document.getElementById("crear-ruta-cliente").addEventListener("click",(e)=>{
    e.preventDefault();
    loadMenuItem('ventanilla');
    emitir_eventos('cliente ruta','cliente',1);
})

socket.on('mostrar ruta',()=>{
    document.getElementById("tabla-1-titulo").textContent = "Buscar Cliente";
    document.getElementById("tabla-1-descripcion").textContent = "ingresa tu cliente para asignacion de ruta";
    document.getElementById("tablero-maestro-control-inicio").innerHTML = "";
    document.getElementById("tabla-2-titulo").textContent="";
    document.getElementById("tabla-2-descripcion").textContent="";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    document.getElementById("tabla-3-titulo").textContent="";
    document.getElementById("tabla-3-descripcion").textContent="";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";

    const input=document.createElement("input");
    input.setAttribute("type","text");
    input.setAttribute("placeholder","ingresa el cliente");
    input.className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

    const boton=document.createElement("button");
    boton.textContent="buscar";
    boton.className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500";
    document.getElementById("tablero-maestro-control-inicio").appendChild(input);
    document.getElementById("tablero-maestro-control-inicio").appendChild(boton);
    boton.addEventListener("click",()=>{
        if(input.value.trim()===''){ alert("ingresa un cliente valido"); }
        else{
            console.log(input.value);
            // emitir_eventos('cliente ruta','cliente',input.value.trim());
        }
    })
})

// socket.on('mostrar cliente',(data)=>{
//     document.getElementById("tabla-1-titulo").textContent = "Cliente Destinos";
//     document.getElementById("tabla-1-descripcion").textContent = "direcciones de los clientes";
//     document.getElementById("tablero-maestro-control-inicio").innerHTML = "";

//     const thead = document.createElement("thead");
//     thead.className= 'bg-indigo-600 text-white sticky top-0';
//     const headerRow = document.createElement("tr");
//     const headers = ["Cliente", "Direcciones", "Dir.Principal"];
//     headers.forEach(headerText => {
//         const th = document.createElement("th");
//         th.textContent = headerText;
//         th.className = "px-6 py-3 text-left font-semibold";
//         headerRow.appendChild(th);
//     });
//     thead.appendChild(headerRow);
//     document.getElementById("tablero-maestro-control-inicio").appendChild(thead);

//     const cuerpo=document.createElement("tbody");
//     let rowIndex = 0;
//     for(let doc in data){
//         const cliente=document.createElement("td");
//         cliente.textContent=data[doc][2];
//         cliente.className="px-6 py-4 border-b border-gray-200";

//         const dirprincipal=document.createElement("td");
//         dirprincipal.textContent=data[doc][3];
//         dirprincipal.className="px-6 py-4 border-b border-gray-200";

//         const fila=document.createElement('tr');
//         if(rowIndex % 2 === 0){
//             fila.className = "bg-white hover:bg-indigo-50"
//         }
//         else{
//             fila.className = "bg-gray-50 hover:bg-indigo-50";
//         }

//         fila.appendChild(cliente);
//         fila.appendChild(dirprincipal);
//         cuerpo.appendChild(fila);

//         cuerpo.appendChild(fila);
//         rowIndex++;
//     }
//     document.getElementById("tablero-maestro-control-inicio").appendChild(cuerpo);
// })