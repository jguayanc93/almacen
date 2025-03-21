socket.on('f5 v',(mensaje)=>{
    socket.emit('ventanilla');
})

socket.on('f5 a1',(mensaje)=>{
    socket.emit('almacen principal',1);
    // socket.emit('almacen mym',8);
})

socket.on('f5 a8',(mensaje)=>{
    socket.emit('almacen mym',8);
})