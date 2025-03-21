
document.getElementById("ventanilla").addEventListener("click",()=>pasando_a_ventanilla())

function pasando_a_ventanilla(){
    let user=window.prompt("ventanilla usuario","aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        document.getElementById("distribucion").innerHTML="";
        socket.emit('ventanilla',user);
    }
}

// socket.on('ventanilla impresos',(registros)=>{
//     document.getElementById("tabla-lista").innerHTML="";
//     document.getElementById("tabla-lista-impreso").innerHTML="";
//     document.getElementById("tabla-lista-picking").innerHTML="";


//     document.getElementById("cabesa-tabla-lista-general").innerHTML="";
//     document.getElementById("tabla-lista-general").innerHTML="";
//     const head1=document.createElement('th')
//     head1.textContent="FECHA";
//     const head2=document.createElement('th')
//     head2.textContent="DOCUMENTO";
//     const head3=document.createElement('th')
//     head3.textContent="CLIENTE";
//     const head4=document.createElement('th')
//     head4.textContent="HORA";
//     const head5=document.createElement('th')
//     head5.textContent="ZONAS";
//     const head6=document.createElement('th')
//     head6.textContent="IMPR.Z1";
//     const head7=document.createElement('th')
//     head7.textContent="IMPR.Z2";
//     const head8=document.createElement('th')
//     head8.textContent="IMPR.Z3";
//     const head9=document.createElement('th')
//     head9.textContent="IMPR.desconocido";
//     const head10=document.createElement('th')
//     head10.textContent="PICK.Z1";
//     const head11=document.createElement('th')
//     head11.textContent="PICK.Z2";
//     const head12=document.createElement('th')
//     head12.textContent="PICK.Z3";
//     const head13=document.createElement('th')
//     head13.textContent="PICK.DESCONOCIDO";
//     const head14=document.createElement('th')
//     head14.textContent="CONF.Z1";
//     const head15=document.createElement('th')
//     head15.textContent="CONF.Z2";
//     const head16=document.createElement('th')
//     head16.textContent="CONF.Z3";
//     const head17=document.createElement('th')
//     head17.textContent="CONF.DESCONOCIDO";
//     const head18=document.createElement('th')
//     head18.textContent="USER.Z1";
//     const head19=document.createElement('th')
//     head19.textContent="USER.Z2";
//     const head20=document.createElement('th')
//     head20.textContent="USER.Z3";
//     const head21=document.createElement('th')
//     head21.textContent="USER.DESCONOCIDO";
//     const head22=document.createElement('th')
//     head22.textContent="ACCION";
    
//     const cabeseras=document.createElement("tr");
//     cabeseras.appendChild(head1)
//     cabeseras.appendChild(head2)
//     cabeseras.appendChild(head3)
//     cabeseras.appendChild(head4)
//     cabeseras.appendChild(head5)
//     cabeseras.appendChild(head6)
//     cabeseras.appendChild(head7)
//     cabeseras.appendChild(head8)
//     cabeseras.appendChild(head9)
//     cabeseras.appendChild(head10)
//     cabeseras.appendChild(head11)
//     cabeseras.appendChild(head12)
//     cabeseras.appendChild(head13)
//     cabeseras.appendChild(head14)
//     cabeseras.appendChild(head15)
//     cabeseras.appendChild(head16)
//     cabeseras.appendChild(head17)
//     cabeseras.appendChild(head18)
//     cabeseras.appendChild(head19)
//     cabeseras.appendChild(head20)
//     cabeseras.appendChild(head21)
//     cabeseras.appendChild(head22)
//     document.getElementById("cabesa-tabla-lista-general").appendChild(cabeseras);
    
