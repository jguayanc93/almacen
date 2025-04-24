////EMISOR DE EVENTOS
function emitir_eventos(evento,enviar){
    //console.log(evento);
    if(evento!==""){
        nombre_ev_actual=evento;
        valor_ev_actual=enviar;
        socket.emit(evento,enviar);
    }
}
////EMIR DE REFRESCO EN TESTEO
// function refresco(evento,enviar){
function refresco(){
    if(nombre_ev_actual!=="") socket.emit(nombre_ev_actual,valor_ev_actual);
}
////OBSERVADOR GENERAL DE CLIENTE
function observador_emisor(){
    detener();
    pedidor=setInterval(()=>socket.emit('registros fecha','cuentalos'),3000);
}
//////////TERMINA LA PARTE DEL OBSERVADOR DE REGISTROS PARA EL REFRESCO GENERAL PARA HOY
observador_emisor()////MANTENER ACTIVO SIEMPRE QUE SE CONECTE CLIENTE PARA COMENSAR A OBSERVAR