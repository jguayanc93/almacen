

// socket.on('lista check2',(msg,alm)=>{
//     document.getElementById("tabla1titulo").textContent="Control Checking";
//     document.getElementById("tabla1descripcion").textContent="Permite observar los documentos terminados de almacen que pasaron a Despacho";
//     document.getElementById("tablero-maestro-control-medio").innerHTML="";

//     const cuerpo=document.createElement('tbody');
//     for(let documento in msg){
//         /////CAMPO DOCUMENTO
//         const item1=document.createElement('td');
//         item1.textContent=msg[documento][0];
//         // item1.addEventListener("click",()=>factura_informacion(msg[documento][0]))
//         /////CAMPO DESPACHO
//         const despacho=document.createElement('td');
//         despacho.textContent=msg[documento][1];
//         /////CAMPO CLIENTE
//         const cliente=document.createElement('td');
//         cliente.textContent=msg[documento][2];
//         /////CAMPO DESTINO
//         const destino=document.createElement('td');
//         msg[documento][1]==='P' ? destino.textContent=msg[documento][4] : destino.textContent=msg[documento][3];

//         const boton=document.createElement("button");
//         /////id repetido para diferentes documentos
//         boton.setAttribute("id","check2"+msg[documento][0]);
//         boton.textContent="CHEKEADO";
//         boton.addEventListener("click",()=>estado_despacho_check(msg[documento][0],alm));

//         const armason=document.createElement("tr");
//         armason.appendChild(item1)
//         armason.appendChild(despacho)
//         armason.appendChild(cliente)
//         armason.appendChild(destino)
//         armason.appendChild(boton)

//         cuerpo.appendChild(armason);
//     }
//     document.getElementById("tablero-maestro-control-medio").appendChild(cuerpo);
// })

