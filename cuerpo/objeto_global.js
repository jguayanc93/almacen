const socket=io();

// const socket=io({
//     auth:{
//         serverOffset:0
//     }
// });

// const socket=io({
//     ackTimeout:10000,
//     retries:3,
//     auth:{serverOffset:0}
// });

var pedidor=null;
var contadorxglobalxcliente=1;
var nombre_ev_actual="";/////CAPTURAR MOMENTANEAMENTE EL NOMBRE DEL EVENTO ACTUAL
var valor_ev_actual="";////CAPTURAR EL VALOR PASADO AL EVENTO ACTUAL

function detener(){clearInterval(pedidor);}