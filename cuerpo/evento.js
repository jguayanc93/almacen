let boton_enviar=document.getElementById("send-factura");
let suitch = document.getElementById("prender-apagar");
// let pikear=document.getElementById("ejecutame");

suitch.addEventListener("click",()=>{
    if(socket.connected){
        suitch.innerHTML='conectar';
        socket.disconnect();
    }
    else{
        suitch.innerHTML='desconectar';
        socket.connect();
    }
})

boton_enviar.addEventListener("click",()=>{
    let numero_factura=document.getElementById("nfactura");

    if(numero_factura.value){
        socket.emit('numero documento',numero_factura.value)
        numero_factura.value="";
    }
})

// pikear.addEventListener("click",()=>{
//     socket.emit('estado pick','cambiar estado');
// })