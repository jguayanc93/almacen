socket.on('f5 v',(mensaje)=>{
    socket.emit('ventanilla','ninguno');
})

// socket.on('f5 a1',(mensaje,enviar)=>{    
//     refresco(mensaje,enviar)
//     // socket.emit('almacen principal',1);
// })

// socket.on('f5 a8',(mensaje,enviar)=>{
//     refresco(mensaje,enviar);
//     // socket.emit('almacen mym',8);
// })

// document.getElementById('mostrarzone').addEventListener('click',()=>socket.emit('trae zone'))
// socket.on('zone traido',(zone)=>{console.log(zone)})

socket.on('f5',()=>refresco())