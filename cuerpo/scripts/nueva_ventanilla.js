/////////////no tocar este evento por ahora
socket.on('registros nuevos',(registros)=>{
    if(registros[0]>contadorxglobalxcliente){
        contadorxglobalxcliente=registros[0];
        ////DEBO DE EMITIR A TODOS LOS SOCKET CONECTADOS DE CADA MAQUINA INDIVIDUAL
        emitir_eventos(nombre_ev_actual,valor_ev_actual);
        // socket.emit(nombre_ev_actual,valor_ev_actual);
    }
})
//////////////////
function mostrar_nuevos_documentos(){
    let sub_menu=document.getElementById("operador-opciones");
    let mensaje_submenu=document.getElementById("mensaje-opcion");    
    let imagen=document.getElementById("imagen-principal-temporal");
    sub_menu.innerHTML="";
    sub_menu.classList.add("hidden");
    mensaje_submenu.innerHTML="";
    mensaje_submenu.classList.add("hidden");
    imagen.classList.toggle("hidden");
    let nueva_tabla1=document.getElementById("tabla-para-bravos");    
    nueva_tabla1.classList.toggle("hidden");
    // nueva_tabla1.className="col-span-6 bg-gray-400 text-white";
    
}
/////////PROTOTIPO PARA MOSTRAR LA TABLA MAESTRO DESTRUCTURADA
socket.on('ventanilla mestro nuevos',(registros)=>{
    document.getElementById("tabla1titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla1descripcion").textContent="Nuevos documentos programados para ser trabajados";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";
    // document.getElementById("tablero-maestro-control").innerHTML="";
    // console.log("ESTOS REGISTROS SON UNICOS PARA EL LLAMADO DE CIERTAS ZONAS REVISAR SI SE REPITE")
    // console.log(registros);
    const cuerpo=document.createElement('tbody');
    for(let doc in registros){
        const fecha=document.createElement('td')
        fecha.textContent=registros[doc][0];

        const hora=document.createElement('td')
        hora.textContent=registros[doc][1];

        const documento=document.createElement('td')
        documento.className="font-mono";
        documento.textContent=registros[doc][2];

        const cliente=document.createElement('td')
        cliente.textContent=registros[doc][3];

        const zonas=document.createElement('td')
        zonas.textContent=registros[doc][4];

        const fila=document.createElement('tr');
        fila.appendChild(fecha)
        fila.appendChild(hora)
        fila.appendChild(documento)
        fila.appendChild(cliente)
        fila.appendChild(zonas)

        cuerpo.appendChild(fila);
    }
    document.getElementById("tablero-maestro-control-inicio").appendChild(cuerpo)
    /////////////////////ESTO PARA LA NUEVA VERSION AHORA DEBE CAMBIARSE POR LA NUEVA
    let primeratablatitulo=document.getElementById("primeratablatitulo");
    primeratablatitulo.className="text-center text-xl font-bold";
    primeratablatitulo.textContent="NUEVOS DOCUMENTOS";
    let primeratablamensaje=document.getElementById("primeratablamensaje");
    primeratablamensaje.className="text-center text-lg font-medium";
    primeratablamensaje.textContent="Documentos programados para su despacho en ventanilla";
    let primeratabla=document.getElementById("tablero-maestro-control-inicio2");
    primeratabla.innerHTML="";
    for(let doc in registros){
        const fecha=document.createElement('td')
        fecha.className="border-b-2 truncate w-[14%]";
        fecha.textContent=registros[doc][0];

        const hora=document.createElement('td')
        hora.className="border-b-2 truncate w-[7%]";
        hora.textContent=registros[doc][1];

        const documento=document.createElement('td')
        documento.className="border-b-2 truncate w-[17%]";
        documento.textContent=registros[doc][2];

        const cliente=document.createElement('td')
        cliente.className="border-b-2 truncate w-[47%]";
        cliente.textContent=registros[doc][3];

        const zonas=document.createElement('td')
        zonas.className="border-b-2 truncate w-[15%]";
        zonas.textContent=registros[doc][4];

        const fila=document.createElement('tr');
        fila.appendChild(fecha)
        fila.appendChild(hora)
        fila.appendChild(documento)
        fila.appendChild(cliente)
        fila.appendChild(zonas)

        primeratabla.appendChild(fila);
    }
})

