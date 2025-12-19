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
})

