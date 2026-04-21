////EMISOR DE EVENTOS
// function emitir_eventos(evento,enviar){
//     //console.log(evento);
//     if(evento!==""){
//         nombre_ev_actual=evento;
//         valor_ev_actual=enviar;
//         socket.emit(evento,enviar);
//     }
// }
////otra version en testeo
function emitir_eventos(evento,enviar,salida){
    //console.log(evento);
    if(evento!==""){
        nombre_ev_actual=evento;
        valor_ev_actual=enviar;
        salida_ev_actual=salida;
        socket.emit(evento,enviar,salida);
    }
}
////EMIR DE REFRESCO EN TESTEO
// function refresco(evento,enviar){
function refresco(){
    // if(nombre_ev_actual!=="") socket.emit(nombre_ev_actual,valor_ev_actual);
    if(nombre_ev_actual!=="") socket.emit(nombre_ev_actual,valor_ev_actual,salida_ev_actual);
}
////OBSERVADOR GENERAL DE CLIENTE
function observador_emisor(){
    detener();
    pedidor=setInterval(()=>socket.emit('registros fecha','cuentalos'),3000);
}
//////////TERMINA LA PARTE DEL OBSERVADOR DE REGISTROS PARA EL REFRESCO GENERAL PARA HOY
observador_emisor()////MANTENER ACTIVO SIEMPRE QUE SE CONECTE CLIENTE PARA COMENSAR A OBSERVAR