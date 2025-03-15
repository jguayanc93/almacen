
document.getElementById("ventanilla").addEventListener("click",()=>pasando_a_ventanilla())

function pasando_a_ventanilla(){
    let user=window.prompt("ventanilla usuario","aqui digitar numero de trabajador");
    if(user===null || user===''){ alert("valor no aceptable vuelve a intentarlo") }
    else{
        document.getElementById("distribucion").innerHTML="";
        socket.emit('ventanilla',user);
    }
}

socket.on('ventanilla impresos',(registros)=>{
    document.getElementById("tabla-lista").innerHTML="";
    document.getElementById("tabla-lista-impreso").innerHTML="";
    document.getElementById("tabla-lista-picking").innerHTML="";


    document.getElementById("cabesa-tabla-lista-general").innerHTML="";
    document.getElementById("tabla-lista-general").innerHTML="";
    const head1=document.createElement('th')
    head1.textContent="FECHA";
    const head2=document.createElement('th')
    head2.textContent="DOCUMENTO";
    const head3=document.createElement('th')
    head3.textContent="CLIENTE";
    const head4=document.createElement('th')
    head4.textContent="HORA";
    const head5=document.createElement('th')
    head5.textContent="ZONAS";
    const head6=document.createElement('th')
    head6.textContent="IMPR.Z1";
    const head7=document.createElement('th')
    head7.textContent="IMPR.Z2";
    const head8=document.createElement('th')
    head8.textContent="IMPR.Z3";
    const head9=document.createElement('th')
    head9.textContent="IMPR.desconocido";
    const head10=document.createElement('th')
    head10.textContent="PICK.Z1";
    const head11=document.createElement('th')
    head11.textContent="PICK.Z2";
    const head12=document.createElement('th')
    head12.textContent="PICK.Z3";
    const head13=document.createElement('th')
    head13.textContent="PICK.DESCONOCIDO";
    const head14=document.createElement('th')
    head14.textContent="CONF.Z1";
    const head15=document.createElement('th')
    head15.textContent="CONF.Z2";
    const head16=document.createElement('th')
    head16.textContent="CONF.Z3";
    const head17=document.createElement('th')
    head17.textContent="CONF.DESCONOCIDO";
    const head18=document.createElement('th')
    head18.textContent="USER.Z1";
    const head19=document.createElement('th')
    head19.textContent="USER.Z2";
    const head20=document.createElement('th')
    head20.textContent="USER.Z3";
    const head21=document.createElement('th')
    head21.textContent="USER.DESCONOCIDO";
    const head22=document.createElement('th')
    head22.textContent="ACCION";
    
    const cabeseras=document.createElement("tr");
    cabeseras.appendChild(head1)
    cabeseras.appendChild(head2)
    cabeseras.appendChild(head3)
    cabeseras.appendChild(head4)
    cabeseras.appendChild(head5)
    cabeseras.appendChild(head6)
    cabeseras.appendChild(head7)
    cabeseras.appendChild(head8)
    cabeseras.appendChild(head9)
    cabeseras.appendChild(head10)
    cabeseras.appendChild(head11)
    cabeseras.appendChild(head12)
    cabeseras.appendChild(head13)
    cabeseras.appendChild(head14)
    cabeseras.appendChild(head15)
    cabeseras.appendChild(head16)
    cabeseras.appendChild(head17)
    cabeseras.appendChild(head18)
    cabeseras.appendChild(head19)
    cabeseras.appendChild(head20)
    cabeseras.appendChild(head21)
    cabeseras.appendChild(head22)
    document.getElementById("cabesa-tabla-lista-general").appendChild(cabeseras);
    
    for(let documento in registros){
        /////FECHA
        const item1=document.createElement('td');
        item1.textContent=registros[documento][0];
        ////DOCUMENTO
        const item2=document.createElement('td');
        item2.textContent=registros[documento][1];
        item2.addEventListener("click",()=>factura_informacion(registros[documento][1]))
        ///CLIENTE
        const item3=document.createElement('td');
        item3.textContent=registros[documento][2];
        ////HORA
        const item4=document.createElement('td');
        item4.textContent=registros[documento][3];
        ////ZONAS
        const item5=document.createElement('td');
        item5.textContent=registros[documento][4];
        ////Z1 IMPRESION
        const item6=document.createElement('td');
        registros[documento][5]==0 ? item6.textContent="NO":item6.textContent="SI";
        ////Z2 IMPRESION
        const item7=document.createElement('td');
        registros[documento][6]==0 ? item7.textContent="NO":item7.textContent="SI";
        ////Z3 IMPRESION
        const item8=document.createElement('td');
        registros[documento][7]==0 ? item8.textContent="NO":item8.textContent="SI";
        ////desconocido IMPRESION
        const item9=document.createElement('td');
        registros[documento][8]==0 ? item9.textContent="NO":item9.textContent="SI";
        ////Z1 PICK
        const item10=document.createElement('td');
        registros[documento][9]==0 ? item10.textContent="NO":item10.textContent="SI";
        ////Z2 PICK
        const item11=document.createElement('td');
        registros[documento][10]==0 ? item11.textContent="NO":item11.textContent="SI";
        ////Z3 PICK
        const item12=document.createElement('td');
        registros[documento][11]==0 ? item12.textContent="NO":item12.textContent="SI";
        ////desconocido PICK
        const item13=document.createElement('td');
        registros[documento][12]==0 ? item13.textContent="NO":item13.textContent="SI";
        ////Z1 CONFIRMACION
        const item14=document.createElement('td');
        registros[documento][13]==0 ? item14.textContent="NO":item14.textContent="SI";
        ////Z2 CONFIRMACION
        const item15=document.createElement('td');
        registros[documento][14]==0 ? item15.textContent="NO":item15.textContent="SI";
        ////Z3 CONFIRMACION
        const item16=document.createElement('td');
        registros[documento][15]==0 ? item16.textContent="NO":item16.textContent="SI";
        ////desconocido CONFIRMACION
        const item17=document.createElement('td');
        registros[documento][16]==0 ? item17.textContent="NO":item17.textContent="SI";
        ////Z1 USUARIO
        const item18=document.createElement('td');
        item18.textContent=registros[documento][17];
        ////Z2 USUARIO
        const item19=document.createElement('td');
        item19.textContent=registros[documento][18];
        ////Z3 USUARIO
        const item20=document.createElement('td');
        item20.textContent=registros[documento][19];
        ////desconocido USUARIO
        const item21=document.createElement('td');
        item21.textContent=registros[documento][20];
        ////BOTON DE CHECKING
        const item22=document.createElement("button");
        if(registros[documento][21]==0){item22.textContent="FALTA"}
        else{
            item22.setAttribute("id","chk"+registros[documento][1]);
            item22.textContent="checking";
            item22.addEventListener("click",()=>estado_cambio_checking(registros[documento][1],registros[documento][4],registros[documento][22]));
        }        

        const armason=document.createElement("tr");
        armason.appendChild(item1)
        armason.appendChild(item2)
        armason.appendChild(item3)
        armason.appendChild(item4)
        armason.appendChild(item5)
        armason.appendChild(item6)
        armason.appendChild(item7)
        armason.appendChild(item8)
        armason.appendChild(item9)
        armason.appendChild(item10)
        armason.appendChild(item11)
        armason.appendChild(item12)
        armason.appendChild(item13)
        armason.appendChild(item14)
        armason.appendChild(item15)
        armason.appendChild(item16)
        armason.appendChild(item17)
        armason.appendChild(item18)
        armason.appendChild(item19)
        armason.appendChild(item20)
        armason.appendChild(item21)
        armason.appendChild(item22)
        document.getElementById("tabla-lista-general").appendChild(armason);
    }
})

