/////////EXTRACCION DE ZONAS SEGUN ALMACEN EVENTOS DISCRIMINATORIOS
document.getElementById("ventanilla").addEventListener("click",(e)=>{
    e.preventDefault();
    pasando_a_ventanilla();
    loadMenuItem('ventanilla');
})

function pasando_a_ventanilla(){
    document.getElementById("distribucion").innerHTML="";
    emitir_eventos('ventanilla',0)
}

// Función auxiliar para togglear accordion
function toggleAccordion(accordionContentId, buttonId) {
    const content = document.getElementById(accordionContentId);
    const button = document.getElementById(buttonId);
    const icon = button ? button.querySelector('.accordion-icon') : null;
    if (!content) return;
    
    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
    
    if (isOpen) {
        content.style.maxHeight = '0px';
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(90deg)';
    }
}

////////ALMACEN PRINCIPAL
document.getElementById("almprincipal").addEventListener("click",(e)=>{
    e.preventDefault();
    toggleAccordion('almprincipal-opc', 'almprincipal');
})

document.getElementById("alm1").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('almacen principal',1)
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('almacen-principal');
})

///////EMISORES DE ZONAS
document.getElementById("Z1").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','Z1');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-1');
})
document.getElementById("Z2").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','Z2');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-2');
})
document.getElementById("Z3").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','Z3');
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-3');
})
document.getElementById("desconocido").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('cambio zona','desconocido')
    toggleAccordion('almprincipal-opc', 'almprincipal');
    loadMenuItem('zona-desconocido');
})

////////////ALMACEN MYM
document.getElementById("almmym").addEventListener("click",(e)=>{
    e.preventDefault();
    toggleAccordion('almmym-opc', 'almmym');
})

document.getElementById("alm8").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('almacen mym',8);
    toggleAccordion('almmym-opc', 'almmym');
    loadMenuItem('zona-unica');
})

//////DESPACHO
document.getElementById("despacho").addEventListener("click",(e)=>{
    e.preventDefault();
    toggleAccordion('despacho-opc', 'despacho');
    emitir_eventos('despacho', null);
    loadMenuItem('despacho-principal');
})

document.getElementById("despachop").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('despacho',1);
    toggleAccordion('despacho-opc', 'despacho');
    loadMenuItem('despacho-principal');
})
document.getElementById("despachom").addEventListener("click",(e)=>{
    e.preventDefault();
    emitir_eventos('despacho',8);
    toggleAccordion('despacho-opc', 'despacho');
    loadMenuItem('despacho-mym');
})

/////ACCIONES PARA MOSTRAR EL CONTENEDOR FLOTANTE DE INFORMACION DETALLADA
const flotanteCerrar = document.getElementById("flotante-cerrar");
if (flotanteCerrar) {
    flotanteCerrar.addEventListener('click',()=>{
        document.getElementById("flotante-superior").classList.add("hidden");
    });
}