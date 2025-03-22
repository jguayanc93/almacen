socket.on('f5 v',(mensaje)=>{
    socket.emit('ventanilla');
})

socket.on('f5 a1',(mensaje)=>{
    console.log("error de refresco de almacen de 1")
    socket.emit('almacen principal',1);
    // socket.emit('almacen mym',8);
})

socket.on('f5 a8',(mensaje)=>{
    console.log("error de refresco de almacen de 8")
    socket.emit('almacen mym',8);
})