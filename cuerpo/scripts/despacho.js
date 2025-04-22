document.getElementById("despachop").addEventListener("click",()=>{
    emitir_eventos('despacho',1);
    document.getElementById("despacho-opc").classList.toggle('hidden');
})
document.getElementById("despachom").addEventListener("click",()=>{
    emitir_eventos('despacho',8);
    document.getElementById("despacho-opc").classList.toggle('hidden');
})

socket.on('a despacho',()=>refresco());///para mostrar los nuevos pasados a despacho pero sin chekeado2
///////FALTA CREAR SUS RESPECTIVOS EVENTOS PARA EL CHECK2 Y EL EMBALADO Y OTRA FUNCION
socket.on('despacho venideros',(programados)=>{
    document.getElementById("tabla1titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla1descripcion").textContent="Nuevos documentos programados que vendran";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";
    /////////TERMINA DE REEMPLAZAR A DONDE DEBE INSERTARSE ESTAS DATA EN SUS RESPECTIVOS ELEMENTOS
    console.log("despacho los que vienen")
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

        const destino=document.createElement('td');
        // destino.textContent=programados[doc][3];///ERA PARA DEAR SOLO EL DESTINO
        programados[doc][1]==='P' ? destino.textContent=programados[doc][4] : destino.textContent=programados[doc][3];

        const armason=document.createElement("tr");
        
        armason.appendChild(fecha);
        armason.appendChild(item2);
        armason.appendChild(cliente);
        armason.appendChild(destino);

        cuerpo.appendChild(armason);
    }
    document.getElementById("tablero-maestro-control-inicio").appendChild(cuerpo);
})

socket.on('despacho recolectados',(programados,alm)=>{
    document.getElementById("tabla2titulo").textContent="Control Checking";
    document.getElementById("tabla2descripcion").textContent="Permite observar los documentos terminados de almacen que pasaron a Despacho";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    console.log("documentos que pasaron el cheking")
    console.log(programados);
    console.log(alm)

    const cuerpo=document.createElement('tbody');
    for(let doc in programados){
        const item1=document.createElement('td');
        item1.textContent=programados[doc][0];
        // item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const despacho=document.createElement('td');
        despacho.textContent=programados[doc][1];

        const cliente=document.createElement('td');
        cliente.textContent=programados[doc][2];

        const destino=document.createElement('td');
        programados[doc][1]==='P' ? destino.textContent=programados[doc][4] : destino.textContent=programados[doc][3];

        const boton=document.createElement("button");
        boton.setAttribute("id","emb"+programados[doc][0]);
        boton.textContent="CHEKEADO";
        boton.addEventListener("click",()=>estado_despacho_check(programados[doc][0],alm));

        const armason=document.createElement("tr");
        armason.appendChild(item1);
        armason.appendChild(despacho);
        armason.appendChild(cliente);
        armason.appendChild(destino);
        armason.appendChild(boton)///aun falta agregar bien la logica aqui

        cuerpo.appendChild(armason);
    }
    document.getElementById("tablero-maestro-control-medio").appendChild(cuerpo);
})
socket.on('despacho embalados',(programados,alm)=>{
    document.getElementById("tabla3titulo").textContent="Embalar";
    document.getElementById("tabla3descripcion").textContent="Control de documentos Embalados";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";
    console.log("documentos para embalar")
    console.log(programados)

    const cuerpo=document.createElement('tbody');
    for(let doc in programados){
        const item1=document.createElement('td');
        item1.textContent=programados[doc][0];
        // item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

        const item2=document.createElement('td');
        item2.textContent=programados[doc][1];

        const item3=document.createElement('td');
        item3.textContent=programados[doc][2];

        const boton=document.createElement("button");
        boton.setAttribute("id","gui"+programados[doc][0]);
        boton.textContent="GUIA";
        boton.addEventListener("click",()=>estado_despacho_embalado(programados[doc][0],alm));

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        armason.appendChild(item3)
        armason.appendChild(boton)

        cuerpo.appendChild(armason);
    }
    document.getElementById("tablero-maestro-control-fin").appendChild(cuerpo);
})

function estado_despacho_check(documento,alm){
    // console.log(documento);console.log(alm)
    let user=window.prompt(`quien va a chekear la factura ${documento}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        socket.emit('despacho check',documento,alm,user)
    }
}

function estado_despacho_embalado(documento,alm){
    let user=window.prompt(`quien va a embalar la factura ${documento}`,"aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        socket.emit('despacho embalar',documento,alm,user)
    }
}