socket.on('ventanilla mestro estados',(registros)=>{
    document.getElementById("tabla2titulo").textContent="Tablero Control";
    document.getElementById("tabla2descripcion").textContent="Permite observar el flujo del documento y en que estado se encuentra";
    document.getElementById("tablero-maestro-control-medio").innerHTML="";
    // document.getElementById("tablero-maestro-control").innerHTML="";
    const cuerpo=document.createElement('tbody');
    for(let doc in registros){
        const documento=document.createElement('td')
        documento.className="font-mono";
        documento.textContent=registros[doc][0];
        documento.addEventListener('click',()=>{factura_informacion(registros[doc][0])})////aun en prueba

        const estado=document.createElement('td')
        estado.className="bg-amber-500 rounded-md w-40 text-black text-sm font-mono font-bold text-center";
        estado.textContent=registros[doc][1];

        const fila=document.createElement('tr');
        fila.appendChild(documento)
        fila.appendChild(estado)

        cuerpo.appendChild(fila);
    }
    document.getElementById("tablero-maestro-control-medio").appendChild(cuerpo)
    /////////////////////ESTO PARA LA NUEVA VERSION AHORA DEBE CAMBIARSE POR LA NUEVA
    let segundatablatitulo=document.getElementById("segundatablatitulo");
    segundatablatitulo.className="text-center text-xl font-bold";
    segundatablatitulo.textContent="TABLERO CONTROL";
    let segundatablamensaje=document.getElementById("segundatablamensaje");
    segundatablamensaje.className="text-center text-lg font-medium";
    segundatablamensaje.textContent="Estado del documento a trabajar";
    let segundatabla=document.getElementById("tablero-maestro-control-medio2");
    segundatabla.innerHTML="";
    for(let doc in registros){
        const documento=document.createElement('td')
        documento.className="w-1/3 font-mono";
        documento.textContent=registros[doc][0];
        // documento.addEventListener('click',()=>{factura_informacion(registros[doc][0])})////aun en prueba

        const estado=document.createElement('td')
        estado.className="w-2/3 bg-amber-500 rounded-md text-black font-mono font-bold";
        estado.textContent=registros[doc][1];

        const fila=document.createElement('tr');
        fila.appendChild(documento)
        fila.appendChild(estado)

        segundatabla.appendChild(fila);
    }
    
})

socket.on('ventanilla mestro terminados',(registros)=>{
    document.getElementById("tabla3titulo").textContent="Checking";
    document.getElementById("tabla3descripcion").textContent="Termina el procesado del documento y pasa a su despacho";
    document.getElementById("tablero-maestro-control-fin").innerHTML="";
    // document.getElementById("tablero-maestro-control").innerHTML="";
    const cuerpo=document.createElement('tbody');
    console.log(registros);
    for(let doc in registros){
        const documento=document.createElement('td')
        documento.className="font-mono";
        documento.textContent=registros[doc][0];

        const estado=document.createElement('td')
        estado.textContent=registros[doc][1];

        //////////BOTON ESPECIAL
        const boton=document.createElement("button");
        if(registros[doc][1]==0){
            boton.className="bg-red-500 rounded-md w-24 text-white text-sm font-mono";
            boton.textContent="FALTA";
        }
        else if(registros[doc][1]==1){
            boton.setAttribute("id","chk"+registros[doc][0]);
            boton.className="bg-emerald-500 rounded-md w-24 text-white text-sm font-mono";
            boton.textContent="CHECKING";
            // boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][4],registros[doc][22]));
            boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][3],registros[doc][2],registros[doc][4]));
        }   

        const fila=document.createElement('tr');
        fila.appendChild(documento)
        fila.appendChild(estado)
        fila.appendChild(boton)

        cuerpo.appendChild(fila);
    }
    document.getElementById("tablero-maestro-control-fin").appendChild(cuerpo)
    /////////////////////ESTO PARA LA NUEVA VERSION AHORA DEBE CAMBIARSE POR LA NUEVA
    let terceratablatitulo=document.getElementById("terceratablatitulo");
    terceratablatitulo.className="text-center text-xl font-bold";
    terceratablatitulo.textContent="TABLERO DESPACHO";
    let terceratablamensaje=document.getElementById("terceratablamensaje");
    terceratablamensaje.className="text-center text-lg font-medium";
    terceratablamensaje.textContent="Checking del documento";
    let terceratabla=document.getElementById("tablero-maestro-control-fin2");
    terceratabla.innerHTML="";
    for(let doc in registros){
        const documento=document.createElement('td')
        documento.className="truncate w-1/5 bg-red-500 rounded-md text-white font-mono";
        documento.textContent=registros[doc][0];

        const estado=document.createElement('td')
        estado.className="truncate w-1/5";
        estado.textContent=registros[doc][1];

        //////////BOTON ESPECIAL
        const boton=document.createElement("button");
        if(registros[doc][1]==0){
            boton.className="truncate w-2/5 bg-red-500 rounded-md text-white font-mono";
            boton.textContent="FALTA";
        }
        else if(registros[doc][1]==1){
            boton.setAttribute("id","chk"+registros[doc][0]);
            boton.className="truncate w-2/5 bg-emerald-500 rounded-md text-white font-mono";
            boton.textContent="CHECKING";
            boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][3],registros[doc][2],registros[doc][4]));
        }   

        const fila=document.createElement('tr');
        fila.appendChild(documento)
        fila.appendChild(estado)
        fila.appendChild(boton)

        terceratabla.appendChild(fila);
    }
})

