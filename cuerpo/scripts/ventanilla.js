
document.getElementById("ventanilla").addEventListener("click",()=>pasando_a_ventanilla())

function pasando_a_ventanilla(){
    let user=window.prompt("ventanilla usuario","aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        document.getElementById("distribucion").innerHTML="";
        socket.emit('ventanilla',user);
    }
}

/////////PROTOTIPO PARA MOSTRAR LA TABLA MAESTRO DESTRUCTURADA
socket.on('ventanilla mestro nuevos',(registros)=>{
    document.getElementById("tabla1titulo").textContent="Nuevos Documentos";
    document.getElementById("tabla1descripcion").textContent="Nuevos documentos programados para ser trabajados";
    document.getElementById("tablero-maestro-control-inicio").innerHTML="";
    // document.getElementById("tablero-maestro-control").innerHTML="";
    const cuerpo=document.createElement('tbody');
    for(let doc in registros){
        const fecha=document.createElement('td')
        fecha.textContent=registros[doc][0];

        const hora=document.createElement('td')
        hora.textContent=registros[doc][1];

        const documento=document.createElement('td')
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
        documento.textContent=registros[doc][0];

        const estado=document.createElement('td')
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
        documento.textContent=registros[doc][0];

        const estado=document.createElement('td')
        estado.textContent=registros[doc][1];

        //////////BOTON ESPECIAL
        const boton=document.createElement("button");
        if(registros[doc][1]==0) boton.textContent="FALTA";
        else if(registros[doc][1]==1){
            boton.setAttribute("id","chk"+registros[doc][0]);
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

socket.on('registros nuevos',(registros)=>{
    if(registros[0]>contadorxglobalxcliente){
        contadorxglobalxcliente=registros[0];
        emitir_eventos(nombre_ev_actual,valor_ev_actual);////DEBO DE EMITIR A TODOS LOS CANALES
        // socket.emit(nombre_ev_actual,valor_ev_actual);
    }
    else{
        console.log("no pasa nada")
    }
})