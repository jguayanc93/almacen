
socket.on('a despacho',()=>refresco());///para mostrar los nuevos pasados a despacho pero sin chekeado2
///////FALTA CREAR SUS RESPECTIVOS EVENTOS PARA EL CHECK2 Y EL EMBALADO Y OTRA FUNCION
socket.on('despacho venideros',(programados)=>{
    document.getElementById("tabla-1-titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla-1-descripcion").textContent="Nuevos documentos programados que vendran";
    
    const tbody = document.querySelector("#tablero-maestro-control-inicio tbody");
    tbody.innerHTML="";
    
    console.log("despacho los que vienen")
    console.log(programados);

    for(let doc in programados){
        const fecha=document.createElement('td');
        fecha.className="font-mono bg-red-500";
        fecha.textContent=programados[doc][0];
        fecha.addEventListener('click',()=>factura_observacion(programados[doc][0]))

        const item2=document.createElement('td');
        item2.textContent=programados[doc][1];        

        const cliente=document.createElement('td');
        cliente.textContent=programados[doc][2];

        const destino=document.createElement('td');
        // destino.textContent=programados[doc][3];///ERA PARA DEAR SOLO EL DESTINO
        programados[doc][1]==='P' ? destino.textContent=programados[doc][4] : destino.textContent=programados[doc][3];

        const armason=document.createElement("tr");
        armason.className="hover:bg-gray-50 transition";
        
        armason.appendChild(fecha);
        armason.appendChild(item2);
        armason.appendChild(cliente);
        armason.appendChild(destino);

        tbody.appendChild(armason);
    }
})

socket.on('despacho recolectados',(programados,alm)=>{
    document.getElementById("tabla-2-titulo").textContent="Control Checking";
    document.getElementById("tabla-2-descripcion").textContent="Permite observar los documentos terminados de almacen que pasaron a Despacho";
    
    const tbody = document.querySelector("#tablero-maestro-control-medio tbody");
    tbody.innerHTML="";
    
    console.log("documentos que pasaron el cheking")
    console.log(programados);
    console.log(alm)

    for(let doc in programados){
        const item1=document.createElement('td');
        item1.className="font-mono";
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
        boton.className="bg-blue-500 rounded-md w-24 text-white text-sm font-mono";
        boton.textContent="CHEKEADO";
        boton.addEventListener("click",()=>estado_despacho_check(programados[doc][0],alm));

        const armason=document.createElement("tr");
        armason.className="hover:bg-gray-50 transition";
        armason.appendChild(item1);
        armason.appendChild(despacho);
        armason.appendChild(cliente);
        armason.appendChild(destino);
        armason.appendChild(boton)///aun falta agregar bien la logica aqui

        tbody.appendChild(armason);
    }
})
socket.on('despacho embalados',(programados,alm)=>{
    document.getElementById("tabla-3-titulo").textContent="Embalar";
    document.getElementById("tabla-3-descripcion").textContent="Control de documentos Embalados";
    
    const tbody = document.querySelector("#tablero-maestro-control-fin tbody");
    tbody.innerHTML="";
    
    console.log("documentos para embalar")
    console.log(programados)

    for(let doc in programados){
        const item1=document.createElement('td');
        item1.textContent=programados[doc][0];
        item1.addEventListener("click",()=>factura_observacion(programados[doc][0]))

        const item2=document.createElement('td');
        item2.textContent=programados[doc][1];

        const item3=document.createElement('td');
        item3.textContent=programados[doc][2];

        const boton=document.createElement("button");
        boton.setAttribute("id","gui"+programados[doc][0]);
        boton.className="bg-blue-500 rounded-md w-24 text-white text-sm font-mono";
        boton.textContent="EMBALADO";
        boton.addEventListener("click",()=>estado_despacho_embalado(programados[doc][0],alm));

        const armason=document.createElement("tr");
        armason.className="hover:bg-gray-50 transition";
        armason.appendChild(item1)
        armason.appendChild(item2)
        armason.appendChild(item3)
        armason.appendChild(boton)

        tbody.appendChild(armason);
    }
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