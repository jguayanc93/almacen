////EMISOR DE EVENTOS
function emitir_eventos(evento,enviar){
    console.log(evento);
    if(evento!==""){
        nombre_ev_actual=evento;
        valor_ev_actual=enviar;
        socket.emit(evento,enviar);
    }
}
////OBSERVADOR GENERAL DE CLIENTE
function observador_emisor(){
    detener();
    pedidor=setInterval(()=>socket.emit('registros fecha','cuentalos'),3000);
}

observador_emisor()////MANTENER ACTIVO SIEMPRE QUE SE CONECTE CLIENTE PARA COMENSAR A OBSERVAR