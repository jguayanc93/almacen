// const socket=io();

const socket=io({
    auth:{
        serverOffset:0
    }
});

// const socket=io({
//     ackTimeout:10000,
//     retries:3,
//     auth:{serverOffset:0}
// });

var pedidor=null;

function detener(){clearInterval(pedidor);}