//////FALTA TERMINAR
// socket.on('lista picking',(pikings,zona)=>{
//     document.getElementById("tabla-lista-picking").innerHTML="";

//     for(let documento in pikings){
//         const item1=document.createElement('td');
//         item1.textContent=pikings[documento][0];
//         item1.addEventListener("click",()=>factura_informacion(pikings[documento][0]))

//         const item2=document.createElement('td');
//         item2.textContent=pikings[documento][5];

//         const boton=document.createElement("button");
//         boton.setAttribute("id","pick"+pikings[documento][0]);
//         if(pikings[documento][2]==1){
//             // boton.textContent="checking";
//             // boton.addEventListener("click",()=>estado_cambio_checking(pikings[documento][0],pikings[documento][2],zona));
//             boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));
//             if(pikings[documento][3]==1){
//                 // boton.textContent="checking";
//                 boton.textContent="esperando MASTER";
//                 // boton.addEventListener("click",()=>estado_cambio_checking(pikings[documento][0],pikings[documento][2],zona));
//             }
//             else{
//                 boton.textContent="confirmar picking";
//                 boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));
//             }
//         }
//         else{
//             if(pikings[documento][3]==0){
//                 boton.textContent="confirmar picking";
//                 boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));
//             }
//             else if(pikings[documento][3]==1){
//                 if(pikings[documento][4]<pikings[documento][2]){
//                     boton.textContent="esperando otras zonas";
//                 }
//                 else{
//                     // boton.textContent="checking";
//                     boton.textContent="esperando MASTER";
//                     // boton.addEventListener("click",()=>estado_cambio_checking(pikings[documento][0],pikings[documento][2],zona));
//                 }
//             }
//         }
//         // boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));

//         const armason=document.createElement("tr");
//         armason.appendChild(item1)
//         armason.appendChild(item2)
//         armason.appendChild(boton)
//         document.getElementById("tabla-lista-picking").appendChild(armason);
//     }
// })

socket.on('lista picking',(pikings,zona)=>{
    document.getElementById("tabla3titulo").textContent="Documentos Picking";
    document.getElementById("tabla3descripcion").textContent="Documentos para pikar/confirmar y mandar a su checking";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";

    for(let documento in pikings){
        const item1=document.createElement('td');
        item1.textContent=pikings[documento][0];
        item1.addEventListener("click",()=>factura_informacion(pikings[documento][0]))

        const item2=document.createElement('td');
        item2.textContent=pikings[documento][5];

        const boton=document.createElement("button");
        boton.setAttribute("id","pick"+pikings[documento][0]);
        ///SI EL DOCUMENTO TIENE SOLO 1 ZONA
        if(pikings[documento][2]==1){
            if(pikings[documento][3]==1){boton.textContent="ESPERANDO CHECKING";}
            else{
                boton.textContent="CONFIRMAR PICKING";
                boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));
            }
        }
        ////SI EL DOCUMENTO TIENE VARIAS ZONAS
        else{
            if(pikings[documento][3]==0){
                boton.textContent="CONFIRMAR PICKING";
                boton.addEventListener("click",()=>estado_cambio_confirmado(pikings[documento][0],pikings[documento][2],zona));
            }
            else if(pikings[documento][3]==1){
                if(pikings[documento][4]<pikings[documento][2]){boton.textContent="ESPERANDO OTRAS ZONAS";}
                else{ boton.textContent="ESPERANDO CHECKING";}
            }
        }
        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        armason.appendChild(boton)
        document.getElementById("tablero-maestro-control-fin").appendChild(armason);
    }
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