/////////PROTOTIPO PARA MOSTRAR LA TABLA MAESTRO DESTRUCTURADA
socket.on('ventanilla mestro nuevos',(registros)=>{
    document.getElementById("tablero-maestro-control").innerHTML="";
    for(let doc in registros){
        const fecha=document.createElement('span');
        fecha.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        fecha.textContent=registros[doc][0];

        const numero=document.createElement('span');
        numero.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        numero.textContent=registros[doc][1];

        const cliente=document.createElement('span');
        cliente.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        cliente.textContent=registros[doc][2];

        const hora=document.createElement('span');
        hora.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        hora.textContent=registros[doc][3];

        const zonas=document.createElement('span');
        zonas.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        zonas.textContent=registros[doc][4];

        const z1impresion=document.createElement('span');
        z1impresion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z1impresion.textContent=registros[doc][5];

        const z2impresion=document.createElement('span');
        z2impresion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z2impresion.textContent=registros[doc][6];

        const z3impresion=document.createElement('span');
        z3impresion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z3impresion.textContent=registros[doc][7];

        const desconocidoimpresion=document.createElement('span');
        desconocidoimpresion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        desconocidoimpresion.textContent=registros[doc][8];

        const z1pick=document.createElement('span');
        z1pick.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z1pick.textContent=registros[doc][9];

        const z2pick=document.createElement('span');
        z2pick.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z2pick.textContent=registros[doc][10];

        const z3pick=document.createElement('span');
        z3pick.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z3pick.textContent=registros[doc][11];

        const desconocidopick=document.createElement('span');
        desconocidopick.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        desconocidopick.textContent=registros[doc][12];

        const z1confirmacion=document.createElement('span');
        z1confirmacion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z1confirmacion.textContent=registros[doc][13];

        const z2confirmacion=document.createElement('span');
        z2confirmacion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z2confirmacion.textContent=registros[doc][14];

        const z3confirmacion=document.createElement('span');
        z3confirmacion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z3confirmacion.textContent=registros[doc][15];

        const desconocidoconfirmacion=document.createElement('span');
        desconocidoconfirmacion.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        desconocidoconfirmacion.textContent=registros[doc][16];

        const z1usuario=document.createElement('span');
        z1usuario.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z1usuario.textContent=registros[doc][17];

        const z2usuario=document.createElement('span');
        z2usuario.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z2usuario.textContent=registros[doc][18];

        const z3usuario=document.createElement('span');
        z3usuario.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        z3usuario.textContent=registros[doc][19];

        const desconocidousuario=document.createElement('span');
        desconocidousuario.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        desconocidousuario.textContent=registros[doc][20];

        const pickfinal=document.createElement('span');
        pickfinal.className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset";
        pickfinal.textContent=registros[doc][21];

        const conenedor=document.createElement('div');
        conenedor.appendChild(fecha)
        conenedor.appendChild(numero)
        conenedor.appendChild(cliente)
        conenedor.appendChild(hora)
        conenedor.appendChild(zonas)
        conenedor.appendChild(z1impresion)
        conenedor.appendChild(z2impresion)
        conenedor.appendChild(z3impresion)
        conenedor.appendChild(desconocidoimpresion)
        conenedor.appendChild(z1pick)
        conenedor.appendChild(z2pick)
        conenedor.appendChild(z3pick)
        conenedor.appendChild(desconocidopick)
        conenedor.appendChild(z1confirmacion)
        conenedor.appendChild(z2confirmacion)
        conenedor.appendChild(z3confirmacion)
        conenedor.appendChild(desconocidoconfirmacion)
        conenedor.appendChild(z1usuario)
        conenedor.appendChild(z2usuario)
        conenedor.appendChild(z3usuario)
        conenedor.appendChild(desconocidousuario)
        conenedor.appendChild(pickfinal)
        document.getElementById("tablero-maestro-control").appendChild(conenedor)
    }    

})