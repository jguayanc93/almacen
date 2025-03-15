function factura_informacion(documento){ socket.emit('pedir informacion',documento) }
// function factura_informacion(documento){
//     socket.emit('descargar archivo',documento)
// }

socket.on('enviar informacion',(data)=>{
    document.getElementById("data1").textContent=data[0][0];
    document.getElementById("data2").textContent=data[0][1];
    document.getElementById("data3").textContent=data[0][2];
    document.getElementById("data4").textContent=data[0][3];
    document.getElementById("data5").textContent=data[0][4];
    document.getElementById("data6").textContent=data[0][5];
    document.getElementById("data7").textContent=data[0][6];
    document.getElementById("data8").textContent=data[0][7];
    document.getElementById("data9").textContent=data[0][8];
    document.getElementById("data10").textContent=data[0][9];
})


///////AUN EN TEST NO MOVER
socket.on('enviando archivo',(data,doc)=>{
    const blob = new Blob([data]);
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=doc+'.pdf';
    link.click();
})