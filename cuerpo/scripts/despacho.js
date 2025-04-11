document.getElementById("despachop").addEventListener("click",()=>despacho())
document.getElementById("despachom").addEventListener("click",()=>despacho())

function despacho(){
    socket.emit('despacho','principal');
}
function desapacho2(){}


socket.on('despacho venideros',(impresos)=>{
    document.getElementById("tabla1titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla1descripcion").textContent="Nuevos documentos programados que vendran";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";
    /////////TERMINA DE REEMPLAZAR A DONDE DEBE INSERTARSE ESTAS DATA EN SUS RESPECTIVOS ELEMENTOS
    console.log(impresos);

    for(let documento in impresos){
        const item1=document.createElement('td');
        item1.textContent=impresos[documento][0];
        item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const item2=document.createElement('td');
        impresos[documento][1]==3 ? item2.textContent="LOCAL" : item2.textContent="PROVINCIA";
        // item2.textContent=impresos[documento][1];

        const item3=document.createElement('td');
        item3.textContent=impresos[documento][2];

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        armason.appendChild(item3)
        document.getElementById("tabla-despacho-venideros").appendChild(armason);
    }
})

socket.on('despacho recolectados',(impresos)=>{
    document.getElementById("tabla2titulo").textContent="Control Checking";
    document.getElementById("tabla2descripcion").textContent="Permite observar los documentos terminados de almacen que pasaron a Despacho";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    console.log("documentos que pasaron el cheking")
    console.log(impresos);

    for(let documento in impresos){
        const item1=document.createElement('td');
        item1.textContent=impresos[documento][0];
        item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        // const item2=document.createElement('td');
        // impresos[documento][1]==3 ? item2.textContent="LOCAL" : item2.textContent="PROVINCIA";
        // // item2.textContent=impresos[documento][1];

        const item2=document.createElement('td');
        item2.textContent=impresos[documento][1];

        const boton=document.createElement("button");
        boton.setAttribute("id","emb"+impresos[documento][0]);
        boton.textContent="embalado";
        // boton.addEventListener("click",()=>estado_cambiado_piking(impresos[documento][0],impresos[documento][3]));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        // armason.appendChild(item3)
        armason.appendChild(boton)
        document.getElementById("tabla-despacho-recolectados").appendChild(armason);
    }
})
socket.on('despacho embalados',(impresos)=>{
    document.getElementById("tabla3titulo").textContent="Embalar";
    document.getElementById("tabla3descripcion").textContent="Control de documentos Embalados";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";
    console.log("documentos embalados")
    console.log(impresos);

    for(let documento in impresos){
        const item1=document.createElement('td');
        item1.textContent=impresos[documento][0];
        item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        // const item2=document.createElement('td');
        // impresos[documento][1]==3 ? item2.textContent="LOCAL" : item2.textContent="PROVINCIA";
        // // item2.textContent=impresos[documento][1];

        const item2=document.createElement('td');
        item2.textContent=impresos[documento][1];

        const item3=document.createElement('td');
        item3.textContent=impresos[documento][2];

        const boton=document.createElement("button");
        boton.setAttribute("id","gui"+impresos[documento][0]);
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