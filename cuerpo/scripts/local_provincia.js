
// document.getElementById("lp").addEventListener("click",()=>crear_combo())

// function crear_combo(){
//     document.getElementById("distribucion").innerHTML="";
//     socket.emit('local provincia');

//     let select = document.createElement("select");
//     select.setAttribute("id","zonas")
//     select.addEventListener("change",()=>{
//         document.getElementById("cabesa-tabla-lista-general").innerHTML="";
//         document.getElementById("tabla-lista-general").innerHTML="";
//         document.getElementById("cabesa-tabla-lista-general2").innerHTML="";
//         document.getElementById("tabla-lista-general2").innerHTML="";
//         document.getElementById("cabesa-tabla-lista-general3").innerHTML="";
//         document.getElementById("tabla-lista-general3").innerHTML="";
        
//         let zona=document.getElementById("zonas").value;
//         socket.emit('cambio zona',zona);
//     })

//     let opcion1=document.createElement("option")
//     opcion1.setAttribute("value","MASTER");
//     opcion1.textContent="ZONA MASTER";

//     let opcion2=document.createElement("option")
//     opcion2.setAttribute("value","Z1");
//     opcion2.textContent="ZONA 1";

//     let opcion3=document.createElement("option")
//     opcion3.setAttribute("value","Z2");
//     opcion3.textContent="ZONA 2";

//     let opcion4=document.createElement("option")
//     opcion4.setAttribute("value","Z3");
//     opcion4.textContent="ZONA 3";

//     let opcion5=document.createElement("option")
//     opcion5.setAttribute("value","desconocido");
//     opcion5.textContent="ZONA DESCONOCIDA";

//     select.appendChild(opcion1)
//     select.appendChild(opcion2)
//     select.appendChild(opcion3)
//     select.appendChild(opcion4)
//     select.appendChild(opcion5)

//     document.getElementById("distribucion").appendChild(select);
// }

document.getElementById("lp").addEventListener("click",()=>{
    // socket.emit('local provincia');
    document.getElementById("almacenes").classList.toggle('hidden');
})
///////RECORDATORIO TERMINAR LA SEPARACION DE ALMACENES DE PRINCIPAL Y M&M NO PUEDEN ESTAR JUNTOS
document.getElementById("alm1").addEventListener("click",()=>{
    // socket.emit('local provincia',1);
    socket.emit('almacen principal',1);
    document.getElementById("almacenes").classList.toggle('hidden');
})

document.getElementById("alm8").addEventListener("click",()=>{
    // socket.emit('local provincia',8);
    socket.emit('almacen mym',8);
    document.getElementById("almacenes").classList.toggle('hidden');
})

document.getElementById("Z1").addEventListener("click",()=>socket.emit('cambio zona','Z1'))
document.getElementById("Z2").addEventListener("click",()=>socket.emit('cambio zona','Z2'))
document.getElementById("Z3").addEventListener("click",()=>socket.emit('cambio zona','Z3'))
document.getElementById("desconocido").addEventListener("click",()=>socket.emit('cambio zona','desconocido'))