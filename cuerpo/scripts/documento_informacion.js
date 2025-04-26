function factura_informacion(documento){
    document.getElementById("detallado-completo").innerHTML="";
    document.getElementById("flotante-superior").classList.remove('hidden');
    socket.emit('pedir items',documento);
}

function factura_observacion(documento){
    document.getElementById("detallado-completo").innerHTML="";
    document.getElementById("flotante-superior").classList.remove('hidden');
    socket.emit('pedir destinos',documento);
}
///RELLENAR LOS CAMPOS DE LOS ITEMS PEDIDOS
socket.on('enviar informacion',(data)=>{
    
    let contenedor=document.getElementById('detallado-completo');
    for(const item in data){
        const elemento1=document.createElement('input');
        elemento1.type='checkbox';
        // elemento1.checked=true;
        elemento1.name='size-choice';
        elemento1.value='L';
        elemento1.className='sr-only peer';

        const elemento2=document.createElement('span');
        elemento2.textContent=data[item][0];

        const elemento5=document.createElement('span');
        elemento5.textContent="/"+data[item][1];

        const elemento3=document.createElement('span');
        elemento3.className="pointer-events-none absolute -inset-px rounded-md peer-checked:border border-indigo-500";
        elemento3.ariaHidden="true"

        const agrupador=document.createElement('label');
        agrupador.className="group relative flex cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-3 text-sm font-medium text-gray-900 uppercase shadow-xs hover:bg-gray-50 focus:outline-hidden sm:flex-1";
        agrupador.appendChild(elemento1)
        agrupador.appendChild(elemento2)
        agrupador.appendChild(elemento5)
        agrupador.appendChild(elemento3)

        contenedor.appendChild(agrupador);
    }
})