//     for(let documento in registros){
//         /////FECHA
//         const item1=document.createElement('td');
//         item1.textContent=registros[documento][0];
//         ////DOCUMENTO
//         const item2=document.createElement('td');
//         item2.textContent=registros[documento][1];
//         item2.addEventListener("click",()=>factura_informacion(registros[documento][1]))
//         ///CLIENTE
//         const item3=document.createElement('td');
//         item3.textContent=registros[documento][2];
//         ////HORA
//         const item4=document.createElement('td');
//         item4.textContent=registros[documento][3];
//         ////ZONAS
//         const item5=document.createElement('td');
//         item5.textContent=registros[documento][4];
//         ////Z1 IMPRESION
//         const item6=document.createElement('td');
//         registros[documento][5]==0 ? item6.textContent="NO":item6.textContent="SI";
//         ////Z2 IMPRESION
//         const item7=document.createElement('td');
//         registros[documento][6]==0 ? item7.textContent="NO":item7.textContent="SI";
//         ////Z3 IMPRESION
//         const item8=document.createElement('td');
//         registros[documento][7]==0 ? item8.textContent="NO":item8.textContent="SI";
//         ////desconocido IMPRESION
//         const item9=document.createElement('td');
//         registros[documento][8]==0 ? item9.textContent="NO":item9.textContent="SI";
//         ////Z1 PICK
//         const item10=document.createElement('td');
//         registros[documento][9]==0 ? item10.textContent="NO":item10.textContent="SI";
//         ////Z2 PICK
//         const item11=document.createElement('td');
//         registros[documento][10]==0 ? item11.textContent="NO":item11.textContent="SI";
//         ////Z3 PICK
//         const item12=document.createElement('td');
//         registros[documento][11]==0 ? item12.textContent="NO":item12.textContent="SI";
//         ////desconocido PICK
//         const item13=document.createElement('td');
//         registros[documento][12]==0 ? item13.textContent="NO":item13.textContent="SI";
//         ////Z1 CONFIRMACION
//         const item14=document.createElement('td');
//         registros[documento][13]==0 ? item14.textContent="NO":item14.textContent="SI";
//         ////Z2 CONFIRMACION
//         const item15=document.createElement('td');
//         registros[documento][14]==0 ? item15.textContent="NO":item15.textContent="SI";
//         ////Z3 CONFIRMACION
//         const item16=document.createElement('td');
//         registros[documento][15]==0 ? item16.textContent="NO":item16.textContent="SI";
//         ////desconocido CONFIRMACION
//         const item17=document.createElement('td');
//         registros[documento][16]==0 ? item17.textContent="NO":item17.textContent="SI";
//         ////Z1 USUARIO
//         const item18=document.createElement('td');
//         item18.textContent=registros[documento][17];
//         ////Z2 USUARIO
//         const item19=document.createElement('td');
//         item19.textContent=registros[documento][18];
//         ////Z3 USUARIO
//         const item20=document.createElement('td');
//         item20.textContent=registros[documento][19];
//         ////desconocido USUARIO
//         const item21=document.createElement('td');
//         item21.textContent=registros[documento][20];
//         ////BOTON DE CHECKING
//         const item22=document.createElement("button");
//         if(registros[documento][21]==0){item22.textContent="FALTA"}
//         else{
//             item22.setAttribute("id","chk"+registros[documento][1]);
//             item22.textContent="checking";
//             item22.addEventListener("click",()=>estado_cambio_checking(registros[documento][1],registros[documento][4],registros[documento][22]));
//         }        

//         const armason=document.createElement("tr");
//         armason.appendChild(item1)
//         armason.appendChild(item2)
//         armason.appendChild(item3)
//         armason.appendChild(item4)
//         armason.appendChild(item5)
//         armason.appendChild(item6)
//         armason.appendChild(item7)
//         armason.appendChild(item8)
//         armason.appendChild(item9)
//         armason.appendChild(item10)
//         armason.appendChild(item11)
//         armason.appendChild(item12)
//         armason.appendChild(item13)
//         armason.appendChild(item14)
//         armason.appendChild(item15)
//         armason.appendChild(item16)
//         armason.appendChild(item17)
//         armason.appendChild(item18)
//         armason.appendChild(item19)
//         armason.appendChild(item20)
//         armason.appendChild(item21)
//         armason.appendChild(item22)
//         document.getElementById("tabla-lista-general").appendChild(armason);
//     }
// })

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
            boton.addEventListener("click",()=>estado_cambio_checking(registros[doc][0],registros[doc][3],registros[doc][2]));
        }   

        const fila=document.createElement('tr');
        fila.appendChild(documento)
        fila.appendChild(estado)
        fila.appendChild(boton)

        cuerpo.appendChild(fila);
    }
    document.getElementById("tablero-maestro-control-fin").appendChild(cuerpo)
})