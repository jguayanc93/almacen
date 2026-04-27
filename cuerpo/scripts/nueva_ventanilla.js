/////////////no tocar este evento por ahora
socket.on('registros nuevos',(registros)=>{
    if(registros[0]>contadorxglobalxcliente){
        contadorxglobalxcliente=registros[0];
        ////DEBO DE EMITIR A TODOS LOS SOCKET CONECTADOS DE CADA MAQUINA INDIVIDUAL
        emitir_eventos(nombre_ev_actual,valor_ev_actual,salida_ev_actual);
        // socket.emit(nombre_ev_actual,valor_ev_actual);
    }
})
//////////////////
function mostrar_nuevos_documentos(){
    let sub_menu=document.getElementById("operador-opciones");
    sub_menu.innerHTML="";
    sub_menu.classList.add("hidden");

    let mensaje_submenu=document.getElementById("mensaje-opcion");    
    // mensaje_submenu.innerHTML="";
    mensaje_submenu.classList.add("hidden");

    let imagen=document.getElementById("imagen-principal-temporal");
    imagen.classList.toggle("hidden");

    let nueva_tabla1=document.getElementById("tabla-para-bravos");    
    nueva_tabla1.classList.toggle("hidden");
    // nueva_tabla1.className="col-span-6 bg-gray-400 text-white";
    
}
/////////PROTOTIPO PARA MOSTRAR LA TABLA MAESTRO DESTRUCTURADA
socket.on('ventanilla mestro nuevos',(registros)=>{
    document.getElementById("tabla-1-titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla-1-descripcion").textContent="Nuevos documentos programados para ser trabajados";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";
    // document.getElementById("tablero-maestro-control").innerHTML="";
    // console.log("ESTOS REGISTROS SON UNICOS PARA EL LLAMADO DE CIERTAS ZONAS REVISAR SI SE REPITE")
    // console.log(registros);
    
    // Crear encabezados (thead)
    const thead = document.createElement('thead');
    thead.className = 'bg-indigo-600 text-white sticky top-0';
    const headerRow = document.createElement('tr');
    const headers = ['Fecha', 'Hora', 'Documento', 'Cliente', 'Zona'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.className = 'px-6 py-3 text-left font-semibold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    document.getElementById("tablero-maestro-control-inicio").appendChild(thead);
    
    // Crear cuerpo (tbody)
    const cuerpo=document.createElement('tbody');
    let rowIndex = 0;
    for(let doc in registros){
        const fecha=document.createElement('td')
        fecha.textContent=registros[doc][0];
        fecha.className="px-6 py-4 border-b border-gray-200";

        const hora=document.createElement('td')
        hora.textContent=registros[doc][1];
        hora.className="px-6 py-4 border-b border-gray-200";

        const documento=document.createElement('td')
        documento.className="font-mono px-6 py-4 border-b border-gray-200 font-semibold text-indigo-600";
        documento.textContent=registros[doc][2];

        const cliente=document.createElement('td')
        cliente.textContent=registros[doc][3];
        cliente.className="px-6 py-4 border-b border-gray-200";

        const zonas=document.createElement('td')
        zonas.textContent=registros[doc][4];
        zonas.className="px-6 py-4 border-b border-gray-200 font-medium";

        const fila=document.createElement('tr');
        // Colores alternados y hover
        if(rowIndex % 2 === 0) {
            fila.className="bg-white hover:bg-indigo-50 transition";
        } else {
            fila.className="bg-gray-50 hover:bg-indigo-50 transition";
        }
        fila.appendChild(fecha)
        fila.appendChild(hora)
        fila.appendChild(documento)
        fila.appendChild(cliente)
        fila.appendChild(zonas)

        cuerpo.appendChild(fila);
        rowIndex++;
    }
    document.getElementById("tablero-maestro-control-inicio").appendChild(cuerpo)
    /////////////////////ESTO PARA LA NUEVA VERSION AHORA DEBE CAMBIARSE POR LA NUEVA
    // let primeratablatitulo=document.getElementById("primeratablatitulo");
    // primeratablatitulo.className="text-center text-xl font-bold";
    // primeratablatitulo.textContent="NUEVOS DOCUMENTOS";
    // let primeratablamensaje=document.getElementById("primeratablamensaje");
    // primeratablamensaje.className="text-center text-lg font-medium";
    // primeratablamensaje.textContent="Documentos programados para su despacho en ventanilla";
    // let primeratabla=document.getElementById("tablero-maestro-control-inicio2");
    // primeratabla.innerHTML="";
    // for(let doc in registros){
    //     const fecha=document.createElement('td')
    //     fecha.className="border-b-2 truncate w-[14%]";
    //     fecha.textContent=registros[doc][0];

    //     const hora=document.createElement('td')
    //     hora.className="border-b-2 truncate w-[7%]";
    //     hora.textContent=registros[doc][1];

    //     const documento=document.createElement('td')
    //     documento.className="border-b-2 truncate w-[17%]";
    //     documento.textContent=registros[doc][2];

    //     const cliente=document.createElement('td')
    //     cliente.className="border-b-2 truncate w-[47%]";
    //     cliente.textContent=registros[doc][3];

    //     const zonas=document.createElement('td')
    //     zonas.className="border-b-2 truncate w-[15%]";
    //     zonas.textContent=registros[doc][4];

    //     const fila=document.createElement('tr');
    //     fila.className="hover:bg-black";
    //     fila.appendChild(fecha)
    //     fila.appendChild(hora)
    //     fila.appendChild(documento)
    //     fila.appendChild(cliente)
    //     fila.appendChild(zonas)

    //     primeratabla.appendChild(fila);
    // }
})

////evento para el evento de documento filtrado en el buscador de documento
socket.on('documento filtrado',(registros)=>{
    
})

socket.on('ventanilla mestro estados',(registros)=>{
    document.getElementById("tabla-2-titulo").textContent="Tablero Control";
    document.getElementById("tabla-2-descripcion").textContent="Permite observar el flujo del documento y en que estado se encuentra";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    // document.getElementById("tablero-maestro-control").innerHTML="";
    
    // Crear encabezados (thead)
    const thead = document.createElement('thead');
    thead.className = 'bg-amber-600 text-white sticky top-0';
    const headerRow = document.createElement('tr');
    const headers = ['Documento', 'Estado'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.className = 'px-6 py-3 text-left font-semibold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    document.getElementById("tablero-maestro-control-medio").appendChild(thead);
    
    // Crear cuerpo (tbody)
    const cuerpo=document.createElement('tbody');
    let rowIndex = 0;
    for(let doc in registros){
        const documento=document.createElement('td')
        documento.className="font-mono px-6 py-4 border-b border-gray-200 font-semibold text-indigo-600 cursor-pointer hover:underline";
        documento.textContent=registros[doc][0];
        documento.addEventListener('click',()=>{factura_informacion(registros[doc][0])})////aun en prueba

        const estado=document.createElement('td')
        estado.className="px-6 py-4 border-b border-gray-200";
        const estadoBtn = document.createElement('span');
        estadoBtn.className="bg-amber-500 text-black text-sm font-mono font-bold px-4 py-2 rounded-md inline-block";
        estadoBtn.textContent=registros[doc][1];
        estado.appendChild(estadoBtn);

        const fila=document.createElement('tr');
        // Colores alternados y hover
        if(rowIndex % 2 === 0) {
            fila.className="bg-white hover:bg-amber-50 transition";
        } else {
            fila.className="bg-gray-50 hover:bg-amber-50 transition";
        }
        fila.appendChild(documento)
        fila.appendChild(estado)

        cuerpo.appendChild(fila);
        rowIndex++;
    }
    document.getElementById("tablero-maestro-control-medio").appendChild(cuerpo)
    /////////////////////ESTO PARA LA NUEVA VERSION AHORA DEBE CAMBIARSE POR LA NUEVA
    // let segundatablatitulo=document.getElementById("segundatablatitulo");
    // segundatablatitulo.className="text-center text-xl font-bold";
    // segundatablatitulo.textContent="TABLERO CONTROL";
    // let segundatablamensaje=document.getElementById("segundatablamensaje");
    // segundatablamensaje.className="text-center text-lg font-medium";
    // segundatablamensaje.textContent="Estado del documento a trabajar";
    // let segundatabla=document.getElementById("tablero-maestro-control-medio2");
    // segundatabla.innerHTML="";
    // for(let doc in registros){
    //     let grapador=document.createElement("div");
    //     grapador.className="w-full flex flex-row justify-around";

    //     const documento=document.createElement("div");
    //     documento.className="w-[30%] font-bold";
    //     documento.textContent=registros[doc][0];

    //     const estado=document.createElement("div");
    //     estado.className="w-[50%] bg-amber-500 rounded-md text-black font-mono font-bold";
    //     estado.textContent=registros[doc][1];
    //     grapador.appendChild(documento)
    //     grapador.appendChild(estado);
    //     segundatabla.appendChild(grapador);
    // }
})

socket.on('ventanilla mestro terminados',(registros)=>{
    document.getElementById("tabla-3-titulo").textContent="Checking";
    document.getElementById("tabla-3-descripcion").textContent="Termina el procesado del documento y pasa a su despacho";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";
    // document.getElementById("tablero-maestro-control").innerHTML="";
    
    // Crear encabezados (thead)
    const thead = document.createElement('thead');
    thead.className = 'bg-emerald-600 text-white sticky top-0';
    const headerRow = document.createElement('tr');
    const headers = ['Documento', 'Estado', 'Acción'];
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.className = 'px-6 py-3 text-left font-semibold';
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    document.getElementById("tablero-maestro-control-fin").appendChild(thead);
    
    // Crear cuerpo (tbody)
    const cuerpo=document.createElement('tbody');
    console.log(registros);
    let rowIndex = 0;
    for(let doc in registros){
        const documento=document.createElement('td')
        documento.className="font-mono px-6 py-4 border-b border-gray-200 font-semibold text-indigo-600";
        documento.textContent=registros[doc][0];

        const estado=document.createElement('td')
        estado.className="px-6 py-4 border-b border-gray-200";
        const estadoSpan = document.createElement('span');
        if(registros[doc][1]==0){
            estadoSpan.className="bg-gray-300 text-gray-800 text-sm font-mono font-bold px-3 py-1 rounded";
            estadoSpan.textContent="Pendiente";
        } else if(registros[doc][1]==1){
            estadoSpan.className="bg-yellow-300 text-yellow-800 text-sm font-mono font-bold px-3 py-1 rounded";
            estadoSpan.textContent="En Checking";
        }
        estado.appendChild(estadoSpan);

        const accionCell=document.createElement('td')
        accionCell.className="px-6 py-4 border-b border-gray-200";
        //////////BOTON ESPECIAL
        const boton=document.createElement("button");
        if(registros[doc][1]==0){
            boton.className="bg-red-500 hover:bg-red-600 rounded-md px-4 py-2 text-white text-sm font-mono font-bold transition";
            boton.textContent="FALTA";
        }
        else if(registros[doc][1]==1){
            boton.setAttribute("id","chk"+registros[doc][0]);
            boton.className="bg-emerald-500 hover:bg-emerald-600 rounded-md px-4 py-2 text-white text-sm font-mono font-bold transition";
            boton.textContent="CHECKING";
            // boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][4],registros[doc][22]));
            boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][3],registros[doc][2],registros[doc][4]));
        }   
        accionCell.appendChild(boton);

        const fila=document.createElement('tr');
        // Colores alternados y hover
        if(rowIndex % 2 === 0) {
            fila.className="bg-white hover:bg-emerald-50 transition";
        } else {
            fila.className="bg-gray-50 hover:bg-emerald-50 transition";
        }
        fila.appendChild(documento)
        fila.appendChild(estado)
        fila.appendChild(accionCell)

        cuerpo.appendChild(fila);
        rowIndex++;
    }
    document.getElementById("tablero-maestro-control-fin").appendChild(cuerpo)
    /////////////////////ESTO PARA LA NUEVA VERSION AHORA DEBE CAMBIARSE POR LA NUEVA
    // let terceratablatitulo=document.getElementById("terceratablatitulo");
    // terceratablatitulo.className="text-center text-xl font-bold";
    // terceratablatitulo.textContent="TABLERO DESPACHO";
    // let terceratablamensaje=document.getElementById("terceratablamensaje");
    // terceratablamensaje.className="text-center text-lg font-medium";
    // terceratablamensaje.textContent="Checking del documento";
    // let terceratabla=document.getElementById("tablero-maestro-control-fin2");
    // terceratabla.innerHTML="";
    // for(let doc in registros){
    //     let grapador=document.createElement("div");
    //     grapador.className="w-full flex flex-row justify-center";

    //     const documento=document.createElement("div");
    //     documento.className="w-[30%] font-bold front-mono";
    //     documento.textContent=registros[doc][0];

    //     const estado=document.createElement('div');
    //     estado.className="w-[5%]";
    //     estado.textContent=registros[doc][1];

    //     const boton=document.createElement("button");
    //     if(registros[doc][1]==0){
    //         boton.className="truncate w-[40%] bg-red-500 rounded-md text-white font-mono";
    //         boton.textContent="FALTA";
    //     }
    //     else if(registros[doc][1]==1){
    //         boton.setAttribute("id","chk"+registros[doc][0]);
    //         boton.className="truncate w-[40%] bg-emerald-500 rounded-md text-white font-mono";
    //         boton.textContent="CHECKING";
    //         boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][3],registros[doc][2],registros[doc][4]));
    //     }
    //     grapador.appendChild(documento)
    //     grapador.appendChild(estado)
    //     grapador.appendChild(boton)
    //     terceratabla.appendChild(grapador);

    // }

    // for(let doc in registros){
    //     const documento=document.createElement('td')
    //     documento.className="truncate w-1/5 bg-red-500 rounded-md text-white font-mono";
    //     documento.textContent=registros[doc][0];

    //     const estado=document.createElement('td')
    //     estado.className="truncate w-1/5";
    //     estado.textContent=registros[doc][1];

    //     //////////BOTON ESPECIAL
    //     const boton=document.createElement("button");
    //     if(registros[doc][1]==0){
    //         boton.className="truncate w-2/5 bg-red-500 rounded-md text-white font-mono";
    //         boton.textContent="FALTA";
    //     }
    //     else if(registros[doc][1]==1){
    //         boton.setAttribute("id","chk"+registros[doc][0]);
    //         boton.className="truncate w-2/5 bg-emerald-500 rounded-md text-white font-mono";
    //         boton.textContent="CHECKING";
    //         boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][3],registros[doc][2],registros[doc][4]));
    //     }   

    //     const fila=document.createElement('tr');
    //     fila.appendChild(documento)
    //     fila.appendChild(estado)
    //     fila.appendChild(boton)

    //     terceratabla.appendChild(fila);
    // }
})

