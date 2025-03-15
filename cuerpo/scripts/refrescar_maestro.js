socket.on('f5 v',(mensaje)=>{
    socket.emit('ventanilla');
})

socket.on('retornar',(mensaje)=>{
    socket.emit('local provincia');
})