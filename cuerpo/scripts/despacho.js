
socket.on('a despacho',()=>refresco());///para mostrar los nuevos pasados a despacho pero sin chekeado2
///////FALTA CREAR SUS RESPECTIVOS EVENTOS PARA EL CHECK2 Y EL EMBALADO Y OTRA FUNCION
socket.on('despacho venideros',(programados)=>{
    document.getElementById("tabla-1-titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla-1-descripcion").textContent="Nuevos documentos programados que vendran";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";
    
    // const tbody = document.querySelector("#tablero-maestro-control-inicio tbody");
    // tbody.innerHTML="";
    
    console.log("despacho los que vienen")
    console.log(programados);

    // for(let doc in programados){
    //     const fecha=document.createElement('td');
    //     fecha.className="font-mono bg-red-500";
    //     fecha.textContent=programados[doc][0];
    //     fecha.addEventListener('click',()=>factura_observacion(programados[doc][0]))

    //     const item2=document.createElement('td');
    //     item2.textContent=programados[doc][1];        

    //     const cliente=document.createElement('td');
    //     cliente.textContent=programados[doc][2];

    //     const destino=document.createElement('td');
    //     // destino.textContent=programados[doc][3];///ERA PARA DEAR SOLO EL DESTINO
    //     programados[doc][1]==='P' ? destino.textContent=programados[doc][4] : destino.textContent=programados[doc][3];

    //     const armason=document.createElement("tr");
    //     armason.className="hover:bg-gray-50 transition";
        
    //     armason.appendChild(fecha);
    //     armason.appendChild(item2);
    //     armason.appendChild(cliente);
    //     armason.appendChild(destino);

    //     tbody.appendChild(armason);
    // }
    ///////////revisar separacion sino revivir
    const thead=document.createElement('thead');
    thead.className= 'bg-indigo-600 text-white sticky top-0';
    const headerRow=document.createElement('tr');
    const headers=['Documento','Salida','Cliente','Destino','Currier'];
    headers.forEach(header => {
        const th=document.createElement('th');
        th.textContent=header;
        th.className="px-6 py-3 text-left font-semibold";
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    document.getElementById("tablero-maestro-control-inicio").appendChild(thead);

    const cuerpo=document.createElement('tbody');
    let rowIndex = 0;
    for(let doc in programados){
        const documento=document.createElement('td');
        documento.textContent=programados[doc][0];
        documento.className="px-6 py-4 border-b border-gray-200";

        const salida=document.createElement('td');
        salida.textContent=programados[doc][1];
        salida.className="px-6 py-4 border-b border-gray-200";

        const cliente=document.createElement('td');
        cliente.textContent=programados[doc][2];
        cliente.className="px-6 py-4 border-b border-gray-200";

        const destino=document.createElement('td');
        destino.className="px-6 py-4 border-b border-gray-200";
        destino.textContent=programados[doc][3];

        const currier=document.createElement('td');
        currier.className="px-6 py-4 border-b border-gray-200";
        currier.textContent=programados[doc][4]
        
        const fila=document.createElement('tr');

        if(rowIndex % 2 === 0){
            fila.className="bg-white hover:bg-indigo-50 transition";
        }
        else{
            fila.className="bg-gray-50 hover:bg-indigo-50 transition";
        }
        fila.appendChild(documento);
        fila.appendChild(salida);
        fila.appendChild(cliente);
        fila.appendChild(destino);
        fila.appendChild(currier);
        // tbody.appendChild(fila);

        cuerpo.appendChild(fila);
        rowIndex++;
    }
    document.getElementById("tablero-maestro-control-inicio").appendChild(cuerpo);
})

socket.on('despacho recolectados',(programados,alm)=>{
    document.getElementById("tabla-2-titulo").textContent="Control Checking";
    document.getElementById("tabla-2-descripcion").textContent="Permite observar los documentos terminados de almacen que pasaron a Despacho";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    
    // const tbody = document.querySelector("#tablero-maestro-control-medio tbody");
    // tbody.innerHTML="";
    
    console.log("documentos que pasaron el cheking")
    console.log(programados);
    console.log(alm)

    // for(let doc in programados){
    //     const item1=document.createElement('td');
    //     item1.className="font-mono";
    //     item1.textContent=programados[doc][0];
    //     // item1.addEventListener("click",()=>factura_informacion(impresos[documento][0]))

    //     const despacho=document.createElement('td');
    //     despacho.textContent=programados[doc][1];

    //     const cliente=document.createElement('td');
    //     cliente.textContent=programados[doc][2];

    //     const destino=document.createElement('td');
    //     programados[doc][1]==='P' ? destino.textContent=programados[doc][4] : destino.textContent=programados[doc][3];

    //     const boton=document.createElement("button");
    //     boton.setAttribute("id","emb"+programados[doc][0]);
    //     boton.className="bg-blue-500 rounded-md w-24 text-white text-sm font-mono";
    //     boton.textContent="CHEKEADO";
    //     boton.addEventListener("click",()=>estado_despacho_check(programados[doc][0],alm));

    //     const armason=document.createElement("tr");
    //     armason.className="hover:bg-gray-50 transition";
    //     armason.appendChild(item1);
    //     armason.appendChild(despacho);
    //     armason.appendChild(cliente);
    //     armason.appendChild(destino);
    //     armason.appendChild(boton)///aun falta agregar bien la logica aqui

    //     tbody.appendChild(armason);
    // }
    ///////////revisar separacion sino revivir
    const thead=document.createElement('thead');
    thead.className='bg-amber-600 text-white sticky top-0';
    const headerRow=document.createElement('tr');
    const headers=['Documento','Salida','Cliente','Destino','Accion'];
    headers.forEach(header => {
        const th=document.createElement('th');  
        th.textContent=header;
        th.className="px-6 py-3 text-left font-semibold";
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    document.getElementById("tablero-maestro-control-medio").appendChild(thead);

    const cuerpo=document.createElement('tbody');
    let rowIndex = 0;
    for(let doc in programados){
        const documento=document.createElement('td');
        documento.className="font-mono px-6 py-4 border-b border-gray-200 font-semibold text-indigo-600 cursor-pointer hover:underline";
        documento.textContent=programados[doc][0];
        
        const salida=document.createElement('td');
        salida.className="px-6 py-4 border-b border-gray-200";
        salida.textContent=programados[doc][1];

        const cliente=document.createElement('td');
        cliente.className="px-6 py-4 border-b border-gray-200";
        cliente.textContent=programados[doc][2];

        const destino=document.createElement('td');
        destino.className="px-6 py-4 border-b border-gray-200";
        programados[doc][1]==='P' ? destino.textContent=programados[doc][4] : destino.textContent=programados[doc][3];

        const boton=document.createElement("button");
        boton.setAttribute("id","emb"+programados[doc][0]);
        boton.className="bg-blue-500 rounded-md w-24 text-white text-sm font-mono";
        boton.textContent="CHEKEADO";
        boton.addEventListener("click",()=>estado_despacho_check(programados[doc][0],alm));

        const fila=document.createElement('tr');

        if(rowIndex % 2 === 0){
            fila.className="bg-white hover:bg-amber-50 transition";
        }
        else{
            fila.className="bg-gray-50 hover:bg-amber-50 transition";
        }
        fila.appendChild(documento);
        fila.appendChild(salida);
        fila.appendChild(cliente);
        fila.appendChild(destino);
        fila.appendChild(boton);

        cuerpo.appendChild(fila);
        rowIndex++;
    }
    document.getElementById("tablero-maestro-control-medio").appendChild(cuerpo);
})
socket.on('despacho embalados',(programados,alm)=>{
    document.getElementById("tabla-3-titulo").textContent="Embalar";
    document.getElementById("tabla-3-descripcion").textContent="Control de documentos Embalados";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";
    
    // const tbody = document.querySelector("#tablero-maestro-control-fin tbody");
    // tbody.innerHTML="";
    
    console.log("documentos para embalar")
    console.log(programados)

    // for(let doc in programados){
    //     const item1=document.createElement('td');
    //     item1.textContent=programados[doc][0];
    //     item1.addEventListener("click",()=>factura_observacion(programados[doc][0]))

    //     const item2=document.createElement('td');
    //     item2.textContent=programados[doc][1];

    //     const item3=document.createElement('td');
    //     item3.textContent=programados[doc][2];

    //     const boton=document.createElement("button");
    //     boton.setAttribute("id","gui"+programados[doc][0]);
    //     boton.className="bg-blue-500 rounded-md w-24 text-white text-sm font-mono";
    //     boton.textContent="EMBALADO";
    //     boton.addEventListener("click",()=>estado_despacho_embalado(programados[doc][0],alm));

    //     const armason=document.createElement("tr");
    //     armason.className="hover:bg-gray-50 transition";
    //     armason.appendChild(item1)
    //     armason.appendChild(item2)
    //     armason.appendChild(item3)
    //     armason.appendChild(boton)

    //     tbody.appendChild(armason);
    // }
    ///////////revisar separacion sino revivir
    const thead=document.createElement('thead');
    thead.className='bg-amber-600 text-white sticky top-0';
    const headerRow=document.createElement('tr');
    const headers=['Documento','Salida','Cliente','Destino','Accion'];
    headers.forEach(header => {
        const th=document.createElement('th');  
        th.textContent=header;
        th.className="px-6 py-3 text-left font-semibold";
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    document.getElementById("tablero-maestro-control-medio").appendChild(thead);

    const cuerpo=document.createElement('tbody');
    let rowIndex = 0;
    for(let doc in programados){
        const documento=document.createElement('td');
        documento.className="font-mono px-6 py-4 border-b border-gray-200 font-semibold text-indigo-600 cursor-pointer hover:underline";
        documento.textContent=programados[doc][0];

        const salida=document.createElement('td');
        salida.className="px-6 py-4 border-b border-gray-200";
        salida.textContent=programados[doc][1];

        const cliente=document.createElement('td');
        cliente.className="px-6 py-4 border-b border-gray-200";
        cliente.textContent=programados[doc][2];

        const boton=document.createElement("button");
        boton.setAttribute("id","gui"+programados[doc][0]);
        boton.className="bg-blue-500 rounded-md w-24 text-white text-sm font-mono";
        boton.textContent="EMBALADO";
        boton.addEventListener("click",()=>estado_despacho_embalado(programados[doc][0],alm));

        const armason=document.createElement("tr");
        armason.className="hover:bg-gray-50 transition";
        armason.appendChild(documento)
        armason.appendChild(salida)
        armason.appendChild(cliente)
        armason.appendChild(boton)

        cuerpo.appendChild(armason);
        rowIndex++;
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