///RELLENAR LOS CAMPOS DE LOS ITEMS PEDIDOS
socket.on('comprobar destino',(data)=>{
    let contenedor=document.getElementById('detallado-completo');
    for(const item in data){
        const elemento1=document.createElement('div');
        elemento1.className="py-1";
        elemento1.role="none";
        const anclaje1=document.createElement('a')
        anclaje1.href="#";
        anclaje1.className="block px-4 py-2 text-sm text-gray-700";
        anclaje1.role="menuitem";
        anclaje1.tabIndex="-1"
        anclaje1.textContent="DOCUMENTO"
        const documento=document.createElement('a')
        documento.href="#";
        documento.className="block px-4 py-2 text-sm text-gray-700";
        documento.role="menuitem";
        documento.tabIndex="-1"
        documento.textContent=data[item][0]
        elemento1.appendChild(anclaje1);
        elemento1.appendChild(documento);

        const elemento2=document.createElement('div');
        elemento2.className="py-1";
        elemento2.role="none";
        const anclaje2=document.createElement('a')
        anclaje2.href="#";
        anclaje2.className="block px-4 py-2 text-sm text-gray-700";
        anclaje2.role="menuitem";
        anclaje2.tabIndex="-1"
        anclaje2.textContent="CLIENTE"
        const cliente=document.createElement('a')
        cliente.href="#";
        cliente.className="block px-4 py-2 text-sm text-gray-700";
        cliente.role="menuitem";
        cliente.tabIndex="-1"
        cliente.textContent=data[item][1]
        elemento2.appendChild(anclaje2);
        elemento2.appendChild(cliente);

        const elemento3=document.createElement('div');
        elemento3.className="py-1";
        elemento3.role="none";
        const anclaje3=document.createElement('a')
        anclaje3.href="#";
        anclaje3.className="block px-4 py-2 text-sm text-gray-700";
        anclaje3.role="menuitem";
        anclaje3.tabIndex="-1"
        anclaje3.textContent="DESPACHO"
        const despacho=document.createElement('a')
        despacho.href="#";
        despacho.className="block px-4 py-2 text-sm text-gray-700";
        despacho.role="menuitem";
        despacho.tabIndex="-1"
        despacho.textContent=data[item][2]
        elemento3.appendChild(anclaje3)
        elemento3.appendChild(despacho)

        const elemento4=document.createElement('div');
        elemento4.className="py-1";
        elemento4.role="none";
        const anclaje4=document.createElement('a')
        anclaje4.href="#";
        anclaje4.className="block px-4 py-2 text-sm text-gray-700";
        anclaje4.role="menuitem";
        anclaje4.tabIndex="-1"
        anclaje4.textContent="DEPARTAMENTO";
        const departamento=document.createElement('a')
        departamento.href="#";
        departamento.className="block px-4 py-2 text-sm text-gray-700";
        departamento.role="menuitem";
        departamento.tabIndex="-1"
        departamento.textContent=data[item][3]
        elemento4.appendChild(anclaje4)
        elemento4.appendChild(departamento)

        const elemento5=document.createElement('div');
        elemento5.className="py-1";
        elemento5.role="none";
        const anclaje5=document.createElement('a')
        anclaje5.href="#";
        anclaje5.className="block px-4 py-2 text-sm text-gray-700";
        anclaje5.role="menuitem";
        anclaje5.tabIndex="-1"
        anclaje5.textContent="PROVINCIA";
        const provincia=document.createElement('a')
        provincia.href="#";
        provincia.className="block px-4 py-2 text-sm text-gray-700";
        provincia.role="menuitem";
        provincia.tabIndex="-1"
        provincia.textContent=data[item][4]
        elemento5.appendChild(anclaje5)
        elemento5.appendChild(provincia)

        const elemento6=document.createElement('div');
        elemento6.className="py-1";
        elemento6.role="none";
        const anclaje6=document.createElement('a')
        anclaje6.href="#";
        anclaje6.className="block px-4 py-2 text-sm text-gray-700";
        anclaje6.role="menuitem";
        anclaje6.tabIndex="-1"
        anclaje6.textContent="DESTINO"
        const destino=document.createElement('a')
        destino.href="#";
        destino.className="block px-4 py-2 text-sm text-gray-700";
        destino.role="menuitem";
        destino.tabIndex="-1"
        destino.textContent=data[item][5]
        elemento6.appendChild(anclaje6)
        elemento6.appendChild(destino)

        const elemento7=document.createElement('div');
        elemento7.className="py-1";
        elemento7.role="none";
        const anclaje7=document.createElement('a')
        anclaje7.href="#";
        anclaje7.className="block px-4 py-2 text-sm text-gray-700";
        anclaje7.role="menuitem";
        anclaje7.tabIndex="-1"
        anclaje7.textContent="TRANSPORTISTA"
        const currier=document.createElement('a')
        currier.href="#";
        currier.className="block px-4 py-2 text-sm text-gray-700";
        currier.role="menuitem";
        currier.tabIndex="-1"
        currier.textContent=data[item][6]
        elemento7.appendChild(anclaje7)
        elemento7.appendChild(currier)

        const elemento8=document.createElement('div');
        elemento8.className="py-1";
        elemento8.role="none";
        const anclaje8=document.createElement('a')
        anclaje8.href="#";
        anclaje8.className="block px-4 py-2 text-sm text-gray-700";
        anclaje8.role="menuitem";
        anclaje8.tabIndex="-1"
        anclaje8.textContent="OBSERVACION"
        const observacion=document.createElement('a')
        observacion.href="#";
        observacion.className="block px-4 py-2 text-sm text-gray-700";
        observacion.role="menuitem";
        observacion.tabIndex="-1"
        observacion.textContent=data[item][7]
        elemento8.appendChild(anclaje8)
        elemento8.appendChild(observacion)

        const elemento9=document.createElement('div');
        elemento9.className="py-1";
        elemento9.role="none";
        const anclaje9=document.createElement('a')
        anclaje9.href="#";
        anclaje9.className="block px-4 py-2 text-sm text-gray-700";
        anclaje9.role="menuitem";
        anclaje9.tabIndex="-1"
        anclaje9.textContent="VENDEDOR"
        const vendedor=document.createElement('a')
        vendedor.href="#";
        vendedor.className="block px-4 py-2 text-sm text-gray-700";
        vendedor.role="menuitem";
        vendedor.tabIndex="-1"
        vendedor.textContent=data[item][8]
        elemento9.appendChild(anclaje9)
        elemento9.appendChild(vendedor)

        const agrupador=document.createElement('div')
        agrupador.className="relative right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden";
        agrupador.role="menu";
        agrupador.ariaOrientation="vertical";
        agrupador.tabIndex="-1";

        agrupador.appendChild(elemento1)
        agrupador.appendChild(elemento2)
        agrupador.appendChild(elemento3)
        agrupador.appendChild(elemento4)
        agrupador.appendChild(elemento5)
        agrupador.appendChild(elemento6)
        agrupador.appendChild(elemento7)
        agrupador.appendChild(elemento8)
        agrupador.appendChild(elemento9)

        contenedor.appendChild(agrupador);
    }    
})


///////AUN EN TEST NO MOVER
socket.on('enviando archivo',(data,doc)=>{
    console.log(data)
    console.log(doc)
    // const blob = new Blob([data]);
    // const blob = new Blob([data],{type:'application/pdf'});
    const blob = new Blob([new Uint8Array(data)],{type:'application/pdf'});
    const link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=doc+'.pdf';
    link.click();
})