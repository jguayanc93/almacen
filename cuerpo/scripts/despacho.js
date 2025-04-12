document.getElementById("despachop").addEventListener("click",()=>despachop())
document.getElementById("despachom").addEventListener("click",()=>despachom())

function despachop(){socket.emit('despacho',1);
    document.getElementById("despacho-opc").classList.toggle('hidden');
}
function despachom(){socket.emit('despacho',8);
    document.getElementById("despacho-opc").classList.toggle('hidden');
}


socket.on('despacho venideros',(programados)=>{
    document.getElementById("tabla1titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla1descripcion").textContent="Nuevos documentos programados que vendran";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";
    /////////TERMINA DE REEMPLAZAR A DONDE DEBE INSERTARSE ESTAS DATA EN SUS RESPECTIVOS ELEMENTOS
    console.log(programados);

    const cuerpo=document.createElement('tbody');

    for(let doc in programados){
        const fecha=document.createElement('td');
        fecha.textContent=programados[doc][0];
        // item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const item2=document.createElement('td');
        item2.textContent=programados[doc][1];

        const cliente=document.createElement('td');
        cliente.textContent=programados[doc][2];

        const armason=document.createElement("tr");
        
        armason.appendChild(fecha)
        armason.appendChild(item2)
        armason.appendChild(cliente)

        cuerpo.appendChild(armason);
    }
    document.getElementById("tablero-maestro-control-inicio").appendChild(cuerpo);
})

socket.on('despacho recolectados',(programados)=>{
    document.getElementById("tabla2titulo").textContent="Control Checking";
    document.getElementById("tabla2descripcion").textContent="Permite observar los documentos terminados de almacen que pasaron a Despacho";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    console.log("documentos que pasaron el cheking")
    console.log(impresos);

    const cuerpo=document.createElement('tbody');
    for(let doc in programados){
        const item1=document.createElement('td');
        item1.textContent=impresos[doc][0];
        // item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const item2=document.createElement('td');
        item2.textContent=impresos[doc][1];

        const boton=document.createElement("button");
        boton.setAttribute("id","emb"+impresos[doc][0]);
        boton.textContent="embalado";
        // boton.addEventListener("click",()=>estado_cambiado_piking(impresos[documento][0],impresos[documento][3]));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        // armason.appendChild(item3)
        armason.appendChild(boton)

        cuerpo.appendChild(armason);
    }
    document.getElementById("tabla-despacho-recolectados").appendChild(cuerpo);
})
socket.on('despacho embalados',(programados)=>{
    document.getElementById("tabla3titulo").textContent="Embalar";
    document.getElementById("tabla3descripcion").textContent="Control de documentos Embalados";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";
    console.log("documentos embalados")
    console.log(impresos);

    for(let doc in programados){
        const item1=document.createElement('td');
        item1.textContent=impresos[doc][0];
        // item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const item2=document.createElement('td');
        item2.textContent=impresos[doc][1];

        const item3=document.createElement('td');
        item3.textContent=impresos[doc][2];

        const boton=document.createElement("button");
        boton.setAttribute("id","gui"+impresos[doc][0]);
        boton.textContent="GUIA";
        // boton.addEventListener("click",()=>estado_cambiado_piking(impresos[documento][0],impresos[documento][3]));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        armason.appendChild(item3)
        armason.appendChild(boton)
        document.getElementById("tabla-despacho-embalados").appendChild(armason);
    }
})
// function estado_cambiado_piking(ndoc,cantidad,zone){
//     let user=window.prompt(`quien va a comensar el picking de ${ndoc}`,"aqui digitar numero de trabajador");
//     if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
//     else{
//         socket.emit('estado pick',ndoc,cantidad,zone,user)
//     }
// }